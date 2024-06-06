import React, { useState, useEffect } from 'react'
import Question from './Question'
import UserForm from './UserForm'
import { shuffleArray } from './RandomOptions'

const Quiz = () => {
  //store user's information
  const [user, setUser] = useState(null)
  //store questions
  const [questions, setQuestions] = useState([]) 
  //track the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  //store the user's score 
  const [score, setScore] = useState(0) 
  //score should be shown?
  const [showScore, setShowScore] = useState(false)
  //quiz start time 
  const [startTime, setStartTime] = useState(null) 
  //quiz elapsed time
  const [elapsedTime, setElapsedTime] = useState(0)
  //top users
  const [topUsers, setTopUsers] = useState([])

  //fetch questions, options, and answers from the backend when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionResponse = await fetch('https://bristolquiz.onrender.com/questions')
        const questionData = await questionResponse.json()

        const optionsResponse = await fetch('https://bristolquiz.onrender.com/options')
        const optionsData = await optionsResponse.json()

        const answersResponse = await fetch('https://bristolquiz.onrender.com/answers')
        const answersData = await answersResponse.json()
        
        //combine questions with their options and answers
        const combinedQuestions = questionData.map((question, index) => ({
          ...question,
          options: shuffleArray(optionsData[index].options),
          answer: answersData[index].answer,
        }))

        //shuffle and select 30 questions for the quiz
        const shuffledQuestions = combinedQuestions.sort(() => 0.5 - Math.random()).slice(0, 30)
        setQuestions(shuffledQuestions)
      } catch (error) {
        console.error('Error fetching quiz data', error)
      }
    }
    fetchQuestions()
  }, [])

  //start the timer when player push start button
  useEffect(() => {
    let timer
    if (startTime && !showScore) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, showScore])

  //handle answer option click
  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1)
    }

    //index of the next question being calculated
    const nextQuestion = currentQuestionIndex + 1
    
    //check if there are questions left to be answered
    if (nextQuestion < questions.length) {
      
      //if there are remaining questions, get the next question by updating the current question index
      setCurrentQuestionIndex(nextQuestion)
    } else {      
      //otherwise, show the score summary
      setShowScore(true)

      //calculate in seconds the time taken by the user to complete the quiz
      const finalTime = Math.floor((Date.now() - startTime) / 1000)
      
      //update elapsed time state + calculated final time
      setElapsedTime(finalTime)
      
      //save user's results [name,score,time] so it can be sent to the backend
      saveResults(user.name, score, finalTime)
    }
  }

  //save quiz results to the backend
  const saveResults = async (name, finalScore, timeSpent) => {
    try {
      const response = await fetch('https://bristolquiz.onrender.com/updateResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score: finalScore, timeSpent }),
      })
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      }
      fetchTopUsers()
    } catch (error) {
      console.error('Error saving results', error)
    }
  }

  //fetch top users from the backend
  const fetchTopUsers = async () => {
    try {
      const response = await fetch('https://bristolquiz.onrender.com/topUsers')
      const data = await response.json()
      setTopUsers(data)
    } catch (error) {
      console.error('Error fetching top users:', error)
    }
  }

  //handle user submission
  const handleUserSubmit = (userData) => {
    setUser(userData)
    setStartTime(Date.now())
  }

  //format time in minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  //handle quiz restart
  const handleRestartQuiz = () => {
    window.location.reload();
    setUser(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setStartTime(null);
    setElapsedTime(0);
  }

  return (
    <div className="quiz-container">
      {!user ? (
        //show user form if no user is set
        <UserForm onSubmit={handleUserSubmit} />
      ) : showScore ? (
        //show score if the quiz is completed
        <div className="score-section">
          {score >= 15 ? <span className="passed">Well done!</span> : <span className="failed">Oh, no!</span>}
          <span className='quizOutcome'>You scored {score >= 15 ? <span className='passed-score'>{score}</span> : <span className='failed-score'>{score}</span>} out of {questions.length} questions in {formatTime(elapsedTime)}.</span>
          {score >=15 ? <button className='restartButton' onClick={handleRestartQuiz}>Improve your time, try the quiz again <i className='fa-solid fa-arrow-rotate-right fa-beat-fade'></i></button> : <button className='restartButton fa-beat' onClick={handleRestartQuiz}><i class="fa-solid fa-rotate-left fa-spin fa-spin-reverse"></i> Click here to try again</button>}
          <br />
          <h3 className='rankingTitle'>Top 5 Players</h3>
          <ul className='rankingPlayers'>
            {topUsers.map((user, index) => (
                <li className='player' key={index}>
                  <span className="playerPosition"><i class="fa-solid fa-trophy"></i> #{index + 1}</span>
                  <span className="playerName"><i class="fa-solid fa-user"></i> {user.name}</span>
                  <span className="playerPoints"><i class="fa-solid fa-table-tennis-paddle-ball"></i> {user.score * 10 + 10} pts</span>
                  <span className="playerTime"><i class="fa-solid fa-stopwatch"></i> {formatTime(user.time_spent)}</span>
                  <span className="playerDate"><i class="fa-solid fa-calendar-days"></i> {new Date(user.created_at).toLocaleString().slice(0, 10)}</span>
                </li>
              ))}          
          </ul>
        </div>
      ) : (
        //mount questions to be answered
        <>
          {questions.length > 0 && (
            <>
              <Question
                question={questions[currentQuestionIndex]}
                handleAnswerOptionClick={handleAnswerOptionClick}
                elapsedTime={elapsedTime}
                formatTime={formatTime}
                remainingQuestions={questions.length - currentQuestionIndex - 0}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Quiz