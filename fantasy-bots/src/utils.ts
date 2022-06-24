import "dotenv/config";
import fetch from "node-fetch";

const DISCORD_API_VERSION = process.env.DISCORD_API_VERSION;
const BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}/`;

export async function DiscordRequest(endpoint: string, options: any) {
  const url = BASE_URL + endpoint;

  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'Fantasy DiscordBot (https://github.com/Wagmi-Football/fantasy-bots, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}