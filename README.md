# webpack-react-express-template

A simple template to run webpack,react and express server.

Webpack+React+React router+Redux toolkit + Express + Server side session + RBAC

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
3. Create a `.env` file and set REACT_APP_API_URL=http://localhost:3000/api
4. `npm install` to install the client dependencies
5. `cd ../server`
6. `npm install` to install the server dependencies
7. Make sure MongoDB is running locally, or set `MONGODB_URI` to your MongoDB connection string.
8. From the project root, run `npm run dev` to start the client and server in development mode.
9. The client will be served on http://localhost:3031/ and the API will be served on http://localhost:3000/api.
10. `npm run build` from the project root builds the client for production.

Installing the express server

1. `cd server`
2. `npm install`
3. Make sure MongoDB is running locally, or set `MONGODB_URI` to your MongoDB connection string.
4. `node index.js` to start the server
5. The api will be served at http://localhost:3000/api and the front end bundled app will be served at http://localhost:3000/

## DB Models:

The server uses MongoDB with Mongoose models in `server/models`.

Set `MONGODB_URI` to override the default local database:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/rbac
```

User:

```js
{
  username: String, // required, unique
  password: String, // required, bcrypt hash
  email: String, // required, unique
  roles: [ObjectId] // Role refs
}
```

Role:

```js
{
  name: String // required, unique
}
```

Resource:

```js
{
  name: String, // required, unique
  description: String
}
```

Permission:

```js
{
  role: ObjectId, // Role ref
  resource: ObjectId, // Resource ref
  read: Boolean,
  write: Boolean,
  update: Boolean,
  delete: Boolean
}
```

Permission documents have a unique compound index on `role` and `resource`.

Todo:

```js
{
  title: String,
  description: String,
  status: "Pending" | "Done" | "In progress",
  user: ObjectId // User ref
}
```
