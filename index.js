// Require the necessary discord.js classes

// fs is Node's native file system module. used to read the commands
// path is Node's native path utility module. path helps construct paths to access files and directories. Path auto detects the OS and uses appropriate joiners.
// Collection class extends JavaScript's native Map class and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands Class
client.commands = new Collection();

// Construct an array of objects with the path and directory name for each commands directory
const commandsDirectories = [
	{ path: path.join(__dirname, 'commands'), name: '' },						// ./commands
	{ path: path.join(__dirname, 'commands', 'actions'), name: 'actions' },     // ./commands/actions
	{ path: path.join(__dirname, 'commands', 'admin'), name: 'admin' },	    // ./commands/admin
	{ path: path.join(__dirname, 'commands', 'emotes'), name: 'emotes' },	    // ./commands/emotes
	
  ];

// Loop through each directory and read its contents. Do this for every direcory specified above. 
// Array.filter() removes any non-JavaScript files from the array
for (const { path: dirPath } of commandsDirectories) {
	const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));

	// Now the correct files have been identified; Loop over the array and dynamically set each command into the client.commands Collection
	// For each file being loaded, check that it has at least the data and execute properties. --this prevents errors resulting from loading empty, unfinished or otherwise incorrect command files
	for (const file of commandFiles) {
		const filePath = path.join(dirPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Code to dynamically retrieve all of the event files in the events folder
// fs.readdirSync().filter() returns an array of all the file names in the given directory and filters for only .js files, i.e. ['ready.js', 'interactionCreate.js']
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	// The callback function passed takes argument(s) returned by its respective event, collects them in an args array using the ... rest parameter syntax, then calls event.execute() while passing in the args array using the ... spread syntax
	// They are used here because different events in discord.js have different numbers of arguments. The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the execute function.
	// After this, listening for other events is as easy as creating a new file in the events folder. The event handler will automatically retrieve and register it whenever you restart your bot.
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);
