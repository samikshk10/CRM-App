class RedisConsumer {
    private static instance: RedisConsumer;
  
    private constructor() {}
  
    static get(): RedisConsumer {
      if (!RedisConsumer.instance) {
        RedisConsumer.instance = new RedisConsumer();
      }
      return RedisConsumer.instance;
    }
  
    subscribe() {
    }
  }
  
  const redisConsumer = RedisConsumer.get();
  
  export { redisConsumer as RedisConsumer };