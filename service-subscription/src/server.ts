import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import loglevel from "loglevel";
import { WebSocketServer } from "ws";
import { GraphQLFormattedError } from "graphql";
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { createServer } from "http";
import { Database, environment, port } from "./config";
import { schema } from "./graphql/schema";
import { EnvironmentEnum } from "./enums";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
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

    const httpServer = createServer(this.app);

    this.connectDB();
    this.configuration();
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/graphql",
    });

    wsServer.on("connection", function (ws, request) {
      console.log("Connection");
      ws.on("message", async function (message, isBinary) {
        const parseMessage = JSON.parse(message.toString()) as any;
        if (parseMessage.type === "ping") {
          console.log({ parseMessage });
        }
      });
    });
    const serverCleanup = useServer(
      {
        schema,
        connectionInitWaitTimeout: 60_000, // 60 seconds
        onConnect: async (ctx) => {
          console.log("Connect");
        },
        onDisconnect: async (ctx, code, reason) => {
          console.log("disconnect", { code, reason });
        },
        onSubscribe: async (ctx, message) => {},
        onComplete: async (ctx, message) => {},
      },
      wsServer
    );

    const server = new ApolloServer<BaseContext>({
      schema,
      introspection: true,
      includeStacktraceInErrorResponses: true,
      csrfPrevention: true,
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
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
        ApolloServerPluginInlineTrace({
          includeErrors: { transform: (error) => error },
        }),
      ],
    });
    await server.start();
    this.app.use(
      "/graphql",
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }: { req: any }): Promise<any> => {},
      })
    );
    httpServer.listen(port, () => {
      console.info(`🚀 Server ready at: http://localhost:${port}/graphql`); // Update the URL
      console.info(`🚀 Subscriptions ready at: ws://localhost:${port}/graphql`); // Update the URL
    });
  }

  private configuration() {
    this.app.set("port", port);
  }
}

const server = new Server();
server.start();
