const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_role')
		.setDescription('Creates a new role in the server.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the new role')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('color')
				.setDescription('The color of the role in hex (ex., #ff0000)')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles), // Restrict to users with Manage Roles permission

	async execute(interaction) {
		const roleName = interaction.options.getString('name');
		const roleColor = interaction.options.getString('color') || '#FFFFFF';

		try {
			const role = await interaction.guild.roles.create({
				name: roleName,
				color: roleColor,
				reason: `Role created by ${interaction.user.tag}`,
			});

			await interaction.reply({ content: `✅ Role **${role.name}** created successfully!`, flags: MessageFlags.Ephemeral });
		} catch (error) {
			console.error('Error creating role:', error);
			await interaction.reply({ content: '❌ Failed to create role. Make sure I have the necessary permissions.', flags: MessageFlags.Ephemeral });
		}
	},
};