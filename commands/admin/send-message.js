const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, MessageFlags, PermissionFlagsBits } = require('discord.js');

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
			.setPlaceholder('Type your message here... Use @Role to mention roles.')
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
			let messageContent = modalSubmission.fields.getTextInputValue('messageInput');
			
			// Format the final message. If a title was provided, prepend it.
			let finalMessage = title ? `**${title}**\n\n` : '';
			finalMessage += messageContent;
			
			// Convert @role mentions to proper Discord mention format
			const processedMessage = await convertMentions(finalMessage, interaction.guild);

			// Send the final message to the specified channel with allowed mentions
			await channel.send({
				content: processedMessage,
				allowedMentions: { parse: ['roles', 'users', 'everyone'] }
			});

			// Acknowledge the modal submission
			await modalSubmission.reply({ content: 'Message sent!', flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error('Error in send_message command:', error);
			// If the user doesn't submit the modal in time, let them know.
			if (error.name === 'Error' && error.message === 'Modal timed out') {
				await interaction.followUp({ content: 'You did not submit the modal in time.', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.followUp({ content: 'An error occurred while sending the message.', flags: MessageFlags.Ephemeral });
			}
		}
	},
};

/**
 * Converts text mentions (@RoleName) to proper Discord mention format (<@&ROLE_ID>)
 * @param {string} text - The message text to process
 * @param {Guild} guild - The guild object to look up roles
 * @returns {string} - The processed message with proper mention formatting
 */
async function convertMentions(text, guild) {
	// Get all roles in the guild
	const roles = await guild.roles.fetch();
	
	// Replace @role mentions with the proper format
	let processedText = text;
	
	// Use a regex to find potential role mentions (@RoleName)
	const mentionRegex = /@(\w+)/g;
	let match;
	
	while ((match = mentionRegex.exec(text)) !== null) {
		const roleName = match[1];
		
		// Find the role by name (case-insensitive)
		const role = roles.find(r => 
			r.name.toLowerCase() === roleName.toLowerCase() ||
			r.name.toLowerCase().startsWith(roleName.toLowerCase())
		);
		
		if (role) {
			// Replace the text mention with the proper Discord mention format
			processedText = processedText.replace(
				match[0], // The matched text (e.g., @Admin)
				`<@&${role.id}>` // The proper Discord role mention format
			);
		}
	}
	
	return processedText;
}