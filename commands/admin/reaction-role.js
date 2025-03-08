const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

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
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('The role to assign when users react')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
		
	async execute(interaction) {
		const messageId = interaction.options.getString('message_id');
		const emoji = interaction.options.getString('emoji');
		const role = interaction.options.getRole('role');
		const channel = interaction.channel;

		try {
			const message = await channel.messages.fetch(messageId);
			await message.react(emoji);

			interaction.client.on('messageReactionAdd', async (reaction, user) => {
				if (reaction.message.id === messageId && reaction.emoji.name === emoji) {
					const member = await reaction.message.guild.members.fetch(user.id);
					await member.roles.add(role);
				}
			});

			interaction.client.on('messageReactionRemove', async (reaction, user) => {
				if (reaction.message.id === messageId && reaction.emoji.name === emoji) {
					const member = await reaction.message.guild.members.fetch(user.id);
					await member.roles.remove(role);
				}
			});

			await interaction.reply({ content: `Reaction role set! React to the message with ${emoji} to get the role.`, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Failed to add reaction role. Make sure the message ID is correct and the bot has permissions.', flags: MessageFlags.Ephemeral });
		}
	},
};
