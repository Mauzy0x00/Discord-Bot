const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { tenorAPI } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a hug :)')
    .addUserOption(option => option.setName('hugee').setDescription('Person to hug').setRequired(true)),

    async execute(interaction) {
        const query = 'anime-hug';
        const limit = 1;
        const mediaFilter = 'minimal';
        const user = interaction.options.getUser('hugee');

        const { data } = await axios.get(`https://api.tenor.com/v1/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        const hugEmbed = new MessageEmbed()
        .setDescription(`Sending a hug to ${hugee} ❤️`)
        .setImage(data.results[0].media[0].gif.url);

        await interaction.reply({ embeds: [hugEmbed] });
    },
};