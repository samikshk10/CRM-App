import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis, RedisOptions } from "ioredis";
import { redisClient } from ".";

class PubSub {
  private static instance: PubSub;
  public RedisPubSub: RedisPubSub;
  private options: RedisOptions;

  private constructor() {
    this.options = {
      host: redisClient.host,
      port: redisClient.port,
      password: redisClient.password,
    };
    this.RedisPubSub = new RedisPubSub({
      publisher: new Redis(this.options),
      subscriber: new Redis(this.options),
    });
  }

  static get(): PubSub {
    if (!PubSub.instance) {
      PubSub.instance = new PubSub();
    }
    return PubSub.instance;
  }
}

const pubSub = PubSub.get();

export { pubSub as PubSub };
