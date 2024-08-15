// var env = process.env.NODE_ENV ? 'beamup':'local';
// const getProxy = require('./getProxy')

var port = process.env?.PORT ?? 3648

var config = {
    turkceAltyaziURL: 'turkcealtyazi.org',
    // proxy: getProxy()
    port: port,
    local: `http://${process.env.SERVER_IP ?? "127.0.0.1"}:${port}`,
}

// switch (env) {
//     //Public server build.
//     case 'beamup':
// 		config.port = process.env.PORT ?? 3648
//         config.local = "https://5a0d1888fa64-turkcealtyaziorg.baby-beamup.club"
//         break;

//     //Local sever build.
//     case 'local':
// 		config.port = process.env.PORT ?? 3648
//         config.local = `http://${process.env.SERVER_IP ?? "127.0.0.1"}:${config.port}`;
//         break;
// }

module.exports = config;