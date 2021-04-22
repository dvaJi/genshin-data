# Genshin Data

This information is from fandom and various other sources (credits are at the bottom).

## WIP

## How To Use

Use npm to install it from the npm registry by running `npm install genshin-data`

Put the following in a `server.js` file.

```Javascript

var GenshinData = require('genshin-data');

const genshinData = new GenshinData();

// Promises
genshinData.characters()
.then(function (characters) {
    console.log(characters);
});

// Async/await
const characters = await genshinData.characters();
console.log(characters);
```

Run `npm install` followed by `node server.js`

# Sources

Data: GenshinData repo

English data: [Genshin Impact Wiki](https://genshin-impact.fandom.com/)

Spanish data: [Genshin Impact Spanish Wiki](https://genshin-impact.fandom.com/es/)

Japanese data: [Kamigame Genshin Wiki](https://kamigame.jp/genshin/index.html)


# [License](LICENSE)
"Genshin Data" isn’t endorsed by MiHoyo and doesn’t reflect the views or opinions of MiHoyo or anyone officially involved in producing or managing Genshin Impact. Genshin Impact and MiHoyo are trademarks or registered trademarks of MiHoyo,
