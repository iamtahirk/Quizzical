import { decode } from 'html-entities';

export default ({ question, answers, onSelect, selectedAnswer }) => {
    return (
        <div className='question-block'>
            {/* Render the decoded question */}
            <p className="question">{decode(question)}</p>
            
            {/* List of answers */}
            <ul className="answers">
                {answers.map((answer, index) => (
                    <li key={index} onClick={() => onSelect(answer)} className={selectedAnswer === answer ? 'selected' : ''}>
                        {decode(answer)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
