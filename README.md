# webpack-react-express-template

A simple template to run webpack,react and express server.

## Features:

*   Webpack
*   React
*   React router
*   Redux toolkit
*   Expressjs
*   Server side
*   session
*   RBAC
*   MongoDB
*   Multiple Tenant organization
*   Departments
*   Roles
*   Permission


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

## Installation

1. Clone the repo
2. Create `server/.env` with `MONGODB_URI` set to your MongoDB connection string.
3. From the project root, run `npm install` (installs root, client, and server dependencies).
4. Run `npm run dev` to start the API and the webpack client together.
5. Optionally run `npm run seed:demo` to load Acme Corp with departments, roles, and employees (password `demo123`).
6. The client is at http://localhost:3031/ and the API at http://localhost:3000/api. In development the client also proxies `/api` to the server.

Optional: `client/.env` can set `REACT_APP_API_URL` (defaults to `/api`).

`npm run build` from the project root builds the client for production.

## Installing the express server

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

**Organization** — tenant (`name`, unique `slug`, `plan`).

**Department** — `tenantId`, `name`, optional `parentId`, `ancestors` (filled on save). Index `{ tenantId, parentId }`.

**Employee** — login identity and org member. `tenantId`, `name`, unique `{ tenantId, username }` and `{ tenantId, email }`, `designation`, `phone`, hashed `password`, `departmentId`, `managerId`, `ancestorManagers`, `roleIds`, denormalized `permissions`, `isActive`. Sessions store this employee (without password) plus resolved `roles` and `permissions`. The signed-in employee’s details and org hierarchy are on `/profile` (`GET`/`PATCH /api/profile`). Department can only be changed by that employee’s manager chain (`PATCH /api/employees/:id/department`).

**AuthSession** — one record per device login (`sessionId`, `employeeId`, `userAgent`, `ip`, `lastSeenAt`, `expiresAt`). Concurrent logins from different devices stay active; `/profile` lists them.

**Role** — per-tenant (`tenantId`, unique `{ tenantId, name }`), string `permissions` (e.g. `"employee.read"`), `isSystem`.

**RoleAssignment** — `tenantId`, `employeeId`, `roleId`, optional department `scope`.

**Todo** — `title`, `description`, `status` (`Pending` | `Done` | `In progress`), `tenantId`, `employee` (Employee ref).

Auth: `POST /api/register` creates an organization, an Admin role, and the first employee, then saves an Express session in MongoDB. `POST /api/login` accepts `email`, `password`, and optional `organizationSlug`. Each login creates (or updates) its own session so multiple devices can stay signed in at once. Protected routes use session cookies plus `checkAuthentication` / `checkAuthorization` (role names and/or permission strings).
