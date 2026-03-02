const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); 

// GET all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ date: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new comment
router.post('/add', async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        text: req.body.text
    });
    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;