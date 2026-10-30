# webpack-react-express-template

A simple template to run webpack,react and express server.

## Features:

*   Webpack
*   React
*   React router
*   Redux toolkit
*   Expressjs
*   Server side sessions
*   RBAC
*   MongoDB
*   Multi-tenant organization
*   Department hierarchy
*   Departments
*   Roles
*   Permissions



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

## Demo seed accounts

Run `npm run seed:demo` to recreate the demo `Acme Corp` organization. The
script resets the existing `acme` organization before seeding it, and all demo
accounts use the password `demo123`.

| Role | Name | Email | Department |
| --- | --- | --- | --- |
| Admin | Ava Chen | `ava.chen@acme.example` | Leadership |
| Manager | Marcus Webb | `marcus.webb@acme.example` | Engineering |
| Manager | Priya Shah | `priya.shah@acme.example` | Backend |
| Employee | Liam Ortiz | `liam.ortiz@acme.example` | Backend |
| Manager | Sofia Berg | `sofia.berg@acme.example` | Frontend |
| Employee | Noah Kim | `noah.kim@acme.example` | Frontend |
| Employee | Elena Rossi | `elena.rossi@acme.example` | QA |
| Manager | Jordan Hale | `jordan.hale@acme.example` | Product |
| HR | Sam Okonkwo | `sam.okonkwo@acme.example` | People |

Use organization slug `acme` when signing in if the email belongs to more than
one organization. Admins have full access. Managers and HR users with the
`employee.write` permission can invite teammates from `/profile`; invitees can
be assigned to an existing department and can be given either Employee or
Manager access.

`npm run build` from the project root builds the client for production. Then `NODE_ENV=production npm start` serves the UI and API together.

## Calling an API and storing its response in Redux

The client provides `apiRequest` in `client/src/store/apiClient.js` as a small
wrapper around `fetch`. Pass the Redux `dispatch` function, a unique response
key, the API URL, and the fetch options:

```jsx
import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "./store/apiClient";
import { API_URL } from "./constants";

function Example() {
  const dispatch = useDispatch();
  const response = useSelector((state) => state.api.profile || {});

  async function loadProfile() {
    const result = await apiRequest(
      dispatch,
      "profile",
      `${API_URL}/profile`,
      { credentials: "include" }
    );

    if (!result.response.ok) {
      // The error is also available at state.api.profile.error in Redux.
      return;
    }

    // The response is already stored in Redux by apiRequest.
    console.log(result.payload.data);
  }

  return <button onClick={loadProfile}>Load profile</button>;
}
```

Each response is stored at `state.api[<key>]` with this shape:

```js
{
  statusCode: 200,
  data: {/* API response data */},
  error: null
}
```

`apiRequest` clears the response for the supplied key before every new call,
so stale API data is removed while the request is in flight. The request then
stores either the successful response or the error response in Redux. To clear
one response manually, dispatch `clearApiResponse("profile")`; to clear all
API responses, dispatch `clearApiResponses()`:

```jsx
import {
  clearApiResponse,
  clearApiResponses,
  selectApiResponse,
} from "./store/apiSlice";

const profile = useSelector((state) =>
  selectApiResponse(state, "profile")
);

dispatch(clearApiResponse("profile")); // Clear one key
dispatch(clearApiResponses());          // Clear every API key
```

## Deploy to Cloud Run

Google puts HTTPS in front of the app. There is no Dockerfile and no App Engine `app.yaml`.

1. Use MongoDB Atlas. Allow `0.0.0.0/0` (Cloud Run has no fixed IP) or later use VPC.
2. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install), then:
   ```bash
   gcloud init
   gcloud run deploy webpack-react-express \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars=NODE_ENV=production,MONGODB_URI="your-atlas-uri",SESSION_SECRET="a-long-random-string"
   ```
3. Optional: add `APP_ORIGIN=https://YOUR-SERVICE-xxxxx.run.app` and SMTP vars to `--set-env-vars`.
4. Seed once from your laptop: `MONGODB_URI="your-atlas-uri" npm run seed:demo`

Local `npm run dev` is unchanged.

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

**Employee** — login identity and org member. `tenantId`, `name`, unique `{ tenantId, username }` and `{ tenantId, email }`, `designation`, `phone`, hashed `password`, `departmentId`, `managerId`, `ancestorManagers`, `roleIds`, `isActive`, `mustSetPassword`. Sessions store this employee (without password) plus `roles`, `roleIds`, and `fullAccess`. Resource grants are looked up per request, not stored as a giant permission list. The signed-in employee’s details and org hierarchy are on `/profile` (`GET`/`PATCH /api/profile`). Department can only be changed by that employee’s manager chain (`PATCH /api/employees/:id/department`). Managers (and HR in a department) with `employee.write` can bulk-invite from `/profile`: `POST /api/employees/invite` with `{ rows, departmentId, roleName }`. Invitations can target the uploader’s department or a child department, and the invitee reports to the uploader. Invitees set a password at `/invite` (`POST /api/invite/accept`).

**AuthSession** — one record per device login (`sessionId`, `employeeId`, `userAgent`, `ip`, `lastSeenAt`, `expiresAt`). Concurrent logins from different devices stay active; `/profile` lists them.

**PasswordOtp** — hashed one-time code for password change (`employeeId`, `email`, `expiresAt`). Other device sessions are revoked after a successful change.

**Resource** — global catalog of protected things (`key`, `name`, `actions`). Hundreds of resources stay as documents; they are not copied onto each role or session.

**Role** — per-tenant (`tenantId`, unique `{ tenantId, name }`), `fullAccess` for admins, `isSystem`.

**Permission** — grant of CRUD flags (`read`, `write`, `update`, `delete`) for one `{ role, resource }`. Indexed for lookup by role + resource so authorization stays fast as the catalog grows.

**RoleAssignment** — `tenantId`, `employeeId`, `roleId`, optional department `scope`.

**Todo** — `title`, `description`, `status` (`Pending` | `Done` | `In progress`), `tenantId`, `employee` (Employee ref).

Auth: `POST /api/register` creates an organization, a top-level department, Admin/Manager/Employee roles, and the first Admin employee, then saves an Express session in MongoDB. `POST /api/login` accepts `email`, `password`, and optional `organizationSlug`. Each login creates (or updates) its own session so multiple devices can stay signed in at once. Change password on `/profile`: `POST /api/profile/password/otp` emails a 6-digit code, then `POST /api/profile/password` with `otp`, `password`, and `confirmPassword`. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` (or `SMTP_URL`) to send mail; without SMTP the code is written to the server log. Protected routes use session cookies plus `checkAuthentication` / `checkAuthorization({ resource, action })`. `GET /api/resources` lists the catalog with pagination (`page`, `limit`, `q`).

## UI theme

The UI uses Inter (loaded through Google Fonts, with system-font fallbacks) and
Tailwind CSS v4. Shared color tokens live in `client/src/index.css`: edit the
`:root` values for light mode and `[data-theme="dark"]` for dark mode. Tailwind's
`@theme inline` exposes `primary`, `primary-hover`, and `surface` utilities and
maps the existing slate utilities to the active palette.

The header offers Light, Dark, and System themes. The selection is saved locally;
System follows the device preference, including changes while the app is open.
An early script in `client/src/index.html` applies the saved preference before
React renders to avoid a flash of the wrong theme.
