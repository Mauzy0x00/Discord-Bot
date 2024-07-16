const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bing')
		.setDescription('Replies with Bong!'),

	async execute(interaction) {

        const gifUrl = "https://media.tenor.com/pMSSbsJiECEAAAAM/bing-bong.gif"; 

        const gifEmbed = new EmbedBuilder()
        .setDescription(`Bing Bong!`)
        .setImage(gifUrl);

        await interaction.reply({ embeds: [gifEmbed] });
	},
};