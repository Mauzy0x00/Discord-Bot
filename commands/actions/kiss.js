const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Give someone a kiss ;)')
    .addUserOption(option => option.setName('kissed').setDescription('Who u kissin?').setRequired(true)),

    async execute(interaction) {
        const query = 'anime kiss';
        const limit = 25;
        const mediaFilter = 'minimal';
        const kissed = interaction.options.getUser('kissed');

        const { data } = await axios.get(`https://api.tenor.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        // Choose a random gif 
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const gifUrl = data.results[randomIndex].media_formats.gif.url;

        const kissEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user.username} kissed ${kissed} ❤️`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [kissEmbed] });
    },
};