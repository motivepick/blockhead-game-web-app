# Blockhead Game

Try it out at [https://blockhead.yaskovdev.com](https://blockhead.yaskovdev.com).

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Configure WebStorm

Languages & Frameworks | JavaScript | Prettier, select "Automatic Prettier configuration".

### Deploy To GitHub Pages

```shell
npm run build
npm run deploy
```

Or push to the master branch and GitHub Actions will deploy it automatically.

Before pushing, consider running `set -x CI true; npm run build` (in Fish) to ensure the build will succeed in GitHub
Actions.