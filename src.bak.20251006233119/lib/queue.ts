import { Queue, QueueEvents, JobsOptions } from "@bullmq/fast";
import IORedis from "ioredis";
const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379",{ maxRetriesPerRequest:null, enableReadyCheck:false });
export const GEN_QUEUE = "video:generate";
export const genQueue = new Queue(GEN_QUEUE,{ connection, defaultJobOptions:{
  removeOnComplete:{ age:3600, count:10000 }, removeOnFail:{ age:86400, count:10000 }, attempts:3, backoff:{ type:"exponential", delay:3000 }
} as JobsOptions});
export const genEvents = new QueueEvents(GEN_QUEUE,{ connection });
