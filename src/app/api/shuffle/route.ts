import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const FALLBACK_LINKS = [
  "https://t.me/milena_ru/484",
  "https://t.me/milena_ru/311",
  "https://t.me/milena_ru/1132",
  "https://t.me/milena_ru/1088",
  "https://t.me/milena_ru/775"
];

export async function GET() {
  try {
    console.log("Shuffle API: Request received at", new Date().toISOString());
    
    let links: string[] = [];
    
    // 1. Пытаемся прочитать из файла
    try {
      const filePath = path.join(process.cwd(), "docs", "poslania.md");
      console.log("Shuffle API: Trying to read file at:", filePath);
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        links = fileContent
          .split("\n")
          .map(line => {
            const match = line.match(/https?:\/\/t\.me\/[^\s\n\r]+/);
            return match ? match[0].trim() : null;
          })
          .filter(Boolean) as string[];
        console.log(`Shuffle API: Successfully found ${links.length} links in file`);
      } else {
        console.error("Shuffle API: File NOT found at", filePath);
      }
    } catch (err) {
      console.error("Shuffle API: File system error:", err);
    }

    // 2. Если файл пуст, пробуем Redis
    if (links.length === 0 && redis) {
      console.log("Shuffle API: File empty, trying Redis...");
      try {
        const postData = await redis.srandmember("posts_pool");
        if (postData) {
          const post = typeof postData === "string" ? JSON.parse(postData) : postData;
          return NextResponse.json(post);
        }
      } catch (redisErr) {
        console.error("Shuffle API: Redis error:", redisErr);
      }
    }

    // 3. Если всё еще пусто, используем жестко зашитые ссылки
    if (links.length === 0) {
      console.log("Shuffle API: Everything failed, using hardcoded fallback");
      links = FALLBACK_LINKS;
    }

    // Отдаем случайную ссылку
    const randomLink = links[Math.floor(Math.random() * links.length)];
    console.log("Shuffle API: Sending link:", randomLink);
    
    return NextResponse.json({
      url: randomLink,
      text: "Твоё личное послание от МИРа уже ждёт тебя по ссылке ниже. Открой сердце и прими его."
    });

  } catch (error) {
    console.error("Shuffle API: Global Error:", error);
    return NextResponse.json(
      { error: "Something went wrong on our side" },
      { status: 500 }
    );
  }
}
