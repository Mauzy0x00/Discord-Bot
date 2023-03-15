
const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { OpenAIApiKey } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Use ChatGPT')
    .addStringOption(option => option.setName('prompt').setDescription('Prompt sent to ChatGPT. This costs me monies, please be nice :)').setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        console.log(prompt);

        await interaction.deferReply();  // tell discord to wait 15 min 

        // Make request to OpenAI
        const configuration = new Configuration({
            apiKey: OpenAIApiKey,
          });
        const openai = new OpenAIApi(configuration);

        // Retreive language model and create completion
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: `\`${prompt}\``}],
          });
        
        response  = completion.data.choices[0].message.content;
        response = response.replace(/\n\n/, "ChatGPT: ");    // message content from ChatGPT returns with two new lines, replace that with "ChatGPT: "
        console.log(response);
        
        await interaction.editReply({ content: `${interaction.user.username}: \`${prompt}\` \n\n ChatGPT:\`${response}\``});
    },
};











