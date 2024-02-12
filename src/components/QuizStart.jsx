import { useState, useEffect } from "react";

export default ({handleStartQuiz}) => {
    // State to manage dropdown values
    const [dropdownValues, setDropdownValues] = useState({ numberOfQuestions: 5, category: 'any', difficulty: 'any'});
    
    // Function to generate the API URL based on dropdown values
    const generateAPIUrl = () => {
        const { numberOfQuestions, category, difficulty } = dropdownValues;
        let apiUrl = `https://opentdb.com/api.php?amount=${numberOfQuestions}&type=multiple`;
    
        // Append category parameter if selected
        if (category !== 'any') {
          apiUrl += `&category=${category}`;
        }
        // Append difficulty parameter if selected
        if (difficulty !== 'any') {
          apiUrl += `&difficulty=${difficulty}`;
        }
    
        return apiUrl;
    };
    
    // Handler for dropdown change event
    const handleDropdownChange = (event) => {
        const { name, value } = event.target;
        setDropdownValues({
        ...dropdownValues,
        [name]: value
        });
    };
    
    return (
        <>
            <h1 className='title'>Quizzical</h1>

            <div className="dropdowns">
                {/* Dropdown for selecting the number of questions */}
                <label>
                    Questions:<br/>
                    <select name="numberOfQuestions" value={dropdownValues.numberOfQuestions} onChange={handleDropdownChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    </select>
                </label>

                {/* Dropdown for selecting the category */}
                <label>
                    Category:<br/>
                    <select name="category" value={dropdownValues.category} onChange={handleDropdownChange}>
                    <option value="any">Any Category</option>
                    <option value={9}>General Knowledge</option>
                    <option value={10}>Entertainment: Books</option>
                    <option value={11}>Entertainment: Film</option>
                    <option value={12}>Entertainment: Music</option>
                    <option value={13}>Entertainment: Musicals &amp; Theatres</option>
                    <option value={14}>Entertainment: Television</option>
                    <option value={15}>Entertainment: Video Games</option>
                    <option value={16}>Entertainment: Board Games</option>
                    <option value={17}>Science &amp; Nature</option>
                    <option value={18}>Science: Computers</option>
                    <option value={19}>Science: Mathematics</option>
                    <option value={20}>Mythology</option>
                    <option value={21}>Sports</option>
                    <option value={22}>Geography</option>
                    <option value={23}>History</option>
                    <option value={24}>Politics</option>
                    <option value={25}>Art</option>
                    <option value={26}>Celebrities</option>
                    <option value={27}>Animals</option>
                    <option value={28}>Vehicles</option>
                    <option value={29}>Entertainment: Comics</option>
                    <option value={30}>Science: Gadgets</option>
                    <option value={31}>Entertainment: Japanese Anime &amp; Manga</option>
                    <option value={32}>Entertainment: Cartoon &amp; Animations</option>
                    </select>
                </label>

                {/* Dropdown for selecting the difficulty */}
                <label>
                    Difficulty:<br/>
                    <select name="difficulty" value={dropdownValues.difficulty} onChange={handleDropdownChange}>
                    <option value="any">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    </select>
                </label>
            </div>

            <p className='description'>Ready to test your knowledge? Click below to start the quiz!</p>

            {/* Button to start the quiz */}
            <button className='btn-main' onClick={() => { handleStartQuiz(generateAPIUrl()); }}>Start Quiz</button>
        </>
    )
}