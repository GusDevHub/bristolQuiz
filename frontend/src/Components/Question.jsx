import React from 'react'

//handle quiz restart
const handleRestartQuiz = () => {
  window.location.reload() //reload the page to restart quiz
}

const Question = ({ question, handleAnswerOptionClick, elapsedTime, formatTime, remainingQuestions }) => {
  return (
    <div className="question-section">
      <div className="timer lato-bold">
        <i className="fa-solid fa-stopwatch"></i>
         {formatTime(elapsedTime)}
         <button className='question-restart-button' onClick={handleRestartQuiz}>Restart Quiz</button>
      </div>
      <div className="question-text">{question.question}</div>
      <div className="options-section">
        {question.options.map((option, index) => (
          <button key={index} onClick={() => handleAnswerOptionClick(option === question.answer)}>
            {option}
          </button>
        ))}
      </div>
      <div className="remaining-questions">Questions remaining: <span>{remainingQuestions}</span></div>
    </div>
  )
}

export default Question