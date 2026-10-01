const express = require("express");
var cors = require("cors");
var session = require("express-session");
const MongoStore = require("connect-mongo");
const { connectDB, MONGODB_URI } = require("./DBConfig");
const constants = require("./constants");

const app = express();
const port = constants.SERVER_PORT

const path = require("path");
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
const { dynamicQueryParams } = require("./controllers/dynamicQueryParams");
const { getHierarchy } = require("./controllers/hierarchyController");
const {
  getProfile,
  updateProfile,
} = require("./controllers/profileController");

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
      secure: false,
      maxAge: constants.SESSION_MAX_AGE_MS,
      path: "/",
    },
  })
);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
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
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/api", (req, res) => {
  console.log(req);
  res.json({ data: "Hello World!" });
});

app.get("/api/me", checkAuthentication, getSessionController);

app.get("/api/profile", checkAuthentication, getProfile);
app.patch("/api/profile", checkAuthentication, updateProfile);

app.get(
  "/api/hierarchy",
  checkAuthentication,
  checkAuthorization({ permissions: ["employee.read"] }),
  getHierarchy
);

app.get(
  "/api/mytasks",
  checkAuthentication,
  checkAuthorization({ permissions: ["task.read"] }),
  getMyTasks
);

app.get(
  "/api/employees",
  checkAuthentication,
  checkAuthorization({ permissions: ["employee.read"] }),
  getEmployees
);

app.get(
  "/api/employees/search",
  checkAuthentication,
  checkAuthorization({ permissions: ["employee.read"] }),
  dynamicQueryParams
);

app.patch(
  "/api/employees/:id/department",
  checkAuthentication,
  updateEmployeeDepartment
);

app.post("/api/login", loginController);
app.post("/api/logout", logoutController);

app.post("/api/register", registerController);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
