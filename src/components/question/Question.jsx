import React, { useState } from "react";
import "./Question.css";

const Question =() => {
    const [input, setInput] = useState("");
    const [message, setMessage] = useState("");

    const answer = ""; // dont know the answer

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input == answer){
            setMessage ("Correct");
        }else{
            setMessage("Try again");
        }
    };

    return(
        <div className="Question-box">
            <form onSubmit={handleSubmit}>
                <input
                    type="Text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Your Guess"
                />
                <button type="Submit">Guess</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Question;