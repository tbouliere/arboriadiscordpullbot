import { createPoll } from '../../lib/discord.js';
import polls from '../../data/polls.json' with { type: 'json' };

export default async function handler(req, res) {
  // Verify Vercel Cron authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const channelId = process.env.CHANNEL_ID;

    if (!channelId) {
      return res.status(500).json({ error: 'CHANNEL_ID not configured' });
    }

    if (!process.env.DISCORD_TOKEN) {
      return res.status(500).json({ error: 'DISCORD_TOKEN not configured' });
    }

    const poll = polls[0];

    const result = await createPoll(channelId, poll);

    return res.status(200).json({
      success: true,
      message: 'Poll created successfully',
      pollQuestion: poll.question,
      messageId: result.id
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return res.status(500).json({
      error: 'Failed to create poll',
      details: error.message
    });
  }
}

