# Discord Bot

This repository contains a simple Discord bot that I created as a learning endeavor. The bot has limited commands and is designed to run on my home web server.

## Getting Started

To use this bot, you will need to do the following:

1. Clone this repository to your local machine.
2. If you do not have nodejs you will need to install it. One method of installation on a windows machine: `winget install OpenJS.NodeJS`
3. Install the necessary dependencies by running `sudo apt install nodejs`, `npm install discord.js`, `npm install openai`, `npm install axios`. 
4. Set up a Discord bot through the discord developer portal and obtain a bot token.
5. Create an account at OpenAI and obtain an API key.
6. Create an account at Tenor and obtain an API key.
7. Create a `config.json` file in the root directory of the project and add the following:

  
<code>{
    "clientId": "Bot ID",
    "guildId": "your discord server ID",
    "token": "your bot token",
    "tenorAPI": "your tenor api token",
    "OpenAIApiKey": "your openai api token"
      }</code>
  
8. Test your build by running `node deploy-commands.js` in the root directory of the project. 
9. Run the bot by running `node index.js`. If you want the process to run in the background without exiting use `nohup node discord-bot/index.js &`. I have not been able to run that via SSH, I had to run that on the server itself then using `exit` to logout.

## Available Commands

Currently, the bot supports the following commands:

- `/avatar`: Fetches a user's avatar.
- `/chat`: ChatGPT integration using gpt-3.5-turbo. 
- `/hug`: Specify a user and the bot will send a hug gif @ that user.
- `/kiss`: Specify a user and the bot will send a kiss gif @ that user.
- `/slap`: Specify a user and the bot will send a slap gif @ that user.
- `/kick`: Doesn't kick anyone.
- `/bing`: Replies with "Bong!".
- `/prune`: Prune specified number of messages in the active channel.
- `/server`: Fetch server information.
- `/user`: Fetch user information.


## Contributing

This bot is a personal learning project, so contributions are not currently being accepted. However, feel free to fork this repository and modify the code to suit your needs.
