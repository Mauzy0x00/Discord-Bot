const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { OpenAIApi } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Use ChatGPT')
    .addStringOption(option => option.setName('prompt').setDescription('Prompt sent to ChatGPT. This costs me moneies, please be nice :)').setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getUser('prompt').value;

        // Make request to OpenAI
        const configuration = new Configuration({
            apiKey: process.env.OpenAIApi,
          });
        const openai = new OpenAIApi(configuration);

        // Retreive language model and create completion
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
          });

        const response = completion.data.choices[0].message;

        return interaction.deferReply({ content: `ChatGPT: \`${response}\``, ephemeral: false });
    },
};


