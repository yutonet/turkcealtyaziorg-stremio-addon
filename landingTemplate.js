const STYLESHEET = `
* {
   box-sizing: border-box;
}
body,
html {
   margin: 0px;
   padding: 0px;
   font-family: OpenSans, arial, sans-serif;
   font-weight: 300;
   color: white;
   width: 100%;
   height: 100%
}

html {
   background-size: auto 100%;
   background-size: cover;
   background-position: center center;
   background-repeat: no-repeat
}

body {
   background: rgba(0, 0, 0, 0.65)
}

h1, h2, h3 {
   font-weight: 300
}

#addon {
   width: 400px;
   position: absolute;
   left: 0px;
   right: 0px;
   top: 10%;
   bottom: auto;
   margin: auto
}

a {
   color: white
}

a.install-link {
   text-decoration: none
}

button {
   border: 0;
   outline: 0;
   color: white;
   background: #8A5AAB;
   padding: 1.2vh 3.5vh;
   margin: auto;
   text-align: center;
   font-family: 'Open Sans', Arial, sans-serif;
   font-size: 2.2vh;
   font-weight: 600;
   cursor: pointer;
   display: block;
   box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.2);
   transition: box-shadow 0.1s ease-in-out;
}

button:hover {
   box-shadow: none;
}

button:active {
   box-shadow: 0 0 0 0.5vh white inset;
}

.logo {
   max-width: 300px;
   float: left;
   margin: 20px
}

.name {
   float: left
}

.version {
   float: right
}

.provides,
.gives,
.description {
   clear: both
}

.best {
   margin-bottom: 30px
}

.best img {
   width: 60px
}
`

function landingTemplate(manifest) {
	const background = manifest.background || 'https://dl.strem.io/addon-background.jpg'
	const logo = manifest.logo || 'https://dl.strem.io/addon-logo.png'

	return `
   <!DOCTYPE html>
   <html style="background-image: url(${background});">
   <head>
      <meta charset="utf-8">
      <title>${manifest.name} - Stremio Addon</title>
      <style>${STYLESHEET}</style>
      <link rel="shortcut icon" href="${logo}" type="image/x-icon">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" rel="stylesheet">
   </head>
	<body>
      <div id="addon">
         <h1 class="name">${manifest.name}</h1>
         <h2 class="version">${manifest.version || '0.0.0'}</h2>
         <h2 class="description">${manifest.description || ''}</h2>
         <div class="separator"></div>

         <h3 class="gives">Bu eklenti şunları destekler:</h3>
         <ul>
            <li>Filmler</li><li>Diziler</li>
         </ul>
         </ul>
         <div class="separator"></div>
         <a id="installLink" class="install-link" href="#">
            <button name="Install">YÜKLE</button>
         </a>
         <div class="separator"></div>
      </div>
      <script>
         installLink.href = 'stremio://' + window.location.host + '/addon/manifest.json'
      </script>
	</body>
	</html>`
}

module.exports = landingTemplate