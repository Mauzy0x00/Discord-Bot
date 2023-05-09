const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('greet')
    .setDescription('greet someone')
    .addUserOption(option => option.setName('cuteuser').setDescription('Person to greet').setRequired(true)),

    async execute(interaction) {
        const query = 'hello cute';
        const limit = 25;
        const mediaFilter = 'minimal';
        const greet = interaction.options.getUser('cuteuser');

        const { data } = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        // Choose a random gif 
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const gifUrl = data.results[randomIndex].media_formats.gif.url;

        const gifEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user.username} greets ${greet}`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [gifEmbed] });
    },
};