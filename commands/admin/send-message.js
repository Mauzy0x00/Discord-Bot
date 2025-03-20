const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageFlags, PermissionFlagsBits} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send_message')
		.setDescription('Sends a message to a chosen channel. Hit enter for the popup textbox.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to send the message to')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Optional title for the message')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const title = interaction.options.getString('title') || '';

		if (!channel.isTextBased()) {
			return interaction.reply({ 
				content: 'Please select a text-based channel.', 
				flags: MessageFlags.Ephemeral 
			});
		}

		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId(`send_message_modal_${interaction.id}`) // Unique ID using the interaction id
			.setTitle('Enter Your Message');

		// Create a multi-line text input component for message content
		const messageInput = new TextInputBuilder()
			.setCustomId('messageInput')
			.setLabel('Message Content')
			.setStyle(TextInputStyle.Paragraph) // Paragraph style allows multi-line input
			.setPlaceholder('Type your message here...')
			.setRequired(true);

		// Create an action row for the text input (you can have up to 5 components per modal)
		const actionRow = new ActionRowBuilder().addComponents(messageInput);
		modal.addComponents(actionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

		// Wait for the modal to be submitted
		const filter = (modalInteraction) => 
			modalInteraction.customId === `send_message_modal_${interaction.id}` &&
			modalInteraction.user.id === interaction.user.id;

		try {
			const modalSubmission = await interaction.awaitModalSubmit({ filter, time: 300000 }); // 5 minute timeout

			// Get the text input from the modal submission
			const messageContent = modalSubmission.fields.getTextInputValue('messageInput');

			// Format the final message. If a title was provided, prepend it.
			let finalMessage = title ? `**${title}**\n\n` : '';
			finalMessage += messageContent;

			// Send the final message to the specified channel
			await channel.send(finalMessage);

			// Acknowledge the modal submission
			await modalSubmission.reply({ content: 'Message sent!', flags: MessageFlags.Ephemeral });
		} catch (error) {
			// If the user doesn't submit the modal in time, let them know.
			await interaction.followUp({ content: 'You did not submit the modal in time.', flags: MessageFlags.Ephemeral });
		}
	},
};