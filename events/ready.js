const { Events } = require('discord.js');
const db = require('../database.js');

// When the client is ready, run this code (only once)
module.exports = {
	// The name property states which event this file is for,
	// and the once property holds a boolean value that specifies if the event should run only once.
	name: Events.ClientReady,
	once: true,
	// The execute function holds your event logic, which will be called by the event
	// handler whenever the event emits
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(`Testing database...\n`);

        try {
            const configs = db.getAllReactionRoleConfigs();
            console.log(`✅ Found ${configs.length} reaction role configurations in the database.`);
        } catch (error) {
            console.error('❌ Failed to check reaction roles:', error);
        }

		try {
            const configs = db.getAllMessageLogSettings();
            console.log(`✅ Found ${configs.length} message log settings in the database.`);
        } catch (error) {
            console.error('❌ Failed to check message log settings:', error);
        }

        try {
            const configs = db.getAllJoinNotificationSettings();
            console.log(`✅ Found ${configs.length} join notification settings in the database.`);
        } catch (error) {
            console.error('❌ Failed to check message log settings:', error);
        }

        try {
            const configs = db.getAllAutoroles();
            console.log(`✅ Found ${configs.length} auto role settings in the database.`);
        } catch (error) {
            console.error('❌ Failed to check message log settings:', error);
        }

	},
};
