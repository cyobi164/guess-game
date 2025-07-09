import React, { useEffect, useState } from "react";
import "./Question.css";

const Question = ({
  onAnswer = () => {},
  categoryId,
  difficulty,
  score,
  onloaded,
}) => {
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAnswer, setIsAnswer] = useState(false);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchQuestion = async (retryCount = 0) => {
    if (retryCount > 3) {
      setError(true);
      setFeedback("Unable to load question. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const url = `https://opentdb.com/api.php?amount=1&type=multiple&category=${categoryId}&difficulty=${difficulty.toLowerCase()}`;
    console.log(`Fetching: ${url}`);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        console.warn("No question found. Retrying... Attempt", retryCount + 1);

        // Retry with easier difficulty if needed
        const easierDifficulty =
          retryCount >= 2 ? "easy" : difficulty.toLowerCase();

        const fallbackUrl = `https://opentdb.com/api.php?amount=1&type=multiple&category=${categoryId}&difficulty=${easierDifficulty}`;
        console.log(`Retrying with fallback URL: ${fallbackUrl}`);

        return fetchQuestion(retryCount + 1);
      }

      const q = data.results[0];
      setQuestionData({
        question: decodeHtml(q.question),
        correct: q.correct_answer,
        options: shuffle([q.correct_answer, ...q.incorrect_answers]),
      });

      if (typeof onloaded === "function") onloaded();

      setSelected("");
      setFeedback("");
      setError(false);
      setIsAnswer(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
      setFeedback("Failed to load question. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestion();
    }, 1000);

    return () => clearTimeout(timer);
  }, [categoryId, difficulty]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected || !questionData) return;

    const isCorrect = selected === questionData.correct;
    setIsAnswer(true);

    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect\nCorrect answer: ${questionData.correct}`
    );

    onAnswer(isCorrect);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner">
          <p className="dot-animation">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{feedback || "Error loading question."}</p>
        <button onClick={() => fetchQuestion()}>Try Again</button>
      </div>
    );
  }

  if (!questionData) return null;

  return (
    <div className="question">
      <h2>{questionData.question}</h2>
      <h3>Score: {score}</h3>

      <form onSubmit={handleSubmit}>
        {questionData.options.map((option, i) => (
          <label key={i}>
            <input
              type="radio"
              name="option"
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
            />{" "}
            {decodeHtml(option)}
          </label>
        ))}
        <br />
        <button type="submit" disabled={!selected.trim()}>
          Submit
        </button>
      </form>

      <p style={{ whiteSpace: "pre-line" }}>{feedback}</p>

      {isAnswer && <button onClick={fetchQuestion}>Next</button>}
    </div>
  );
};

export default Question;
