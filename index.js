const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '.';

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  client.user.setActivity('.ayuda para spam', { type: 'PLAYING' });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ayuda') {
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🤖 BOT DE SPAM DE COMENTARIOS')
      .setDescription('**Comando:** `.spam tu mensaje aquí`\n\nEl bot enviará **5 comentarios** con tu texto.')
      .setFooter({ text: 'Comunidad FORGEX' });

    await message.channel.send({ embeds: [embed] });
  }

  if (command === 'spam') {
    if (args.length === 0) return message.reply('Escribe el mensaje: `.spam texto`');

    const texto = args.join(' ');

    const embed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle('Confirmar spam')
      .setDescription(`Enviar 5 veces:\n"${texto}"`);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('si').setLabel('ENVIAR 5').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('no').setLabel('Cancelar').setStyle(ButtonStyle.Danger)
      );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'si') {
        await i.update({ content: 'Enviando...', embeds: [], components: [] });
        for (let j = 1; j <= 5; j++) {
          await message.channel.send(`${texto} (${j}/5)`);
          await new Promise(r => setTimeout(r, 1000));
        }
      } else {
        await i.update({ content: 'Cancelado.', embeds: [], components: [] });
      }
    });
  }
});

// EL TOKEN SE PONE EN VERCEL, NO AQUÍ
client.login(process.env.DISCORD_TOKEN);
