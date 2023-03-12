# Discord Bot

This repository contains a simple Discord bot that I created as a learning endeavor. The bot has limited commands and is designed to run on my home web server.

## Getting Started

To use this bot, you will need to do the following:

1. Clone this repository to your local machine.
2. Install the necessary dependencies by running `npm install discord.js` and `npm install axios`. If you do not have nodejs you will need to install it
3. Set up a Discord bot and obtain a bot token.
4. create a `config.json` file in the root directory of the project and add the following:

  
<code>{
    "clientId": "Bot ID",
    "guildId": "your discord server ID",
    "token": "your bot token",
    "tenorAPI": "your tenor api token"
      }</code>
  

5. Run the bot by running `node index.js`. If you want the process to run in the background without exiting use `nohup node discord-bot/index.js &`. I have not been able to run that via SSH, I had to run that on the server itself then using `exit` to logout.

## Available Commands

Currently, the bot supports the following commands:

- `/avatar`: Fetches a user's avatar.
- `/hug`: Specify a user and the bot will send a hug gif @ that user (in development).
- `/kiss`: Specify a user and the bot will send a kiss gif @ that user (in development).
- `/slap`: Specify a user and the bot will send a slap gif @ that user (in development).
- `/kick`: Doesn't kick anyone.
- `/bing`: Replies with "Bong!".
- `/prune`: Prune specified number of messages in the active channel.
- `/server`: Fetch server information.
- `/user`: Fetch user information.


## Contributing

This bot is a personal learning project, so contributions are not currently being accepted. However, feel free to fork this repository and modify the code to suit your needs.
