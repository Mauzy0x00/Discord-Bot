const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit_message')
		.setDescription('Edit a message sent by the bot')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel containing the message')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message_id')
				.setDescription('The ID of the bot message to edit')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const messageId = interaction.options.getString('message_id');

		if (!channel.isTextBased()) {
			return interaction.reply({ 
				content: 'Please select a text-based channel.', 
				flags: MessageFlags.Ephemeral 
			});
		}

		// Try fetching the message
		let botMessage;
		try {
			botMessage = await channel.messages.fetch(messageId);
		} catch (error) {
			return interaction.reply({ 
				content: 'Could not fetch the message with that ID in the specified channel.', 
				flags: MessageFlags.Ephemeral 
			});
		}

		// Ensure the message was sent by the bot
		if (botMessage.author.id !== interaction.client.user.id) {
			return interaction.reply({ 
				content: 'That message was not sent by me, so I cannot edit it.', 
				flags: MessageFlags.Ephemeral 
			});
		}

		// Create a modal for editing the message
		const modal = new ModalBuilder()
			.setCustomId(`edit_message_modal_${interaction.id}`)
			.setTitle('Edit Bot Message');

		// Pre-fill the modal with the original message text using setValue()
		const contentInput = new TextInputBuilder()
			.setCustomId('contentInput')
			.setLabel('New Message Content')
			.setStyle(TextInputStyle.Paragraph)
			.setValue(botMessage.content) // Pre-populate with the original text
			.setRequired(true);

		const actionRow = new ActionRowBuilder().addComponents(contentInput);
		modal.addComponents(actionRow);

		// Show the modal to the admin
		await interaction.showModal(modal);

		const filter = (modalInteraction) => 
			modalInteraction.customId === `edit_message_modal_${interaction.id}` &&
			modalInteraction.user.id === interaction.user.id;

		try {
			const modalSubmission = await interaction.awaitModalSubmit({ filter, time: 300000 }); // 5 minute timeout

			const newContent = modalSubmission.fields.getTextInputValue('contentInput');

			// Edit the bot message
			await botMessage.edit(newContent);

			await modalSubmission.reply({ content: 'Message updated!', flags: MessageFlags.Ephemeral });
		} catch (error) {
			await interaction.followUp({ content: 'You did not submit the modal in time.', flags: MessageFlags.Ephemeral });
		}
	},
};
