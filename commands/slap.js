const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('SLAP EM!')
    .addUserOption(option => option.setName('slapped').setDescription('Who are you slapping?').setRequired(true)),

    async execute(interaction) {
        const query = 'anime slap';
        const limit = 25;
        const mediaFilter = 'minimal';
        const slapped = interaction.options.getUser('slapped');

        const { data } = await axios.get(`https://api.tenor.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        // Choose a random gif 
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const gifUrl = data.results[randomIndex].media_formats.gif.url;

        const slapEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user.username} slapped ${slapped} !!`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [slapEmbed] });
    },
};