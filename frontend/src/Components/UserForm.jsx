import React, { useState } from 'react'

//define a functional component called UserForm which accepts a prop {onSubmit}
const UserForm = ({ onSubmit }) => {
  //useState hook to manage the state of the {name} variable, initialized to an empty string
  const [name, setName] = useState('')

  //event handler for form submission
  const handleSubmit = (event) => {
    //prevent the default form submission behavior (which would cause a page reload)
    event.preventDefault()
    //call the onSubmit function passed in as a prop with an object containing the {name} state
    onSubmit({ name })
  }

  return (
    <>
      {/* display the title of the quiz */}
      <h2 className='firstScreen-title'>Welcome to the Bristol Quiz</h2>
      {/* display instructions for the quiz */}
      <h5 className='firstScreen-instructions'>
        Instructions:<br/>
        There are 30 general questions about Bristol, you must answer at least 15 questions correctly to pass the quiz.
      </h5>
      {/* form for entering the user's name */}
      <form onSubmit={handleSubmit}>
        {/* input field for the user to type their name */}
        <label>
          <input
            type="text" //input type is text
            placeholder='Add your player name here' //placeholder text for the input field
            value={name} //current value of the input field is bound to the 'name' state
            onChange={(e) => setName(e.target.value)} //update the {name} state whenever the input field changes
            className='userInput' //css class for styling
            required //make this field required
            autoFocus //automatically focus this field when the component loads
            maxLength={10} //limit the input to a maximum of 10 characters
          />
        </label>
        {/* submit button for the form */}
        <button type="submit" className='userButton fa-fade'>
          {/* FontAwesome icon inside the button */}
          <i className='fa-solid fa-play'></i> Start Quiz
        </button>
      </form>
    </>
  )
}

//export the UserForm component as the default export
export default UserForm