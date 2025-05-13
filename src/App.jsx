import React from "react";
import Question from "./components/question/Question";
import Score from "./components/score/Score";
import Result from "./components/result/Result";

function App(){
  return(
    <div className="app-container">
      <h1>Guess The Number & Word Game</h1>
      <Score />
      <Question />
      <Result />
    </div>
  );
}

export default App;