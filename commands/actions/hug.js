const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a hug :)')
    .addUserOption(option => option.setName('hugee').setDescription('Person to hug').setRequired(true)),

    async execute(interaction) {
        const query = 'anime hug';
        const limit = 25;
        const mediaFilter = 'minimal';
        const hugee = interaction.options.getUser('hugee');

        const { data } = await axios.get(`https://api.tenor.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        // Choose a random gif 
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const gifUrl = data.results[randomIndex].media_formats.gif.url;

        const hugEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user.username} hugged ${hugee} ❤️`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [hugEmbed] });
    },
};