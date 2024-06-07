const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();

require('dotenv').config(); // Ensure you have dotenv installed and a .env file in your project

const db = pgp(process.env.DATABASE_URL); // Use environment variable for the database URL

const quiz = express();
quiz.use(cors());
quiz.use(express.urlencoded({ extended: false }));
quiz.use(express.json());
const PORT = process.env.PORT || 3002;

// Fetch all questions from the database
async function getQuestions() {
    let response = await db.any('SELECT question_id, question FROM questions ORDER BY question_id ASC');
    return response;
}

// Fetch all options from the database
async function getOptions() {
    let response = await db.any('SELECT question_id, options FROM questions ORDER BY question_id ASC');
    return response;
}

// Fetch all answers from the database
async function getAnswers() {
    let response = await db.any('SELECT question_id, answer FROM questions ORDER BY question_id ASC');
    return response;
}

// Add a new user to the database if they pass the quiz
async function addUser(name, score, timeSpent) {
    let response = await db.one('INSERT INTO users (name, score, time_spent) VALUES ($1, $2, $3) RETURNING *', [name, score, timeSpent]);
    return response;
}

// Fetch the top 5 users from the database based on score and time spent
async function getTopUsers() {
    let response = await db.any(`
        SELECT name, score, time_spent, created_at
        FROM users 
        WHERE score IS NOT NULL 
        ORDER BY score DESC, time_spent ASC 
        LIMIT 5
    `);
    return response;
}

// Basic endpoint route to check if the server is running
quiz.get('/', async (req, res) => {
    res.status(200).send('<h2>Hello Server!</h2>');
});

// Endpoint route to get all questions
quiz.get('/questions', async (req, res) => {
    try {
        const questions = await getQuestions();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

// Endpoint route to get all options
quiz.get('/options', async (req, res) => {
    try {
        const options = await getOptions();
        res.status(200).json(options);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching options' });
    }
});

// Endpoint route to get all answers
quiz.get('/answers', async (req, res) => {
    try {
        const answers = await getAnswers();
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching answers' });
    }
});

// Endpoint route to update user results and save user if they pass the quiz
quiz.post('/updateResults', async (req, res) => {
    const { name, score, timeSpent } = req.body;
    try {
        if (score >= 15) {  // Consider 15 as the passing score
            const newUser = await addUser(name, score, timeSpent);
            res.status(200).json({ success: true, user: newUser });
        } else {
            res.status(200).json({ success: true, user: null });
        }
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).json({ success: false, error: 'Error saving results' });
    }
});

// Endpoint route to get the top 5 users
quiz.get('/topUsers', async (req, res) => {
    try {
        const topUsers = await getTopUsers();
        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching top users' });
    }
});

// Start the server
quiz.listen(PORT, async () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
