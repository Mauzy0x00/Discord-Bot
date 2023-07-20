const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show').setRequired(true))
		// User option to get global or local avatar 
		.addStringOption(option => option.setName('type').setDescription('Select avatar scope')
									.addChoices({ name:'Global avatar', value:'global'}, { name:'Server avatar', value:'server'}
									)),

	async execute(interaction) {
		try {
			const target = interaction.options.getUser('target');
			const targetUsername = interaction.options.getUser('target').username;
			const type = interaction.options.getString('type');  // --> Get the string value of either `global` or `server`

			const avatarDisplayEmbed = new EmbedBuilder();

		// User wants to see their own profile picture!
			if (target == interaction.user) {

				avatarDisplayEmbed
					.setColor(0x00C995)
					.setAuthor({ name: `${interaction.user.username}` })
					.setImage(`${interaction.user.avatarURL()}`)
					.setFooter({ text: 'Hey look! It\'s you!'});
			}
	
		// Global profile picture selected
			else if (target && type === 'global') {

				avatarDisplayEmbed
					.setColor(0x00C995)
					.setAuthor({ name: `${targetUsername}` })
					.setImage(`${target.avatarURL()}`)
					.setFooter({ text: 'Are you stealing this picture?'});
			} 

		// Server profile picture option selected
			else if (target && type === 'server') {

				const targetServer = interaction.options.getMember('target');			// thank you @sir.jo for telling me about getMember() ^^
				const targetServerUsername = interaction.options.getMember('target');

				avatarDisplayEmbed
					.setColor(0x00C995)
					.setAuthor({ name: `${targetServerUsername}` })
					.setImage(`${targetServer.avatarURL()}`)
					.setFooter({ text: 'Are you stealing this picture? kinda sus ngl'});
			} 
			
		// No option type selected !  --> Default: Global profile picture
			else if (target) {

				avatarDisplayEmbed
					.setColor(0x00C995)
					.setAuthor({ name: `${targetUsername}` })
					.setImage(`${target.avatarURL()}`)
					.setFooter({ text: 'Are you stealing this picture?'});
			}

			await interaction.reply({ embeds: [avatarDisplayEmbed]});

		// Catch those heckin errors! 
		} catch(Error) {
			console.error(Error);
		  }
	},
}; 