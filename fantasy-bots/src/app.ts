import 'dotenv/config';
import express, { Request, Response } from "express";
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware
} from "discord-interactions";
import { DiscordRequest } from "./utils";

const app: express.Application = express();
const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "";

app.use(express.json());
app.disable("x-powered-by");

app.use("/health", (_: Request, res: Response) => {
  res.status(200).json("Server is healthy");
});

/**
 * Create Guild Command
 */
app.use("/command", (_: Request, res: Response) => {
  createCommand();
  res.status(200).json("Guild command created");
});

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;
  // console.log("body", req.body);
  /**
   * Handle verification requests
   */
   if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }
  /**
   * Handle slash command requests
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    // Slash command with name of "test"
    if (data.name === 'test') {
      // Send a message as response
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: 'A wild message appeared' },
      });
    }
  }
});

async function createCommand() {
  const appId = process.env.APP_ID;
  const guildId = process.env.GUILD_ID;

  const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;
  const commandBody = {
    name: 'test',
    description: 'Just a test command',
    // chat command (see https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types)
    type: 1,
  };

  try {
    // Send HTTP request with bot token
    const res = await DiscordRequest(guildEndpoint, {
      method: 'POST',
      body: commandBody,
    });
    console.log(await res.json());
  } catch (err) {
    console.error('Error installing commands: ', err);
  }
}

export default app;