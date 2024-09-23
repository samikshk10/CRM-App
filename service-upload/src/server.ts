import express from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";

import { Database, corsWhitelist, port } from "./config";
import { ProxyRouter as ProxyRouterUser } from "./routes/v1/user";
import { optionsSwaggerUI, swaggerSpec } from "./utils";
import { genericErrorHandler, methodNotAllowed, notFound } from "./middlewares";

class Server {
  app: express.Application;

  constructor() {
    this.app = express();
    this.configuration();
  }

  private configuration() {
    this.app.set("port", port);
    this.app.use(express.json());
    this.app.use("/upload/public",express.static('public'))
    this.app.use(cors(this.corsOptions));
    this.app.get("/", (req, res) =>
      res.send(`Sever running at port ${this.app.get("port")}`)
    );

    //API Routes
    this.app.use("/upload/api/v1", ProxyRouterUser.map());

    //Swagger
    this.app.get("/upload/swagger.json", (req, res) => {
      res.setHeader("Context-Type", "application/json");
      res.send(swaggerSpec);
    });
    this.app.use("/upload/swagger", swaggerUI.serve);
    this.app.get(
      "/upload/swagger",
      swaggerUI.setup(swaggerSpec, optionsSwaggerUI)
    );

    //Error Handler
    this.app.use(genericErrorHandler);
    this.app.use(methodNotAllowed);
    this.app.use(notFound);
  }

  private async connectDB() {
    await Database.connection();
  }

  private corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
      if (!origin || corsWhitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  };

  public start() {
    this.connectDB();
    this.app.listen(this.app.get("port"), () => {
      console.log(`App running on PORT ${this.app.get("port")}`);
    });
  }
}

const server = new Server();
server.start();
