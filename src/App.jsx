import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { decode } from 'html-entities';
import axios from 'axios';
import blobTop from './assets/blob-top-right.png';
import blobBottom from './assets/blob-bottom-left.png';
import QuizStart from './components/QuizStart';
import Question from './components/Question';
import Results from './components/Results';
import './App.css';


// Function to shuffle the array
const shuffleArray = array => {
  let length = array.length;
  let shuffle = array.slice(); // copy of array
  // loop over the array
  for (let i = length - 1; i > 0; i -= 1) {
    let random = Math.floor(Math.random() * (i + 1)); // random Quiz position
    let current = shuffle[i]; // current Quiz
    // swap the random Quiz and the current Quiz
    shuffle[i] = shuffle[random]; // move the random Quiz to the current position
    shuffle[random] = current; // put the current Quiz in the random position
  }
  return shuffle; // return shuffled array
};

export default () => {
  // State variables
  const [menuScreen, setMenuScreen] = useState(true);
  const [customURL, setCustomURL] = useState('');
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [confettiRun, setConfettiRun] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });
  const [hasFetchedQuestions, setHasFetchedQuestions] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // useEffects

  // Adjust confetti upon window resize
  useEffect(() => {
    window.onresize = () => handleWindowSize();
  }, [confettiRun]);

  // Shuffle Answers
  useEffect(() => {
    if (customURL) {
      async function getQuestions() {
        try {
          const response = await axios.get(customURL);

          if (response.data.response_code === 5 || response.data.response_code === 1) {
            setShowButton(true);
          }
          // Shuffle the answers for each question
          const shuffledQuestions = response.data.results.map(question => ({
            ...question,
            answers: shuffleArray([...question.incorrect_answers, question.correct_answer].map(answer => decode(answer)))
          }));
          setAllQuestions(shuffledQuestions);
          
        } catch (error) {
          console.error('Error fetching questions:', error);
          setShowButton(true);
        }
      }
      setTimeout(() => {
        getQuestions();
      }, 1200);
    }
  }, [customURL, menuScreen]);

  // Show correct answers in console (Cheat 😁)
  useEffect(() => {
    if (allQuestions.length > 0 && !hasFetchedQuestions) {

      // Log correct answers once questions are fetched
      const allAnswersList = allQuestions.map(question => question.correct_answer);
      console.log('Correct Answers: ', allAnswersList.map(answer => decode(answer)));
      setHasFetchedQuestions(true);
    }
  }, [allQuestions, hasFetchedQuestions]);

  // Functions
  const handleWindowSize = () => {
    // Update window size state when resized
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  const handleStartQuiz = (url) => {
    // Start the quiz with the provided URL
    setCustomURL(url);
    setMenuScreen(false);
    console.log('URL: ', url);
  };

  const handleCheckAnswers = () => {
    // Show results when answers are checked
    setShowResults(true);
  };

  const handleSelectAnswer = (index, selectedAnswer) => {
    // Select an answer for a specific question
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = selectedAnswer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handlePlayAgain = () => {
    // Reset all quiz-related state to play again
    setShowButton(false);
    setCustomURL('');
    setSelectedAnswers([]);
    setAllQuestions([]);
    setHasFetchedQuestions(false);
    setConfettiRun(false);
    setMenuScreen(true);
    setShowResults(false);
  };

  const startConfetti = () => {
    // Start the confetti animation
    setConfettiRun(true);
  };

  // Check if all answers are selected to avoid Button Click
  const allQuestionsAnswered = selectedAnswers.length === allQuestions.length;

  
  return (
    <>
      {/* Render Confetti component if confettiRun is true */}
      {confettiRun && <Confetti numberOfPieces={350} width={windowSize.width} height={windowSize.height} />}
      <main>
        {/* Conditional rendering based on menuScreen and showResults */}
        {menuScreen ? (
          // Render QuizStart component with handleStartQuiz prop
          <QuizStart handleStartQuiz={handleStartQuiz} />
        ) : showResults ? (
          // Render Results component with appropriate props
          <Results questions={allQuestions} selectedAnswers={selectedAnswers} onPlayAgain={handlePlayAgain} startConfetti={startConfetti} />
        ) : (

          // Render questions and answer options using map function
          <>
          {allQuestions.map((question, index) => (
            <Question
              key={index} {...question} // Destructuring question object
              onSelect={(selectedAnswer) => handleSelectAnswer(index, selectedAnswer)}
              selectedAnswer={selectedAnswers[index]}
            />
          ))}
            {allQuestions.length > 0 ? 
              <div className='answer-buttons'>
                <button className='btn-secondary' disabled={!allQuestions.length || !allQuestions.every((question, index) => selectedAnswers[index])} onClick={handleCheckAnswers}
                title={allQuestionsAnswered ? "" : "Please select an answer for each question!!"}>Check Answers</button>

                <button onClick={handlePlayAgain} className="btn-secondary">Restart</button>
              </div> : (
                <div className='loadingscreen'>
                  <div className="spinner"></div>
                  
                  {showButton && (
                    <>
                      <p>Quiz retrieval failed. Please click below to restart.</p>
                      <button onClick={handlePlayAgain} className="btn-secondary">Restart</button>
                    </>
                  )}
                </div>
              )
              }
            
          </>
        )}
      </main>

      {/* Render top and bottom blob images */}
      <img src={blobTop} width={230} alt="Blob" className="blob top-right" />
      <img src={blobBottom} width={170} alt="Blob" className="blob bottom-left" />
    </>
  );
}