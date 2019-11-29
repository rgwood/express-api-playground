const logger = require("./logger");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const port = 3000;
const cluster = require("cluster");

// todo: store this somewhere better
const JWT_SECRET = "djfngksdjnfgkjsdng";

const RunInClusterMode = false;


if (cluster.isMaster && RunInClusterMode) {
  console.log(`Master ${process.pid} is running`);
  const numCPUs = require('os').cpus().length;
  console.log(`${numCPUs} CPUs`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // JWT verification
  app.use((req, res, next) => {
    if (req.path.toUpperCase() === "/LOGIN") {
      return next();
    }

    try {
      let encrypted_jwt = req.header("Authorization").split(" ")[1];
      let decrypted_jwt = jwt.verify(encrypted_jwt, JWT_SECRET);
      req.jwt = decrypted_jwt;
      console.log(decrypted_jwt);
      return next();
    } catch (error) {
      console.log(`jwt check failed`, error);
      res
        .status(401)
        .json({ error: { code: "LoginFailure", message: "Not logged in" } });
    }
  });

  app.use((req, res, next) => {
    if (req.path.toUpperCase() === "/LOGIN") {
      return next();
    }
    console.log(`in admin check`);
    if (!req.jwt.isAdmin) {
      res.status(401).json({
        error: { code: "NotAdmin", message: "Need admin permission" }
      });
    } else {
      next();
    }
  });

  app.get("/login", async (req, res, next) => {
    // simulate cpu-intensive code
    cpuIntensiveOperation();

    // obvs we'd do this dynamically with some verification in the real world
    const payload = { user: "Reilly", isAdmin: true };

    let encrypted_jwt = jwt.sign(payload, JWT_SECRET);
    res.status(200).send(encrypted_jwt);
  });

  app.get("/", (req, res) => {
    let name = req.jwt.user;
    if (!!req.jwt.isAdmin) name = `Administrator ${name}`;

    res.json({ message: `Hello ${name}!` });
  });

  app.listen(port, () => logger.info(`Example app listening on port ${port}!`));
}

function cpuIntensiveOperation() {
    fibonacci(30);
}

function fibonacci(n) {
    if(n <= 0)
        return 0;
    if(n == 1)
        return 1;
    
    return fibonacci(n-2) + fibonacci(n-1);
}