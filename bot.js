const { Client, GatewayIntentBits, Intents, Channel } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENTS]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log('bot está listo y en línea, which means it online now shut up.');
  // calls that so image be sent in 5 minutes 
  sendRandomImagePeriodically();
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase().includes('<@1262548989954232403>')) {
    const imageUrl = getRandomImage();
    if (imageUrl) {
      message.channel.send({ files: [imageUrl] });
    } else {
      message.channel.send('no smerch?');
    }
  }
});

// Function to send image every 5 mins
async function sendRandomImagePeriodically() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) {
    console.error(`channel with ID ${CHANNEL_ID} not found.`);
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
  }, 5 * 60 * 1000); // 5 mins in milliseconds cuz thats 5 minutes in milliseconds that are 5 minutes in milliseconds, get it?
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
