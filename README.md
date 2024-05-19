# webpack-react-express-template

A simple template to run webpack,react and express server.

Webpack+React + React router + Redux toolkit + Express

## directory structure

```
├── client
│   ├── dist
│   │   ├── bundle.js
│   │   ├── bundle.js.LICENSE.txt
│   │   └── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── src
│   │   ├── App.js
│   │   ├── index.html
│   │   └── index.js
│   └── webpack.config.js
├── LICENSE
├── README.md
└── server
    ├── index.js
    ├── package.json
    └── package-lock.json

4 directories, 14 files

```

Installation

1. Clone the repo
2. `cd client`
3. `npm install` to install the dependencies
4. `npm run serve` to run the app in development mode
5. The app will be served on http://localhost:3030/
6. `npm run build` to build the app for production

Installing the express server

1. `cd server`
2. `npm install`
3. `node index.js` to start the server
4. The api will be served at http://localhost:3000/api and the front end bundled app will be served at http://localhost:3000/
