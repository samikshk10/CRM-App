class RedisProducer {
    private static instance: RedisProducer;
  
    private constructor() {}
  
    static get(): RedisProducer{
      if (!RedisProducer.instance) {
        RedisProducer.instance = new RedisProducer();
      }
      return RedisProducer.instance;
    }
  }
  
  const redisProducer = RedisProducer.get();
  
  export { redisProducer as RedisProducer };