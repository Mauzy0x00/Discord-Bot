const axios = require('axios');     // axios package to make a GET request to the Tenor API and retrieve a gif
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { tenorAPI } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bing')
		.setDescription('Replies with Bong!'),

	async execute(interaction) {

		const query = 'bing bong';
        const limit = 1;
        const mediaFilter = 'minimal';

        const { data } = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorAPI}&limit=${limit}&media_filter=${mediaFilter}`);

        const gifUrl = data.results[0].media_formats.gif.url; // get the first result

        const gifEmbed = new EmbedBuilder()
        .setDescription(`Bing Bong!`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [gifEmbed] });
	},
};