const db = require('../utils/database.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        try {
            // Get notification settings for this guild
            const settings = db.getJoinNotificationSettings(member.guild.id);
            
            if (!settings) return; // No settings found for this guild
            
            const channel = member.guild.channels.cache.get(settings.channel_id);
            if (!channel) return; // Channel no longer exists
            
            // Replace {user} placeholder with member mention
            const welcomeMessage = settings.message.replace('{user}', `<@${member.id}>`);
            
            // Send welcome message
            await channel.send(welcomeMessage);
        } catch (error) {
            console.error('Error sending join notification:', error);
        }
    },
};