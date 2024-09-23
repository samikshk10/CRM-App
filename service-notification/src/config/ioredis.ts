import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis, RedisOptions } from 'ioredis';
import { redisClient } from '.';
class IoRedis {
  private static instance: IoRedis;
  public RedisIoRedis: RedisPubSub;
  private options: RedisOptions;
  public redis: Redis;
  private constructor() {
    this.options = {
      host: redisClient.host,
      port: redisClient.port,
      password: redisClient.password,
    };
    this.RedisIoRedis = new RedisPubSub({
      publisher: new Redis(this.options),
      subscriber: new Redis(this.options),
    });
    this.redis = new Redis(this.options);
  }
  static get(): IoRedis {
    if (!IoRedis.instance) {
      IoRedis.instance = new IoRedis();
    }
    return IoRedis.instance;
  }
}
const ioRedis = IoRedis.get();
export { ioRedis as IoRedis };