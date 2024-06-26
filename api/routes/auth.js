const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    const { firstname, lastname, username, email, age, password, educationLevel, gender } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!firstname || !lastname || !username || !email || !age || !password || !educationLevel || !gender) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios' });
    }

    try {
        // Verificar se o email já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'O email já está em uso' });
        }

        // Verificar se o nome de usuário já existe
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'O nome de usuário já está em uso' });
        }

        // Criar novo usuário
        user = new User({ firstname, lastname, username, email, age, password, educationLevel, gender });

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Login de usuário
// Login de usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router;



