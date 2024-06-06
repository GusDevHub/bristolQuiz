import React, { useState } from 'react'
import { questions } from './questions'
import './Quiz.css'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState('')
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const handleOptionChange = (e) => {
    setSelected(e.target.value)
  }

  const handleSubmit = () => {
    const newScore = calculateScore()
    setScore(newScore)
    setFinished(true)
  }

  const calculateScore = () => {
    let newScore = score
    if (selected === questions[currentQuestion].answer) {
      newScore++
    }
    return newScore
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelected('')
    } else {
      handleSubmit()
    }
  }

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex)
    setSelected('')
  }

  return (
    <div className="quiz-container">
      {!finished ? (
        <div className="question-container">
          <h2>Bristol Quiz {score}</h2>
          <h3>{questions[currentQuestion].question}</h3>
          {/* {questions[currentQuestion].imageUrl && (
            <img src={questions[currentQuestion].imageUrl} alt="Question" className="question-image" />
          )} */}
          <div className="options-container">
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="option">
                <input
                  type="radio"
                  id={`${currentQuestion}-${index}`}
                  value={option}
                  checked={selected === option}
                  onChange={handleOptionChange}
                />
                <label htmlFor={`${currentQuestion}-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <button className="next-button" onClick={nextQuestion}>Submit</button>
          <div className="breadcrumb">
            <p>You are answering the question:</p>
            {questions.map((_, index) => (
              <button
                key={index}
                className={`breadcrumb-button ${index === currentQuestion ? 'active' : (index < currentQuestion ? 'answered' : 'unanswered')}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-container">
          {score >= 4 ? (
            <div>
              <h2>Congratulations! You passed!</h2>
            </div>
          ) : (
            <div>
              <h2>Sorry! You failed!</h2>
            </div>
          )}
          <p>Your score: {score}/5</p>
        </div>
      )}
    </div>
  )
}

export default Quiz