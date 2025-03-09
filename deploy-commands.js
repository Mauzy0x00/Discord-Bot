const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];

// Grab all the command files from the commands directory

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	console.log(`🔍 Loading: ${file}`);

	const command = require(`./commands/${file}`);

	if (!command || !command.data) {
        console.error(`❌ Error: ${file} does not export "data". Skipping.`);
        continue;
    }

    if (typeof command.data.toJSON !== 'function') {
        console.error(`❌ Error: ${file}'s "data" property is not valid. Skipping.`);
        continue;
    }

	commands.push(command.data.toJSON());
}

// Actions
const actionFiles = fs.readdirSync('./commands/actions').filter(file => file.endsWith('.js'));
for (const file of actionFiles) {

	console.log(`🔍 Loading: ${file}`);

	const command = require(`./commands/actions/${file}`);

	if (!command || !command.data) {
        console.error(`❌ Error: ${file} does not export "data". Skipping.`);
        continue;
    }

    if (typeof command.data.toJSON !== 'function') {
        console.error(`❌ Error: ${file}'s "data" property is not valid. Skipping.`);
        continue;
    }

	commands.push(command.data.toJSON());
}


// Admin
const adminFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js')); 
for (const file of adminFiles) {
	console.log(`🔍 Loading: ${file}`);

	const command = require(`./commands/admin/${file}`);

	if (!command || !command.data) {
        console.error(`❌ Error: ${file} does not export "data". Skipping.`);
        continue;
    }

    if (typeof command.data.toJSON !== 'function') {
        console.error(`❌ Error: ${file}'s "data" property is not valid. Skipping.`);
        continue;
    }

	commands.push(command.data.toJSON());
}


// AI
const AIFiles = fs.readdirSync('./commands/AI').filter(file => file.endsWith('.js'));
for (const file of AIFiles) {
	console.log(`🔍 Loading: ${file}`);

	const command = require(`./commands/AI/${file}`);

	if (!command || !command.data) {
        console.error(`❌ Error: ${file} does not export "data". Skipping.`);
        continue;
    }

    if (typeof command.data.toJSON !== 'function') {
        console.error(`❌ Error: ${file}'s "data" property is not valid. Skipping.`);
        continue;
    }

	commands.push(command.data.toJSON());
}


// Emotes
const emoteFiles = fs.readdirSync('./commands/emotes').filter(file => file.endsWith('.js'));
for (const file of emoteFiles) {
	console.log(`🔍 Loading: ${file}`);

	const command = require(`./commands/emotes/${file}`);

	if (!command || !command.data) {
        console.error(`❌ Error: ${file} does not export "data". Skipping.`);
        continue;
    }

    if (typeof command.data.toJSON !== 'function') {
        console.error(`❌ Error: ${file}'s "data" property is not valid. Skipping.`);
        continue;
    }

	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy commands!
(async () => {
	try {
		console.log(`\n\n[+] Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`\n[+] Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
