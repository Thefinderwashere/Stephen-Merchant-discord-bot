const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENTS
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
  const channel =
