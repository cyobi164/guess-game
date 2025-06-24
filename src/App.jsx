import React, { useState } from "react";
import Question from "./components/Question/Index";
import Score from "./components/Score/Index";

// Grouped categories
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
};

// Difficulty levels
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

  return (
  <div className="app">
    {showTryAgain ? (
      <div className="try-again-screen">
        <h2>Incorrect Answer 😢</h2>
        <button onClick={handleTryAgain}>Return to Menu</button>
        {categoryId && difficulty && (
          <button onClick={() => {
            setShowTryAgain(false);
            setShowQuiz(true);
          }}>
            Try Again
          </button>
        )}
      </div>
    ) : !showQuiz ? (
      <div className="welcome-screen">
        <h1>Quiz Game</h1>
        {!categoryId ? (
          <>
            <p>Select a Category</p>
            <div className="category-grid">
              {Object.entries(categoriesGroup).map(([groupName, groupItems]) => (
                <div key={groupName}>
                  <h3>{groupName}</h3>
                  {groupItems.map((cat) => (
                    <button key={cat.id} onClick={() => setCategoryId(cat.id)}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : !difficulty ? (
          <>
            <p>Select Difficulty</p>
            <div className="difficulty-grid">
              {difficulties.map((level) => (
                <button key={level} onClick={() => handleDifficultySelect(level)}>
                  {level}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    ) : (
      <>
        <Question
          onAnswer={(isCorrect) => {
            handleAnswer(isCorrect);
          }}
          categoryId={categoryId}
          difficulty={difficulty}
          score={score}
        />
      </>
    )}
  </div>
);
};

export default App;
