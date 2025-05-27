import React, { useEffect, useState } from "react";
import "./Question.css";

const Question = ({ onAnswer }) => {
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState(" ");
  const [feedback, setFeedback] = useState(" ");

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const fetchQuestion = async () => {
    const [triviaRes, factRes] = await Promise.all([
      fetch("https://opentdb.com/api.php?amount=1&type=multiple"),
      fetch("https://api.api-ninjas.com/v1/facts", {
        headers: { "X-Api-Key": "o4f+YtPZ/YhlfNNhiZD1+w==UPB8Xc7U7EkG4qq4" },
      }),
    ]);
    const triviaData = await triviaRes.json();
    if(!triviaData.results || triviaData.results.length === 0){
        throw new Error("No trivia result found");
    }

    const q = triviaData.results[0];

    setQuestionData({
      question: decodeURIComponent(q.question),
      correct: q.correct_answer,
      options: shuffle([q.correct_answer, ...q.incorrect_answers]),
    });

    setSelected(" ");
    setFeedback(" ");
  } catch (error){
    console.error("Failed to fetch question:", error);
    //optionally set an error state or fallback
    setQuestionData(null);
    setFeedback("Failed to load question. Please try again.")
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;

    const isCorrect = selected === questionData.correct;
    setFeedback(
      isCorrect ? "Correct!" : `❌ Wrong! Answer: ${questionData.correct}`
    );
    onAnswer(isCorrect);

    setTimeout(() => {
      fetchQuestion();
    }, 1500);
  };

  const [loading, setloading] = useState(true);
  useEffect(() => {
    //show loading screen for seconds
    const timer = setTimeout(() => {
        setloading(false);//switch to quiz screen
        fetchQuestion();//fetch the first question
    }, 2000);

    return () => clearTimeout(timer);//cleanup
  },[]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner">
          <p className="dot-animation">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        <h1>Welcome to the Quiz Game!</h1>
      </div>
      <div className="question">
        <h2 dangerouslySetInnerHTML={{ __html: questionData.question }} />
        <form onSubmit={handleSubmit}>
          {questionData.options.map((option, i) => (
            <label key={i}>
              <input
                type="radio"
                name="option"
                value={option}
                checked={selected == option}
                onChange={() => setSelected(option)}
              />
              {option}
            </label>
          ))}
          <br />
          <button type="submit" disabled={!selected}>
            Submit
          </button>
        </form>
        <p>{feedback}</p>
      </div>
    </>
  );
};

export default Question;
