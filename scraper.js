const axios = require('axios').default;
const { HttpProxyAgent, HttpsProxyAgent } = require("hpagent");
const cheerio = require('cheerio');
const config = require('./config');
require('dotenv').config();

const agentConfig = {
    proxy: process.env.PROXY_LINK,
    keepAlive: true,
    keepAliveMsecs: 2000,
    maxSockets: 256,
    maxFreeSockets: 256,
  };


if(agentConfig.proxy) {
    axios.defaults.httpAgent = new HttpProxyAgent(agentConfig);
    axios.defaults.httpsAgent = new HttpsProxyAgent(agentConfig);
}

async function mainPageFinder(imdbId) {
    try {
        
        const editedId = imdbId.substring(2)
        const response = await axios({url:`https://turkcealtyazi.org/things_.php?t=99&term=${editedId}`, method:"GET", headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"}})

        if (response.status === 200){
            const mainPageURL = "https://turkcealtyazi.org" + response.data[0].url
            return mainPageURL
        } else {
            return mainPageURL = ""
        }
    } catch (e) {
        console.log("Subtitle page couldn't find on turkcealtyazi.org",e)
    }
}

async function subIDfinder(subLink) {
    try {

        const response = await axios({url:subLink, method:"GET", headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"}});

        $ = cheerio.load(response.data)
        let subIDs = []

        $('form[action="/ind"] > div').each((i, section) => {
            let idid = $(section).children('input[name="idid"]').attr('value')
            let altid = $(section).children('input[name="altid"]').attr('value')
            subIDs.push({idid,altid})    
        }).get()    

        return subIDs

    } catch (e) {
        console.log("Sub IDs could not found!",e)
    }
}

async function subtitlePageFinder(imdbId,type, season, episode) {
    
    try {

       let subtitlesData = [];

        //GOES TO THE MAIN PAGE FOR THE MOVIE/SERIES.
        const mainPageURL  = await mainPageFinder(imdbId)
        if(mainPageURL.length > 0){

            const mainPageHTML = await axios({url:mainPageURL,method:"GET", headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"}})
            
            $ = cheerio.load(mainPageHTML.data)
            
            //SCRAPES SUBTITLE PAGE LINK, SUBTITLE LANGUAGE AND CD NUMBER FOR MOVIES. 
            //IT DOESN'T SCRAPE IF CD NUMBER MORE THAN 1. 
            //IT DOESN'T SCRAPE IF THE SUBTITLE IS NOT TURKISH.
            if (type === "movie") {
                $('.altyazi-list-wrapper  > div > div').each((i, section) => {
                    let subPageURL = $(section).children('.alisim').children('.fl').children('a').attr('href');
                    let subLang = $(section).children('.aldil').children('span').attr('class')
                    let cd = Number($(section).children('.alcd').text().trim())
                    
                    if (subLang === "flagtr" && subPageURL !== undefined && cd === 1) {
                        
                        subPageURL = "https://turkcealtyazi.org" + subPageURL
                        subLang = subLang.substring(4)
                        subtitlesData.push({ lang:subLang , pageUrl: subPageURL})
                    }
                }).get()
            
            
            //SCRAPES SUBTITLE PAGE URL, SUBTITLE LANGUAGE, SEASON AND EPISODE NUMBER. IT LISTS ALSO SUBTITLE PACKS IF THE SEASON NUMBER MATCHS.
            } else {
                $('.altyazi-list-wrapper  > div > div').each((i, section) => {
                    let subPageURL = $(section).children('.alisim').children('.fl').children('a').attr('href');
                    let subLang = $(section).children('.aldil').children('span').attr('class');
                    let seasonNumber = $(section).children('.alcd').children('b').first().text().trim();
                    let episodeNumber = $(section).children('.alcd').children('b').last().text().trim();
                    
                    if(seasonNumber.indexOf("0") === 0){
                        seasonNumber = seasonNumber.substring(1)
                    }
                    
                    if(episodeNumber.indexOf("0") === 0){
                        episodeNumber = (episodeNumber.substring(1))
                    }

                    seasonNumber = Number(seasonNumber);
                    
                    if (episodeNumber === "Paket" || episodeNumber === "paket"){
                        episodeNumber = "Paket";
                    } else {
                        episodeNumber = Number(episodeNumber);
                    }
                    
                    if (subLang === "flagtr" && subPageURL !== undefined && season === seasonNumber) {
                        
                        if (episode === episodeNumber || episodeNumber === "Paket"){
                            subPageURL = "https://turkcealtyazi.org" + subPageURL
                            subLang = subLang.substring(4)
                            subtitlesData.push({ lang:subLang , pageUrl: subPageURL, season: seasonNumber, episode: episodeNumber})
                        }
                    }          
                }).get()
            }
                    
            //CREATES DOWNLOAD LINK FOR THE POST REQUEST.
            let stremioElements = []
            
            for (let i= 0; i <subtitlesData.length; i++) {
                let subIDs = await subIDfinder(subtitlesData[i].pageUrl)
                
                let idid = subIDs[0].idid
                let altid = subIDs[0].altid
                
                let lang = "tur"
                let url = `http://127.0.0.1:11470/subtitles.vtt?from=${config.local}/download/${idid}-${altid}.zip`
                
                stremioElements.push({url,lang,id:altid})
            }

            return stremioElements;
        
        }
    } catch (e) {
        console.error("Error happened on subtitlePageFinder",e);
        return stremioElements = []
    }
    
}

module.exports = subtitlePageFinder