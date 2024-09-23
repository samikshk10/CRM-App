import { GraphQLError } from "graphql";
import { UserInterface } from "@src/interfaces/userInterface";
import { AwsCognito } from "@src/utils";
import { UserService } from "@src/services";

class Guard {
  private static instance: Guard;

  private constructor() {}

  static get(): Guard {
    if (!Guard.instance) Guard.instance = new Guard();
    return Guard.instance;
  }

  auth = async (token: string): Promise<UserInterface | undefined> => {
    try {
      const [tokenKey, jwtToken] = token.split(" ");
      if (!(tokenKey === "Bearer" && jwtToken)) {
        throw new GraphQLError(`Invalid Token`, {
          extensions: {
            code: "UNAUTHORIZED",
            status: 401,
            message: `Token should consist Bearer`,
            argumentName: "authorization",
          },
        });
      }
      const verify = await AwsCognito.verifyToken(jwtToken);

      const userExists = await new UserService().findOne({
        sub: verify.sub,
      });

      if (!userExists) {
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 401,
            message: `Token provided is invalid or user does not exist.`,
            argumentName: "authorization",
          },
        });
      }
      return userExists;
    } catch (error: any) {
      console.log(error)
      if (error.failedAssertion) {
        return undefined;
      } else {
        throw new GraphQLError(`Auth Failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            status: 401,
            message: `Token provided is invalid or user does not exist.`,
            argumentName: "authorization",
          },
        });
      }
    }
  };

  grant = (user: UserInterface | undefined): UserInterface => {
    if (!user) {
      throw new GraphQLError(`Auth Failed`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 401,
          message: `Token provided is invalid or user does not exist. inside guard middleware`,
          argumentName: "authorization",
        },
      });
    }
    return user;
  };
}

const guard = Guard.get();

export { guard as Guard };
