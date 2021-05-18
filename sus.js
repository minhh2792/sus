const Discord = require('discord.js');
const { PREFIX, TIMEOUT } = require('./config.json');
const {
	STATUS,
	DAYS,
	HOURS,
	MINUTES,
	MENTION_SOMEONE,
	IAM_NOT_IMPOSTER,
	IMPOSTER_AMONG_US,
	PLAYER,
	SUS_PERCENT,
	NOT_THE_IMPOSTER,
	MAYBE_NOT_THE_IMPOSTER,
  MAYBE_IS_THE_IMPOSTER,
  IMPOSTER,
	COMMANDS,
	HELP_SUS,
	HELP_STATUS,
	HELP_INVITE,
	HELP_HELP,
	HELP_SOURCE_CODE,
  USE,
  COMMAND,
  INVITE,
  SOURCE_CODE
} = require('./resources/lang/en_US.json');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready to run');
	client.user.setActivity(`Among US | ${PREFIX}help`, {
		type: 'PLAYING'
	});
});

client.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content
		.slice(PREFIX.length)
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

		let embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(STATUS)
			.addField(`Prefix:`, `${PREFIX}`)
			.addField(`Ping:`, `${ping}ms`)
			.addField(`Uptime:`, `${days}${DAYS} ${hours}${HOURS} ${minutes}${MINUTES}`)
			.setFooter(message.author.tag)
			.setTimestamp();

		message.channel
			.send(embed)
			.then(msg => {
				msg.delete({ timeout: `${TIMEOUT}` });
			})
			.catch(console.error);
		message.delete({ timeout: `${TIMEOUT}` });
	}

	//How sus
	if (command === 'sus') {
		let user = message.mentions.users.first();
		if (!user)
			return message.channel.send(`${MENTION_SOMEONE}`);
		if (user.id === client.user.id)
			return message.channel.send(`${IAM_NOT_IMPOSTER}`);

		var rate = Math.floor(Math.random() * 100);

		let embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setAuthor(`${IMPOSTER_AMONG_US}`, client.user.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL())
			.addField(`${PLAYER}`, user)
			.addField(`${SUS_PERCENT}`, rate + "% ")
			.setTimestamp();

		message.channel.send(embed);

		if (rate <= 25) return message.channel.send(`${user} ${NOT_THE_IMPOSTER}`);
		else if (rate <= 50)
			return message.channel.send(`${user} ${MAYBE_NOT_THE_IMPOSTER}`);
		else if (rate >= 90) return message.channel.send(`${user} ${IMPOSTER}`);
		else if (rate > 50)
			return message.channel.send(`${user} ${MAYBE_IS_THE_IMPOSTER}`);
	}

	//Help
	if (command === 'help') {
		let embed = new Discord.MessageEmbed()
			.setColor('YELLOW')
			.setAuthor(`${COMMANDS}`)
			.addField('`sus`', `${HELP_SUS}`)
      .addField('`status`', `${HELP_STATUS}`)
      .addField('`invite`', `${HELP_INVITE}`)
      .addField('`help`', `${HELP_HELP}`)
      .addField('`sourcecode`', `${HELP_SOURCE_CODE}`)
			.setFooter(`${USE} ${PREFIX}<${COMMAND}>`);

		message.channel.send(embed);
	}

	//Invite
	if (command === 'invite') {
		let embed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setDescription(
				`${INVITE}\n[Click here](https://discord.com/api/oauth2/authorize?client_id=843701781884436530&permissions=0&scope=bot)`
			);

		message.channel.send(embed);
	}

	//Source code
	if (command === 'sourcecode') {
		let embed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setDescription(
				`${SOURCE_CODE}\n[Github](https://github.com/minhh2792/sus)`
			);

		message.channel.send(embed);
	}
});

var token = process.env['TOKEN'];
client.login(token);
