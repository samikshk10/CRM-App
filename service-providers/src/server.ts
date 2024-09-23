import "module-alias/register";
import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLFormattedError } from "graphql";
import express from "express";
import loglevel from "loglevel";
import { IncomingMessage } from "http";
import { corsWhitelist, environment, port } from "./config";
import { Database } from "./config/instance";
import { EnvironmentEnum } from "./enums";
import { schema } from "./graphql/schema";
import { UserInterface } from "./interfaces/userInterface";
import { Guard } from "./middlewares";
import { ContextInterface } from "./interfaces/contextInterface";
import router from "@src/providers/facebook/webhook";
import { router as WhatsappRouter } from "@src/providers/whatsapp/webhook"
import * as http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServerPluginCacheControl } from "@apollo/server/plugin/cacheControl";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { expressMiddleware } from "@apollo/server/express4";
class Server {
  app: express.Application;
  logger: loglevel.Logger;
  corsOptions = {
    origin: corsWhitelist,
    credentials: true,
  };

  constructor() {
    this.app = express();
    this.logger = loglevel.getLogger("apollo-server");
  }

  private async connectDB() {
    await Database.connection();
  }

  public async start() {
    this.logger.setLevel(environment === EnvironmentEnum.PRODUCTION ? loglevel.levels.INFO : loglevel.levels.DEBUG);
    this.connectDB();
    this.configuration();
    const httpServer = http.createServer(this.app);
    const apolloServer = new ApolloServer<BaseContext>({
      schema: schema,
      introspection: true,
      csrfPrevention: false,
      includeStacktraceInErrorResponses: true,
      cache: "bounded",
      logger: this.logger,
      formatError: (formattedError: GraphQLFormattedError) => {
        if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
          return {
            ...formattedError,
            message: "Your query doesn't match the schema. Try double-checking it!",
          };
        }
        return formattedError;
      },
      plugins: [
        ApolloServerPluginCacheControl({
          defaultMaxAge: 1,
          calculateHttpHeaders: false,
        }),
        environment === EnvironmentEnum.PRODUCTION
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageLocalDefault(),
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginInlineTrace({
          includeErrors: { transform: (error) => error },
        }),
      ],
    });
    await apolloServer.start();
    this.app.use(
      "/graphql",
      cors<cors.CorsRequest>({
        origin: corsWhitelist,
      }),
      bodyParser.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }: { req: IncomingMessage }): Promise<ContextInterface> => {
          const authorization = req.headers?.authorization as string;
          let user: UserInterface | undefined;
          if (authorization) {
            user = await Guard.auth(authorization);
          }
          return {
            user,
            authorization,
          };
        },
      }),
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/webhook/facebook", router);
    this.app.use("/webhook/whatsapp", WhatsappRouter)

    await new Promise<void>(async (resolve) => {
      const port = this.app.get("port");
      httpServer.listen({ port: port }, resolve);
      console.log(`🚀 Server ready at http://localhost:${port}`);
    });
  }
  private configuration() {
    this.app.set("port", port);
    this.app.use(cors(this.corsOptions));
  }
}

const server = new Server();
server.start();
