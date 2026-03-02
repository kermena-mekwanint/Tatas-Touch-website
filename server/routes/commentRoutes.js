const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); 

// GET all comments
router.get('/', async (req, res) => {
    try {
        // Updated for Sequelize: findAll and 'order' instead of sort
        const comments = await Comment.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new comment
router.post('/add', async (req, res) => {
    try {
        // Updated for Sequelize: Use .create() to build and save in one step
        const newComment = await Comment.create({
            name: req.body.name,
            text: req.body.text
        });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;