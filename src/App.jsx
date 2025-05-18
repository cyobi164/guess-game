import React from "react";
import Question from "./components/Question/Index";

function App(){
  return(
    <div className="app-container">
      <h1>Guess The Number & Word Game</h1>
      <Question />
    </div>
  );
}

export default App;