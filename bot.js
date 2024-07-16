const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log('yo your bot is alive wake up WAKE UUUP');
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase().includes('stephen merchant')) {
    const imageUrl = getRandomImage();
    if (imageUrl) {
      message.channel.send({ files: [imageUrl] });
    } else {
      message.channel.send('No se pudo encontrar una imagen de Stephen Merchant.');
    }
  }
});

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
