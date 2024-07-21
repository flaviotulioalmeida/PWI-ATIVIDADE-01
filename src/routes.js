const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { checkExistsUserAccount, users } = require('./middleware');

const router = express.Router();

// POST /users
router.post('/users', (req, res) => {
    const { name, username } = req.body;

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const user = {
        id: uuidv4(),
        name,
        username,
        technologies: []
    };

    users.push(user);
    return res.status(201).json(user);
});

// GET /technologies
router.get('/technologies', checkExistsUserAccount, (req, res) => {
    const { user } = req;
    return res.json(user.technologies);
});

// POST /technologies
router.post('/technologies', checkExistsUserAccount, (req, res) => {
    const { title, deadline } = req.body;
    const { user } = req;

    const technology = {
        id: uuidv4(),
        title,
        studied: false,
        deadline: new Date(deadline),
        created_at: new Date()
    };

    user.technologies.push(technology);
    return res.status(201).json(technology);
});

// PUT /technologies/:id
router.put('/technologies/:id', checkExistsUserAccount, (req, res) => {
    const { id } = req.params;
    const { title, deadline } = req.body;
    const { user } = req;

    const technology = user.technologies.find(tech => tech.id === id);

    if (!technology) {
        return res.status(404).json({ error: 'Technology not found' });
    }

    technology.title = title;
    technology.deadline = new Date(deadline);

    return res.json(technology);
});

// PATCH /technologies/:id/studied
router.patch('/technologies/:id/studied', checkExistsUserAccount, (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const technology = user.technologies.find(tech => tech.id === id);

    if (!technology) {
        return res.status(404).json({ error: 'Technology not found' });
    }

    technology.studied = true;
    return res.json(technology);
});

// DELETE /technologies/:id
router.delete('/technologies/:id', checkExistsUserAccount, (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const technologyIndex = user.technologies.findIndex(tech => tech.id === id);

    if (technologyIndex === -1) {
        return res.status(404).json({ error: 'Technology not found' });
    }

    user.technologies.splice(technologyIndex, 1);
    return res.status(200).json(user.technologies);
});

module.exports = router;
