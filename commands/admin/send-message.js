const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send_message')
		.setDescription('Sends an embedded message to a specified channel.')
		.addChannelOption(option => 
			option.setName('channel')
				.setDescription('The channel to send the message to')
				.setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(false)),


	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const title = interaction.options.getString('title') || null;
		const message = interaction.options.getString('message');

		if (!channel.isTextBased()) {
			return interaction.reply({ content: 'Please select a text-based channel.', flags: MessageFlags.Ephemeral });
		}

		await channel.send(message);


        const message_Embed = new EmbedBuilder()
            .setColor(0x00C995)
            .setDescription(message);

        if (title) message_Embed.setTitle(title);

		await channel.send({ embeds: [message_Embed] });
		await interaction.reply({ content: 'Message sent!' });

	},
};