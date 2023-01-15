# KerkBot

A ChatGPT chat bot for discord.

# Prerequisites 

- Get an OpenAI API Key ( see https://beta.openai.com/account/api-keys )
- Create a discord App and Bot ( see https://docs.discord4j.com/discord-application-tutorial/ )
- Add the discord bot to your server ( see https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links )

# Install & Configure Bot

You'll need a server capable of running a node process (linux/ubuntu recommended)

- clone this repo
- create an `.env` file in root directory using `example.env` as your example 
- Add your discord bot token and openai api key
- Add your bot's author ID and if you're bot has a dedicated channel add the channel ID
- Edit `src/personality.json` file and give your bot pre-defined personality by providing specific answers to specific questions.  The default is a bit sarcastic.
- install dependencies `yarn` or `npm install`
- run `yarn build` or `npm run build`

# Running the bot

- Basic usage run `node build/index.js`

If you want your bot to run consistently and give itself a little reboot once in a while I recommend installing PM2 ( see https://pm2.io/docs/runtime/guide/installation/ )

- Run the bot in background with a daily reboot `pm2 start build/index.js --cron-restart="0 0 * * *"`
- Restart the bot `pm2 restart index`
- View bot logs `pm2 log index`
