const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase().includes('stephen merchant')) {
    const imageUrl = await fetchStephenMerchantImage();
    if (imageUrl) {
      message.channel.send(imageUrl);
    } else {
      message.channel.send('No se pudo encontrar una imagen de Stephen Merchant.');
    }
  }
});

async function fetchStephenMerchantImage() {
  try {
    const { data } = await axios.get('https://www.google.com/search?q=Stephen+Merchant&tbm=isch', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const imageUrl = $('img').first().attr('src');
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

client.login(DISCORD_TOKEN);
