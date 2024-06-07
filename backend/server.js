const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config()

const SUPABASE_URL = 'https://rienflvxhudzqzeobhqo.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const quiz = express()
quiz.use(cors())
quiz.use(express.urlencoded({ extended: false }))
quiz.use(express.json())
const PORT = process.env.PORT || 3002

// Fetch all questions from the database
async function getQuestions() {
    let { data, error } = await supabase
        .from('questions')
        .select('question_id, question')
        .order('question_id', { ascending: true })

    if (error) throw error
    return data
}

// Fetch all options from the database
async function getOptions() {
    let { data, error } = await supabase
        .from('questions')
        .select('question_id, options')
        .order('question_id', { ascending: true })

    if (error) throw error
    return data
}

// Fetch all answers from the database
async function getAnswers() {
    let { data, error } = await supabase
        .from('questions')
        .select('question_id, answer')
        .order('question_id', { ascending: true })

    if (error) throw error
    return data
}

// Add a new user to the database if they pass the quiz
async function addUser(name, score, timeSpent) {
    let { data, error } = await supabase
        .from('users')
        .insert([{ name, score, time_spent: timeSpent }])
        .single()

    if (error) throw error
    return data
}

// Fetch the top 5 users from the database based on score and time spent
async function getTopUsers() {
    let { data, error } = await supabase
        .from('users')
        .select('name, score, time_spent, created_at')
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .order('time_spent', { ascending: true })
        .limit(5)

    if (error) throw error
    return data
}

// Basic endpoint route to check if the server is running
quiz.get('/', async (req, res) => {
    res.status(200).send('<h2>Hello Server!</h2>')
})

// Endpoint route to get all questions
quiz.get('/questions', async (req, res) => {
    try {
        const questions = await getQuestions()
        res.status(200).json(questions)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching questions' })
    }
})

// Endpoint route to get all options
quiz.get('/options', async (req, res) => {
    try {
        const options = await getOptions()
        res.status(200).json(options)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching options' })
    }
})

// Endpoint route to get all answers
quiz.get('/answers', async (req, res) => {
    try {
        const answers = await getAnswers()
        res.status(200).json(answers)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching answers' })
    }
})

// Endpoint route to update user results and save user if they pass the quiz
quiz.post('/updateResults', async (req, res) => {
    const { name, score, timeSpent } = req.body
    try {
        if (score >= 15) {  // Consider 15 as the passing score
            const newUser = await addUser(name, score, timeSpent)
            res.status(200).json({ success: true, user: newUser })
        } else {
            res.status(200).json({ success: true, user: null })
        }
    } catch (error) {
        console.error('Error saving results:', error)
        res.status(500).json({ success: false, error: 'Error saving results' })
    }
})

// Endpoint route to get the top 5 users
quiz.get('/topUsers', async (req, res) => {
    try {
        const topUsers = await getTopUsers()
        res.status(200).json(topUsers)
    } catch (error) {
        res.status 500.json({ error: 'Error fetching top users' })
    }
})

// Start the server
quiz.listen(PORT, async () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})
