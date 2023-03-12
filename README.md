# Discord Bot

This repository contains a simple Discord bot that I created as a learning endeavor. The bot has limited commands and is designed to run on my home web server.

## Getting Started

To use this bot, you will need to do the following:

1. Clone this repository to your local machine.
2. Install the necessary dependencies by running `npm install`.
3. Set up a Discord bot and obtain a bot token.
4. Create a `.env` file in the root directory of the project and add the following:

  ``DISCORD_TOKEN=<your-bot-token-here>``
  
 4b. Alternatively, create a `config.json` file in the root directory of the project and add the following:

<code>{
    "clientId": "Bot ID",
    "guildId": "your discord server ID",
    "token": "your bot token"
      }</code>
      
5. Run the bot by running `node index.js`.

## Available Commands

Currently, the bot supports the following commands:

- `/avatar': Fetches a user's avatar.
- `/hug`: Specify a user and the bot will send a hug gif @ that user (in development).
- `/kick`: Doesn't kick anyone.
- `/bing`: Replies with "Bong!".
- `/prune`: Prune specified number of messages in the active channel.
- `/server`: Fetch server information.
- `/user`: Fetch user information.


## Contributing

This bot is a personal learning project, so contributions are not currently being accepted. However, feel free to fork this repository and modify the code to suit your needs.
