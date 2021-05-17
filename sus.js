const Discord = require('discord.js');
const { PREFIX } = require('./config.json');

const client = new Discord.Client()

client.once('ready', () => {
	console.log('Ready to run');
  client.user.setActivity('Among US', {
			type: 'PLAYING'
		});
});

client.on('message', message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
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
			.setColor('BLUE')
			.setAuthor('Status', message.author.displayAvatarURL())
			.addField(`🔰Prefix:`, `${PREFIX}`)
			.addField(`🔰Ping:`, `${ping}ms`)
			.addField(
				`🕒Uptime`,
				`${days} day(s) ${hours} hours ${minutes} minutes`
			)
			.setFooter(message.author.tag)
			.setTimestamp();

		message.channel
			.send(embed)
			.then(msg => {
				msg.delete({ timeout: '5000' });
			})
			.catch(console.error);
		message.delete({ timeout: '5000' });
	}

  //How sus
  if (command === 'sus') {
    let user = message.mentions.users.first()
    if (!user) return message.channel.send('Please mention someone, even yourself!')
    
    var rate = Math.floor(Math.random() * 100);
    
    let embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setAuthor('There is one imposter among us', message.author.displayAvatarURL())
    .setThumbnail('https://i.imgur.com/9jgfmK9.png')
    .addField('Player', user)
    .addField('Sus Percent', rate + "% ")
    .setTimestamp();

    message.channel.send(embed);

    if(rate < 50) return message.channel.send(`${user} may be not the imposter`)
    if(rate > 60) return message.channel.send(`${user} is the IMPOSTER!`)   

  }
  
  //Help
  if (command === 'help') {
    let embed = new Discord.MessageEmbed() 
      .setColor('BLUE')
      .setAuthor('Commands', message.author.displayAvatarURL())
      .setDescription('`sus`\nCheck if they are imposter\n`status`\nBot status\n`invite`\nInvite this bot to your server')
      .setFooter(`Use ${PREFIX}<command>`)

      message.channel.send(embed);
    
  }
  
  //Invite
  if(command === 'invite') {
    message.channel.send('https://discord.com/api/oauth2/authorize?client_id=843701781884436530&permissions=0&scope=bot')
  }

})

var token = process.env['TOKEN'];
client.login(token);