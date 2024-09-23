import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import express from "express";
import loglevel from "loglevel";
import { IncomingMessage } from "http";

import { corsWhitelist, environment, port } from "./config";
import { Database } from "./config/instance";
import { EnvironmentEnum } from "./enums";
import { schema } from "./graphql/schema";
import { Guard } from "./middlewares";
import { UserInterface, ContextInterface } from "./interfaces";

class Server {
  app: express.Application;
  logger: loglevel.Logger;

  constructor() {
    this.app = express();
    this.logger = loglevel.getLogger("apollo-server");
  }

  private async connectDB() {
    await Database.connection();
  }

  public async start() {
    this.logger.setLevel(
      environment === EnvironmentEnum.PRODUCTION
        ? loglevel.levels.INFO
        : loglevel.levels.DEBUG
    );
    this.connectDB();
    this.configuration();

    const server = new ApolloServer<BaseContext>({
      schema: schema,
      introspection: true,
      csrfPrevention: false,
      includeStacktraceInErrorResponses: true,
      cache: "bounded",
      logger: this.logger,

      formatError: (formattedError: GraphQLFormattedError) => {
        if (
          formattedError.extensions?.code ===
          ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
        ) {
          return {
            ...formattedError,
            message:
              "Your query doesn't match the schema. Try double-checking it!",
          };
        }
        return formattedError;
      },
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: this.app.get("port") },
      context: async ({
        req,
      }: {
        req: IncomingMessage;
      }): Promise<ContextInterface> => {
        const authorization = req.headers?.authorization?.replace(
          "Bearer ",
          ""
        ) as string;

        let user: UserInterface | undefined;
        if (authorization) {
          user = await Guard.auth(authorization);
        }
        return {
          user,
          authorization,
        };
      },
    });

    console.info(`🚀 Server ready at: ${url} `);
  }

  private configuration() {
    this.app.set("port", port);
  }
}

const server = new Server();
server.start();
