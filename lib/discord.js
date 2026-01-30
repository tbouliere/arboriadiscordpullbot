import { REST, Routes } from 'discord.js';

let rest = null;

function getClient() {
  if (!rest) {
    rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  }
  return rest;
}

function getWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const options = { day: 'numeric', month: 'long' };
  return `semaine du ${monday.toLocaleDateString('fr-FR', options)}`;
}

/**
 * Create a poll in a Discord channel
 * @param {string} channelId - The channel ID to post the poll
 * @param {object} poll - Poll configuration
 */
export async function createPoll(channelId, poll) {
  const weekLabel = getWeekLabel();
  const question = poll.question.replace('{semaine}', weekLabel);

  const roleId = process.env.ROLE_ID;
  const mention = roleId ? `<@&${roleId}>\n\n` : '';

  const pollData = {
    content: mention + (poll.description || ''),
    poll: {
      question: {
        text: question
      },
      answers: poll.options.map(option => ({
        poll_media: {
          text: option
        }
      })),
      duration: poll.duration_hours,
      allow_multiselect: poll.allow_multiselect ?? false,
      layout_type: 1
    }
  };

  const response = await getClient().post(
    Routes.channelMessages(channelId),
    { body: pollData }
  );

  return response;
}
