import { createPoll } from './lib/discord.js';
import polls from './data/polls.json' with { type: 'json' };

// Charger les variables d'environnement depuis .env.local
import { readFileSync } from 'fs';

try {
  const envFile = readFileSync('.env.local', 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    if (key && value && !key.startsWith('#')) {
      process.env[key.trim()] = value;
    }
  });
} catch (e) {
  console.error('Erreur: créer .env.local avec DISCORD_TOKEN et CHANNEL_ID');
  process.exit(1);
}

async function test() {
  const channelId = process.env.CHANNEL_ID;
  const token = process.env.DISCORD_TOKEN;

  if (!channelId || !token) {
    console.error('Configurer DISCORD_TOKEN et CHANNEL_ID dans .env.local');
    process.exit(1);
  }

  console.log('Envoi du sondage...');

  const poll = polls[0];
  const result = await createPoll(channelId, poll);

  console.log('Sondage créé !');
  console.log('Message ID:', result.id);
}

test().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
