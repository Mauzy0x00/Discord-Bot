const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const db = require('../../database.js'); // Import the database handler

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
        const { guild, channel } = interaction;

        try {
            // Fetch the message to check if it exists and is accessible
            const message = await channel.messages.fetch(messageId);
            await message.react(emoji);

            // Store the configuration in the reaction_role_configs table
            db.addReactionRoleConfig(messageId, guild.id, emoji, role.id);

            await interaction.reply({
                content: `✅ Reaction role set in **${guild.name}**! React with ${emoji} to get **${role.name}** role.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error setting reaction role:', error);
            await interaction.reply({
                content: '❌ Failed to set reaction role. Check if the message ID is valid and if I have permission to add reactions.',
                ephemeral: true
            });
        }
    },
};