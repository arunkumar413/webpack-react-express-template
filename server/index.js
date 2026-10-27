const path = require("path");
const express = require("express");
var cors = require("cors");
var session = require("express-session");
const MongoStore = require("connect-mongo");
const { connectDB, MONGODB_URI } = require("./DBConfig");
const constants = require("./constants");

const pinoHttp = require('pino-http');
const pino = require('pino')
const logger = require('./logger');
const crypto = require('node:crypto');

const app = express();
const port = constants.SERVER_PORT;
const isProduction = process.env.NODE_ENV === "production";
const clientDist = path.join(__dirname, "../client/dist");

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return true;
  }
  const extra = String(process.env.APP_ORIGIN || "")
    .split(",")
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean);
  if (extra.includes(origin)) {
    return true;
  }
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && url.hostname.endsWith(".run.app");
  } catch (err) {
    return false;
  }
}

const {
  loginController,
  registerController,
  logoutController,
  getSessionController,
} = require("./controllers/loginController");
const { checkAuthentication } = require("./middlewares/checkAuthentication");
const { checkAuthorization } = require("./middlewares/checkAuthroization");
const { getMyTasks } = require("./controllers/tasksController");
const {
  getEmployees,
  updateEmployeeDepartment,
} = require("./controllers/userController");
const {
  bulkInviteEmployees,
  acceptInvite,
} = require("./controllers/inviteController");
const { dynamicQueryParams } = require("./controllers/dynamicQueryParams");
const { getHierarchy } = require("./controllers/hierarchyController");
const {
  getProfile,
  updateProfile,
} = require("./controllers/profileController");
const { listResources } = require("./controllers/resourceController");
const {
  getAccessCatalog,
  getAccessMembers,
  getAccessResources,
  updateRoleResource,
  setMemberRole,
} = require("./controllers/accessController");
const {
  requestPasswordOtp,
  changePassword,
} = require("./controllers/passwordController");
const errorHandler = require("./middlewares/errorHandlerMiddleware");

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      sameSite: "lax",
      maxAge: constants.SESSION_MAX_AGE_MS,
      path: "/",
    },
  })
);

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(pinoHttp({
  logger,
  genReqId: () => crypto.randomUUID(),
  customProps: (req,res) => ({
    query: req.query,
    params: req.params,
    body: req.body,
    // headers: req.headers,
    ip: req.ip,
    // method: req.method,
    // url: req.url,
    // statusCode: res.statusCode,
    // responseTime: res.responseTime,
  }),
  serializers: {
    err: pino.stdSerializers.err,
    // req: pino.stdSerializers.req,
    // res: pino.stdSerializers.res

    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort
      };
    },
    // res(res) {  
    //   return {
    //     statusCode: res.statusCode,
    //     responseTime: res.responseTime
    //   };
    // }
  },
}));


// app.get('/', async (req, res, next) => {
//   try {
//     throw new Error('Error to simulate');
//   } catch (err) {
//     next(err);
//   }
// });

app.use(express.static(clientDist));

app.get("/", function (req, res) {
  res.sendFile(path.join(clientDist, "index.html"));
});


app.get("/api", (req, res) => {
  console.log(req);
  res.json({ data: "Hello World!" });
});

app.get("/api/me", checkAuthentication, getSessionController);

app.get("/api/profile", checkAuthentication, getProfile);
app.patch("/api/profile", checkAuthentication, updateProfile);
app.post(
  "/api/profile/password/otp",
  checkAuthentication,
  requestPasswordOtp
);
app.post("/api/profile/password", checkAuthentication, changePassword);

app.get(
  "/api/resources",
  checkAuthentication,
  checkAuthorization({ resource: "resource", action: "read" }),
  listResources
);

app.get(
  "/api/access",
  checkAuthentication,
  checkAuthorization({ resource: "role", action: "read" }),
  getAccessCatalog
);
app.get(
  "/api/access/members",
  checkAuthentication,
  checkAuthorization({ resource: "role", action: "read" }),
  getAccessMembers
);
app.get(
  "/api/access/resources",
  checkAuthentication,
  checkAuthorization({ resource: "role", action: "read" }),
  getAccessResources
);
app.patch(
  "/api/access/roles/:roleId",
  checkAuthentication,
  checkAuthorization({ resource: "role", action: "update" }),
  updateRoleResource
);
app.put(
  "/api/access/members/:employeeId/role",
  checkAuthentication,
  checkAuthorization({ resource: "employee", action: "update" }),
  setMemberRole
);

app.get(
  "/api/hierarchy",
  checkAuthentication,
  checkAuthorization({ resource: "employee", action: "read" }),
  getHierarchy
);

app.get(
  "/api/mytasks",
  checkAuthentication,
  checkAuthorization({ resource: "task", action: "read" }),
  getMyTasks
);

app.get(
  "/api/employees",
  checkAuthentication,
  checkAuthorization({ resource: "employee", action: "read" }),
  getEmployees
);

app.post(
  "/api/employees/invite",
  checkAuthentication,
  checkAuthorization({ resource: "employee", action: "write" }),
  bulkInviteEmployees
);

app.get(
  "/api/employees/search",
  checkAuthentication,
  checkAuthorization({ resource: "employee", action: "read" }),
  dynamicQueryParams
);

app.patch(
  "/api/employees/:id/department",
  checkAuthentication,
  updateEmployeeDepartment
);

app.post("/api/login", loginController);
app.post("/api/logout", logoutController);
app.post("/api/invite/accept", acceptInvite);

app.post("/api/register", registerController);

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.use(errorHandler);

if (
  isProduction &&
  (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === "keyboard cat")
) {
  console.error("Set SESSION_SECRET before starting in production");
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
