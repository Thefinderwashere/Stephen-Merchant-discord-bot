const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
let defaultChannelId = null;

client.once('ready', () => {
  console.log('El bot está listo y en línea.');
  // No se enviará imagen cada 5 minutos hasta que se configure el canal predeterminado
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase().includes('<@1262548989954232403> configure def')) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && 
        !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply('Only roles with admin or manage server can use this');
    }
    defaultChannelId = message.channel.id;
    message.reply('This is now the default channel');
    // Iniciar el envío de imágenes cada 5 minutos después de configurar el canal predeterminado
    sendRandomImagePeriodically();
  }

  if (message.content.toLowerCase().includes('<@1262548989954232403>')) {
    const imageUrl = getRandomImage();
    if (imageUrl) {
      message.channel.send({ files: [imageUrl] });
    } else {
      message.channel.send('No se pudo encontrar una imagen aleatoria en la carpeta.');
    }
  }
});

// Función para enviar imagen aleatoria cada 5 minutos
async function sendRandomImagePeriodically() {
  if (!defaultChannelId) {
    console.log('Canal predeterminado no configurado, no se enviarán imágenes periódicas.');
    return;
  }

  const channel = await client.channels.fetch(defaultChannelId);
  if (!channel) {
    console.error(`No se pudo encontrar el canal con ID ${defaultChannelId}.`);
    return;
  }

  setInterval(() => {
    const imageUrl = getRandomImage();
    if (imageUrl) {
      channel.send({ files: [imageUrl] })
        .then(() => console.log('Imagen enviada con éxito.'))
        .catch(error => console.error('Error al enviar imagen:', error));
    } else {
      console.log('No se pudo encontrar una imagen aleatoria en la carpeta.');
    }
  }, 5 * 60 * 1000); // 5 minutos en milisegundos
}

function getRandomImage() {
  const imagesDir = path.join(__dirname, 'images');
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

  if (imageFiles.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return path.join(imagesDir, imageFiles[randomIndex]);
}

client.login(DISCORD_TOKEN);
