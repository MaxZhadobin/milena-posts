import { Redis } from "@upstash/redis";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

async function upload() {
  const filePath = path.join(process.cwd(), "data", "posts.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const posts = JSON.parse(fileContent);

  console.log(`Uploading ${posts.length} posts to Redis...`);

  // Очищаем старый пул (опционально)
  // await redis.del("posts_pool");

  for (const post of posts) {
    await redis.sadd("posts_pool", JSON.stringify(post));
  }

  console.log("Upload complete!");
}

upload().catch(console.error);
