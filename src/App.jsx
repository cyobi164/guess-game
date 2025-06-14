import React, { useState } from "react";
import Question from "./components/Question/Index";
import Score from "./components/Score/Index";
import Play from "./components/Menu/index";

const App = () => {
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleAnswer = ( isCorrect) => {
    if(isCorrect){
      setScore((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    setScore(0);
    setShowQuiz(true);
  };

  return(
    <div className="app">
      {!showQuiz ? (
        <div className="welcome-screen">
          <h1>Quiz Game</h1>
          <button onClick={handleStart}>Play</button>
        </div>
      ) : (
        <>
          <Question onAnswer={handleAnswer} />
          {/*only show score after loading screen */}
          <div className="score-display">
            <p>Score : {score}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default App;