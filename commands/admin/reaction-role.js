const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const db = require('../database.js'); // Import the database handler

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reaction_role')
		.setDescription('Adds a reaction role to a specified message.')
		.addStringOption(option =>
			option.setName('message_id')
				.setDescription('The ID of the message to add the reaction role to')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('emoji')
				.setDescription('The emoji for the reaction role')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('role_name')
				.setDescription('The name of the role to assign when users react')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

	async execute(interaction) {
		const messageId = interaction.options.getString('message_id');
		const emoji = interaction.options.getString('emoji');
		const roleName = interaction.options.getString('role_name');
		const { guild, channel } = interaction;

		try {
			// Fetch the message
			const message = await channel.messages.fetch(messageId);
			await message.react(emoji);

			// Check if role exists, otherwise create it
			let role = guild.roles.cache.find(r => r.name === roleName);
			if (!role) {
				role = await guild.roles.create({
					name: roleName,
					color: '#99aab5',
					reason: `Reaction role created by ${interaction.user.tag}`,
				});
			}

			// Store reaction role with guild ID in the database
			db.addReactionRole(messageId, guild.id, emoji, role.id);

			await interaction.reply({ content: `✅ Reaction role set in **${guild.name}**! React with ${emoji} to get **${role.name}**.`, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error('Error setting reaction role:', error);
			await interaction.reply({ content: '❌ Failed to set reaction role. Check permissions and message ID.', flags: MessageFlags.Ephemeral });
		}
	},
};
