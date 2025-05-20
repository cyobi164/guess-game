import React, {useEffect, useState} from "react";
import "./Question.css";

const Question = ({ onAnswer }) => {
    const [questionData, setQuestionData] = useState(null);
    const [selected, setSelected] = useState(" ");
    const [feedback, setFeedback] = useState(" ");

    const fetchQuestion = async() =>{
        const res = await fetch("");
        const data = await res.json();
        const q = data.results[0];
        setQuestionData({
            Question : decodeURIComponent(q.question),
            correct : q.correct_answer,
            options : shuffle([q.correct_answer, ...q.incorrect_answers])
        });
        setSelected ("");
        setFeedback ("");
    };


    const shuffle = (arr) => [...arr].sort(() => Math.random() -0.5);
    
    useEffect(() => {
        fetchQuestion();
    },[]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!selected) return;

        const isCorrect = selected == questionData.correct;
        setFeedback(isCorrect ? "Correct!" : `❌ Wrong! Answer: ${questionData.correct}`);
        onAnswer(isCorrect);

        setTimeout(() => {
            fetchQuestion();
        }, 1500);
    };

    if(!questionData) return <p> Loading question...</p>;

    return(
        <div className="question">
            <h2 dangerouslySetInnerHTML={{__html: questionData.question}} />
            <form onSubmit={handleSubmit}>
                {questionData.options.map((option, i) => 
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
                )}
                <br />
                <button type="submit" disabled ={!selected}>Submit</button>
            </form>
            <p>{feedback}</p>
        </div>
    );
};


export default Question;