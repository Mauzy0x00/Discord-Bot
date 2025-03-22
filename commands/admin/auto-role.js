// commands/autorole.js
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const db = require('../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('Manage automatic role assignment for new members who accept rules')
        .setDefaultMemberPermissions(PermissionFlagsBits.ADMINISTRATOR)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set the role to be automatically assigned')
                .addRoleOption(option => 
                    option.setName('role')
                        .setDescription('The role to assign')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disable autorole'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Enable autorole'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove autorole configuration'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check current autorole configuration')),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;
        
        switch(subcommand) {
            case 'set':
                const role = interaction.options.getRole('role');
                db.setAutorole(guildId, role.id);
                await interaction.reply({
                    content: `Autorole has been set to ${role.name}. Members who accept rules will automatically receive this role.`,
                    flags: MessageFlags.Ephemeral
                });
                break;
                
            case 'disable':
                db.disableAutorole(guildId);
                await interaction.reply({
                    content: 'Autorole has been disabled.',
                    flags: MessageFlags.Ephemeral
                });
                break;
                
            case 'enable':
                const existingConfig = db.getAutorole(guildId);
                if (!existingConfig) {
                    await interaction.reply({
                        content: 'No autorole has been configured. Please set a role first.',
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                
                db.enableAutorole(guildId);
                const autoRole = interaction.guild.roles.cache.get(existingConfig.role_id);
                const roleName = autoRole ? autoRole.name : 'Unknown role';
                
                await interaction.reply({
                    content: `Autorole has been enabled. Members who accept rules will automatically receive the "${roleName}" role.`,
                    flags: MessageFlags.Ephemeral
                });
                break;
                
            case 'remove':
                db.removeAutorole(guildId);
                await interaction.reply({
                    content: 'Autorole configuration has been removed.',
                    flags: MessageFlags.Ephemeral
                });
                break;
                
            case 'status':
                const config = db.getAutorole(guildId);
                if (!config) {
                    await interaction.reply({
                        content: 'No autorole has been configured for this server.',
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                
                const autorole = interaction.guild.roles.cache.get(config.role_id);
                const name = autorole ? autorole.name : 'Unknown role (may have been deleted)';
                const status = config.enabled ? 'Enabled' : 'Disabled';
                
                await interaction.reply({
                    flags: MessageFlags.Ephemeral
                });
                break;
        }
    }
};