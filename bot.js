const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log('El bot está listo y en línea.');
  // Llamar a la función para enviar imagen cada 5 minutos
  sendRandomImagePeriodically();
});

client.on('messageCreate', async (message) => {
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
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) {
    console.error(`No se pudo encontrar el canal con ID ${CHANNEL_ID}.`);
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
