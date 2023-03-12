const { Events } = require('discord.js');

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
	},
};
