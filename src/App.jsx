import React, { useState } from "react";
import Question from "./components/Question/Index";
import Score from "./components/Score/Index"

function App(){

  const [score, setScore] = useState(0);

  return(
    <>
      <Score score = {score} />
      <Question/>
    </>
  );
}

export default App;