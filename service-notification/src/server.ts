import { schema } from "./graphql/schema";
import  express  from 'express';
import { Database, environment, port } from "./config";
import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import loglevel from "loglevel";
import { EnvironmentEnum } from './enums';
import { Guard ,Validator} from '../src/middlewares/index';
import { GraphQLFormattedError } from "graphql";
import { IncomingMessage } from 'http';
import { ContextInterface, UserInterface } from "./interfaces";


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
            cache: 'bounded',
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
            listen: { port: this.app.get('port') },
            context: async ({
              req,
            }: {
              req: IncomingMessage;
            }): Promise<ContextInterface> => {
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
          });
      
          console.info(`🚀 Server ready at: ${url} `);
        }
      
        private configuration() {
          this.app.set('port', port);
        }
      }
      
      const server = new Server();
      server.start();
      