//Import the library
const Discord = require('discord.js');
const prefix = require('discord-prefix');

//Config
let TIMEOUT = '5000';
let defaultPrefix = '/';

//Setup new client
const client = new Discord.Client();

//Ready event
client.once('ready', () => {
	console.log('Ready to run');
	console.log(`Server: ${client.guilds.cache.size}`);
	client.user.setActivity(`Among US`, {
		type: 'PLAYING'
	});
});

//Message event
client.on('message', message => {
	let guildPrefix = prefix.getPrefix(message.guild.id);

	if (!guildPrefix) guildPrefix = defaultPrefix;

	if (!message.content.startsWith(guildPrefix) || message.author.bot) return;

	const args = message.content
		.slice(guildPrefix.length)
		.trim()
		.split(/ +/);
	const command = args.shift().toLowerCase();

	//Status
	if (command === 'status') {
		let ping = Math.round(message.client.ws.ping);

		//Credit to EvoBot
		let seconds = Math.floor(message.client.uptime / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		let days = Math.floor(hours / 24);

		seconds %= 60;
		minutes %= 60;
		hours %= 24;

		let status = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Status')
			.addField('Prefix:', `${guildPrefix}`)
			.addField('Server', `${client.guilds.cache.size}`)
			.addField(`Ping:`, `${ping}ms`)
			.addField(`Uptime:`, `${days}d ${hours}h ${minutes}m`)
			.setTimestamp();

		message.channel
			.send(status)
			.then(msg => {
				msg.delete({ timeout: `${TIMEOUT}` });
			})
			.catch(console.error);
		message.delete({ timeout: `${TIMEOUT}` });
	}

	//How sus
	if (command === 'sus') {
		//Get the mentioned user
		let user = message.mentions.users.first();
		if (!user) return message.reply('please mention someone');
		if (user.id === client.user.id) return message.reply('I\'m not imposter')

		const rate = Math.floor(Math.random() * 100);

		let sus = new Discord.MessageEmbed()
			.setColor('RED')
			.setAuthor(
				'There is one imposter among us',
				client.user.displayAvatarURL()
			)
			.setThumbnail(user.displayAvatarURL())
			.addField('Player', user)
			.addField('Sus Percent', rate + '% ')
			.setTimestamp();

		message.channel.send(sus);

		if (rate <= 25) return message.channel.send(`${user} is not the imposter`);
		else if (rate <= 50)
			return message.channel.send(`${user} maybe not the imposter`);
		else if (rate >= 90)
			return message.channel.send(`${user} is the IMPOSTER 😳`);
		else if (rate > 50)
			return message.channel.send(`${user} maybe is the imposter 🤔`);
	}

	//Help
	if (command === 'help') {
		let help = new Discord.MessageEmbed()
			.setColor('YELLOW')
			.setAuthor('Commands')
			.addField('`sus`', 'Check if someone is sus')
			.addField('`status`', 'Bot status')
			.addField('`prefix`', 'Set the bot prefix')
			.addField('`invite`', 'Invite bot to your server')
			.addField('`help`', 'This message')
			.addField('`sourcecode`', 'Source code')
			.setFooter(`Use ${guildPrefix}<command>`);

		message.channel.send(help);
	}

	//Invite
	if (command === 'invite') {
		let invite = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setDescription(
				'Invite bot to your server\n[Click here](https://discord.com/api/oauth2/authorize?client_id=843701781884436530&permissions=124992&scope=bot)'
			);

		message.channel.send(invite);
	}

	//Source code
	if (command === 'sourcecode') {
		let src = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setDescription(
				'This bot is open source\n[Github](https://github.com/minhh2792/sus)'
			);

		message.channel.send(src);
	}

	//Set prefix
	if (command === 'prefix') {
		let p = args.slice().join(' ');

		if (!p) return message.reply('please tell me the prefix you want to set');

		prefix.setPrefix(p, message.guild.id);

		message.reply('done!');
	}
});

let token = process.env['TOKEN'];
client.login(token);
