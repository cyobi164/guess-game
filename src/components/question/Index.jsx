import React, { useEffect, useState } from "react";
import "./Question.css";

const Question = ({ onAnswer = () => {} }) => {
    const [questionData, setQuestionData] = useState(null);
    const [selected, setSelected] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isAnswer, setIsAnswer] = useState(false);

    //shuffle option helper
    const shuffle = (arr) => [...arr].sort(() => Math.random() -0.5);

    //fetch question with error handling
    const fetchQuestion = async () => {
        try{
            const [triviaRes, factRes] = await Promise.all([
                fetch("https://opentdb.com/api.php?amount=1&type=multiple"),
                fetch("https://api.api-ninjas.com/v1/facts",{
                    headers : {"X-Api-Key" : "o4f+YtPZ/YhlfNNhiZD1+w==UPB8Xc7U7EkG4qq4"},
                }),
            ]);

            const triviaData = await triviaRes.json();
            if(!triviaData.results || triviaData.results.length === 0){
                throw new Error("No result Found");
            }

            const q = triviaData.results[0];

            setQuestionData({
                question : decodeURIComponent(q.question),
                correct : q.correct_answer,
                options : shuffle([q.correct_answer, ...q.incorrect_answers]),
            });

            setSelected("");
            setFeedback("");
            setError(false);
        }catch(error){
            console.error("Failed to fetch question:", error);
            setError(true);
            setQuestionData(null);
            setFeedback("Failed to load question. please try again");
        }

        setIsAnswer(false); 
    };

    //Initial loading + fetch first question after 2 sec
    useEffect(() => {
        const timer = setTimeout(() =>{
            setLoading(false);
            fetchQuestion();
        }, 2000);

        return () => clearTimeout(timer);
    },[]);

    //handle answer submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selected || !questionData) return;

        const isCorrect = selected === questionData.correct;
        setFeedback(
            isCorrect ? "Correct!" : `incorrect\nThe correct answer is : ${questionData.correct}`
        );
        onAnswer(isCorrect);

        setIsAnswer(true); // for nxt button

    };

    //handle answer
    const handleAnswer = (isCorrect) => {
        if(isCorrect){
            console.log("Correct Answer!");
        }else{
            console.log("Wrong answer!");
        }
    };

    <Question onAnswer={handleAnswer} />

    if (loading){
        return(
            <div className="loading-screen">
                <div className="spinner">
                    <p className="dot-animation">Loading</p>
                </div>
            </div>
        );
    } 

    //for error
    if(error){
        //show error only if loading is false and error is true
        return(
            <div className="error-screen">
                <p>{feedback || "Error Loading Question."}</p>
                <button onClick={fetchQuestion}>Try again</button>
            </div>
        );
    }

    if(!questionData){
        return null;
    }

    return(
        <>
            <div className="app-container">
                <h1>Welcome to the Quiz</h1>
            </div>
            <div className="question">
                <h2 dangerouslySetInnerHTML={{__html : questionData.question}} />
                <form onSubmit = {handleSubmit}>
                    {questionData.options.map((option, i) =>(
                        <label key = {i}>
                            <input 
                                type="radio"
                                name="option"
                                value={option}
                                checked={selected === option}
                                onChange={() => setSelected(option)}
                            />
                            {option}
                        </label>
                    ))}
                    <br/>
                    <button type="submit" disabled={!selected.trim}>
                        Submit
                    </button>
                </form>
                <p style ={{whiteSpace: "pre-line"}}>{feedback}</p>

                {
                    isAnswer && (
                        <button onClick={fetchQuestion}>Next</button>
                    )
                }
            </div>
        </>
    );
};

export default Question;