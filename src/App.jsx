import React, { useState } from "react";
import Question from "./components/Question/Index";
import Score from "./components/Score/Index";

const App = () => {
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  const randomCategory = () => {
    const categories = [9, 10, 11, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const categoriesId = randomCategory();
  
  const getdifficulty = () => {
    if (score >= 10) return "hard";
    if (score >= 5) return "medium";
    return "easy";
  };

  const handleStart = () => {
    setShowQuiz(true);
    setScore(0);
    setShowDescription(true); // reset description every time game starts
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setShowQuiz(false);
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    setShowTryAgain(false);
    setScore(0);
    setShowQuiz(false); // back to menu
  };

  return (
    <div className="app">
      {/*try again screen */}
      {showTryAgain ? (
        <div className="try-again-screen">
          <h2>Incorrect Answer 😢</h2>
          <button onClick={handleTryAgain}>Return To Menu</button>
          <button onClick={() => {
            setShowQuiz(true);
            setShowTryAgain(false);
            setShowDescription(true);
          }}
          >Try Again</button>
        </div>
      ) : !showQuiz ? (
        <div className="welcome-screen">
          <h1>Quiz Game</h1>
          <button onClick={handleStart}>Play</button>
        </div>
      ) : (
        <>
          {/*for description */}
          {showDescription && (
            <div className="description">
              <p>
                Welcome to the Game. It is just a prototype game but you can enjoy it.
                <br />
                Thank you for playing, hope you enjoy!!
              </p>
            </div>
          )}
          {/*question component */}
          <Question
            onAnswer={handleAnswer}
            onloaded={() => setShowDescription(false)}
            categoryId={categoriesId}
            difficulty={getdifficulty()}
            score={score}
          />
        </>
      )}
    </div>
  )
};

export default App;

/*Grouped categories
const categoriesGroup = {
  "Science & Math": [
    { id: 18, name: "Science: Computers" },
    { id: 19, name: "Math" },
  ],
  "General Knowledge": [
    { id: 9, name: "General Knowledge" },
  ],
  "History & Games": [
    { id: 23, name: "History" },
    { id: 25, name: "Games" },
  ],
};*/

/*Difficulty levels
const difficulties = ["easy", "medium", "hard"];

const App = () => {
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [showTryAgain, setShowTryAgain] = useState(false);

  // Select category
  const handleCategorySelect = (id) => {
    setCategoryId(id);
  };

  // Select difficulty
  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setShowQuiz(true);
    setScore(0);
  };

  // Handle answer
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      // Reset everything if answer is wrong
      setShowQuiz(false);
      setShowTryAgain(true);
      setScore(0);
    }
  };

  //handle try again
  const handleTryAgain = () => {
    setCategoryId(null);
    setDifficulty(null);
    setScore(0);
    setShowTryAgain(false);
  }
*/