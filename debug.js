import { REST, Routes } from 'discord.js';
import { readFileSync } from 'fs';

// Charger .env.local
const envFile = readFileSync('.env.local', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=').trim();
  if (key && value && !key.startsWith('#')) {
    process.env[key.trim()] = value;
  }
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function debug() {
  console.log('=== DEBUG ===\n');

  // 1. Vérifier le bot
  console.log('1. Vérification du bot...');
  try {
    const bot = await rest.get(Routes.user());
    console.log(`   ✓ Bot connecté: ${bot.username}#${bot.discriminator}`);
    console.log(`   Application ID: ${bot.id}\n`);
  } catch (e) {
    console.log(`   ✗ Token invalide: ${e.message}\n`);
    return;
  }

  // 2. Lister les serveurs
  console.log('2. Serveurs du bot...');
  try {
    const guilds = await rest.get(Routes.userGuilds());
    if (guilds.length === 0) {
      console.log('   ✗ Le bot n\'est dans AUCUN serveur!');
      console.log('   → Invitez le bot avec le lien OAuth2\n');
    } else {
      console.log(`   ✓ ${guilds.length} serveur(s):`);
      guilds.forEach(g => console.log(`     - ${g.name} (${g.id})`));
      console.log();
    }
  } catch (e) {
    console.log(`   ✗ Erreur: ${e.message}\n`);
  }

  // 3. Vérifier le canal
  const channelId = process.env.CHANNEL_ID;
  console.log(`3. Vérification du canal ${channelId}...`);
  try {
    const channel = await rest.get(Routes.channel(channelId));
    console.log(`   ✓ Canal trouvé: #${channel.name}`);
    console.log(`   Type: ${channel.type}`);
    console.log(`   Guild ID: ${channel.guild_id}\n`);
  } catch (e) {
    console.log(`   ✗ Canal inaccessible: ${e.message}`);
    console.log('   → Vérifiez que le bot est dans ce serveur\n');
  }
}

debug();
