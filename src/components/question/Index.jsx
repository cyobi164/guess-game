import React, { useEffect, useState } from "react";
import "./Question.css";

const Question = ({ onAnswer = () => {} }) => {
  // states to hold questions, selected options, etc
  const [questionData, setQuestionData] = useState(null); // stores the question, correct answer, and options
  const [selected, setSelected] = useState(""); // stores user's selected answer
  const [feedback, setFeedback] = useState(""); //message after sumbitting
  const [loading, setLodading] = useState("loading"); //controls loading spinner
  const [error, setError] = useState("false"); // errors handling
  const [isAnswer, setIsAnswer] = useState("false"); //controls when 'next' shows
  const [retryCount, setRetryCount] = useState(0); //whether selected answer was correct

  // helper function to shuffle answer options
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // function to fetch a new question from the trivia Api
  const fetchQuestion = async (retryCount = 0) => {
    if (retryCount > 3) {
      // if retrying fails too many times
      setError(true);
      setFeedback("Unable to load question. Please try again");
      setLodading(false);
      return;
    }

    setLodading(true); // show spinner during loading
    try {
      const triviaRes = await fetch(
        "https://opentdb.com/api.php?amount=1&type=multiple"
      );
      const triviaData = await triviaRes.json();

      //if no question was found, retry
      if (!triviaData.results || triviaData.results.length === 0) {
        console.warn("No question found. Retrying....");
        return fetchQuestion(retryCount + 1);
      }

      const q = triviaData.results[0];

      //set the question data into state
      setQuestionData({
        question: decodeURIComponent(q.question),
        correct: q.correct_answer,
        options: shuffle([q.correct_answer, ...q.incorrect_answers]),
      });

      // reset other states
      setError(false);
      setIsAnswer(false);
      setFeedback("");
      setSelected("");
    } catch (error) {
      console.error("Failed to fetch question: ", error);
      setError(true);
      setQuestionData(null);
      setFeedback("Failed to load question. please try again");
    }
    setLodading(false); // end spinner
  };

  // on components mount wait 2 seconds then fetch the question
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestion();
    }, 2000);

    return () => clearTimeout(timer); //cleanup
  }, []);

  // when the user sumbnits an answer
  const handleSumbit = (e) => {
    e.preventDefault();
    if (!selected || !questionData) return;

    const isCorrectNow = selected === questionData.correct;
    setIsCorrect(isCorrectNow); // save result
    setIsAnswer(true); // enable nxt button

    setFeedback(
      isCorrectNow
        ? "Correct!"
        : `Incorrect\nThe correct answer is: ${questionData.correct}`
    );

    onAnswer(isCorrectNow); // tell parent (app.jsx) if it was correct
  };

  // show spinner during loading
  
};
export default Question;
