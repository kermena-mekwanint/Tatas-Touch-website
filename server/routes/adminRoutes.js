const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// 1. LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Updated for Sequelize: findOne({ where: { ... } })
        const admin = await Admin.findOne({ where: { username } });
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                res.json({ success: true });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 2. UPDATE SECURITY ROUTE (From Admin Dashboard)
router.post('/update-security', async (req, res) => {
    const { currentPassword, newPassword, securityQuestion, securityAnswer } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username: 'admin' } });
        if (!admin) return res.status(404).json({ message: "Admin account not found" });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Updated for Sequelize property assignment
        admin.password = hashedPassword;
        admin.securityQuestion = securityQuestion;
        admin.securityAnswer = securityAnswer;
        
        await admin.save();
        res.json({ message: "Security updated successfully! ✨" });
    } catch (err) {
        res.status(500).json({ message: "Server error updating security" });
    }
});

// 3. GET SECURITY QUESTION (For Forgot Password Page)
router.get('/get-question/:username', async (req, res) => {
    try {
        const admin = await Admin.findOne({ where: { username: req.params.username } });
        if (!admin) return res.status(404).json({ message: "User not found" });
        
        res.json({ question: admin.securityQuestion || "No security question set." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 4. FORGOT PASSWORD RESET ROUTE
router.post('/forgot-password', async (req, res) => {
    const { username, securityAnswer, newPassword } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) return res.status(404).json({ message: "User not found" });

        // Check answer safely
        if (!admin.securityAnswer || admin.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()) {
            return res.status(401).json({ message: "Incorrect security answer" });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;