import { useEffect } from "react";

export default ({ questions, selectedAnswers, onPlayAgain, startConfetti }) => {

    // Function to decode HTML entities
    const decodeHTML = html => {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // Calculate the number of correct answers
    const numCorrectAnswers = questions.reduce((acc, question, index) => {
        // Decode both the user-selected answer and the correct answer for comparison
        const decodedSelectedAnswer = decodeHTML(selectedAnswers[index]);
        const decodedCorrectAnswer = decodeHTML(question.correct_answer);

        // Check if the decoded selected answer matches the decoded correct answer
        if (decodedSelectedAnswer === decodedCorrectAnswer) {
            return acc + 1;
        }
        return acc;
    }, 0);



    // Start confetti if all answers are correct
    useEffect(() => {
        if (numCorrectAnswers === questions.length) {
            startConfetti();
        }
    }, [numCorrectAnswers]);

    // Reset confettiRun state and start over
    const handlePlayAgain = () => {
        onPlayAgain();
        return numCorrectAnswers;
    };

    return (
        <div>
            <h2 className="results">Results</h2>

            {/* Display each question with user-selected and correct answers */}
            {questions.map((question, index) => (
                <div key={index}>
                    <p className="question">{decodeHTML(question.question)}</p>
                    <ul>
                        {question.answers.map((answer, idx) => {
                            const decodedAnswer = decodeHTML(answer);
                            const decodedSelectedAnswer = decodeHTML(selectedAnswers[index]);
                            const decodedCorrectAnswer = decodeHTML(question.correct_answer);
                            const isUserSelected = decodedSelectedAnswer === decodedAnswer;
                            const isCorrectAnswer = decodedCorrectAnswer === decodedAnswer;
                            // Determine the class for styling based on correctness of user's answer
                            const className = isUserSelected ? (isCorrectAnswer ? 'selected' : 'wrong') : (isCorrectAnswer ? 'selected' : '');
                            return (
                                <li key={idx} className={className}>
                                    {decodedAnswer}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}

            {/* Button to play the quiz again */}
            <button onClick={handlePlayAgain} className="btn-secondary">Play Again</button>
            {/* Display the number of correct answers out of total questions */}
            <p className="question">You scored {numCorrectAnswers}/{questions.length} correct answers.</p>
        </div>
    );
};