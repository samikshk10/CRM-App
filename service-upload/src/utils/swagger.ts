import fs from "fs";
import _path from "path";
import swaggerJSDoc from "swagger-jsdoc";

import { appName, environment, hostUrl } from "../config";

const baseRoutes = _path.resolve("./swagger/routes");
const getPathRoutes = (path: string) => `${baseRoutes}${path}`;

const getDocs = (basePath: string, getPath: Function) => {
  return fs.readdirSync(basePath).reduce((acc, file) => {
    const data = require(getPath(`/${file}`));
    acc = {
      ...acc,
      ...data,
    };
    return acc;
  }, {});
};

const docsSources = getDocs(baseRoutes, getPathRoutes);

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.1",
    servers: [
      {
        url: `${hostUrl}/upload`,
        description: "Media Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      },
      parameters: {
        offset: {
          in: "query",
          name: "offset",
          required: false,
          default: 0,
          description: "offset",
        },
        limit: {
          in: "query",
          name: "limit",
          required: false,
          default: 10,
          description: "limit",
        },
        sort: {
          in: "query",
          name: "sort",
          required: false,
          schema: {
            type: "string",
            enum: ["asc", "desc"],
          },
          description: "sort",
        },
        order: {
          in: "query",
          name: "order",
          required: false,
          description: "order",
        },
      },
    },
    info: {
      title: `Api ${appName} Documentation`,
      version: "1.0.0",
    },
    paths: docsSources,
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const optionsSwaggerUI = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: `${hostUrl}/upload/swagger.json`,
        name: `${environment} Server`,
      },
    ],
  },
};

export { optionsSwaggerUI, swaggerSpec };