const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("ready", () => {
   client.user.setGame(prefix + `yardım | ${client.guilds.size} Sunucuya ve ${client.users.size} Kullanıcıya Hizmet Veriliyor | Manyaq Bot`)
  console.log("Bağlandım!")
});

bot.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'hosgeldiniz-log');
  if (!channel) return;
  if(!channel) return message.channel.send(" `hosgeldiniz-log` İsminde Yazı Kanalı Bulamıyorum.!");

  channel.send(`Sunucuya hoşgeldiniz, ${member}`);
  const sunucubilgi = new Discord.RichEmbed()
  .setAuthor(`Aramıza Hoşgeldin ${member}`)
  .setColor(3447003)
  .setTimestamp()
  .setDescription('')
  .setImage(`http://clawbot.tk/img/hg.png`)
  return message.channel.sendEmbed(sunucubilgi);
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.channel.sendMessage('Aleyküm Selam, Hoşgeldin');
  }
  if (msg.content.toLowerCase() === 'merhaba') {
    msg.channel.sendMessage('Merhaba, Hoşgeldin');
  }
  if (msg.content.toLowerCase() === 'nasılsın') {
    msg.channel.sendMessage('İyiyim. Sen nasılsın?');
  }
  if (msg.content.toLowerCase() === 'ben de iyiyim') {
    msg.channel.sendMessage('İyi olduğuna sevindim');
  }
  if (msg.content.toLowerCase() === 'manyaq') {
    msg.channel.sendMessage('Efendim?');
  }
  if (msg.content.toLowerCase() === 'selamun aleyküm') {
    msg.channel.sendMessage('Aleyküm Selam, Hoşgeldin');
  }
  if (msg.content.toLowerCase() === 'selamunaleyküm') {
    msg.channel.sendMessage('Aleyküm Selam, Hoşgeldin');
  }
  if (msg.content.toLowerCase() === 'bb') {
    msg.reply('Görüşmek Üzere');
  }
});

client.on('message', msg => {
  if (msg.content === 'm!puandurumu') {
    msg.reply('10.10.2018 Tarihi İçin https://giphy.com/gifs/sport-lpVQ40MItgEzAVltnk');
  }
});

client.on('message', msg => {
  if (msg.content === 'm!maçlar') {
    msg.reply('10.10.2018 Tarihi İçin https://giphy.com/gifs/sport-dIPGSEukFm8nri427v');
  }
});


client.on('message', msg => {
  if (msg.content.toLowerCase() === 'mal' ) {
    msg.delete();
    msg.reply(' Lütfen Küfür Etme!');
    msg.delete(0.01)
    msg.channel.bulkDelete(1);
  }
});

client.login(ayarlar.token);
