const { Events } = require('discord.js');
const db = require('../utils/database');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // Check if the member was pending before and is not pending now
        // This means they've accepted the rules in the screening
        if (oldMember.pending && !newMember.pending) {
            const guildId = newMember.guild.id;
            const autoroleConfig = db.getAutorole(guildId);
            
            // If autorole is configured and enabled
            if (autoroleConfig && autoroleConfig.enabled) {
                try {
                    // Get the role and assign it
                    const role = await newMember.guild.roles.fetch(autoroleConfig.role_id);
                    
                    if (role) {
                        await newMember.roles.add(role);
                        console.log(`Assigned autorole ${role.name} to ${newMember.user.tag} after passing membership screening`);
                    } else {
                        console.error(`Autorole with ID ${autoroleConfig.role_id} not found`);
                    }
                } catch (error) {
                    console.error('Error assigning autorole:', error);
                }
            }
        }
    }
};