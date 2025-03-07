// backend/routes/groupRoutes/groupRoutes.js
const express = require('express');
const router = express.Router();
const Team = require('../../models/Teams');
const Message = require('../../models/Message');
const { authenticate } = require('../../controllers/authControllers');

// Get messages for a team
router.get('/messages/:teamId', authenticate, async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const messages = await Message.find({ group: teamId }).populate('sender', 'email username');
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send message to a team chat
router.post('/message/:teamId', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    // Use req.user from your authenticate middleware
    const sender = { email: req.user.email, username: req.user.username };

    const message = new Message({
      group: teamId,
      sender,
      content,
    });

    await message.save();
    res.json(message);
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;