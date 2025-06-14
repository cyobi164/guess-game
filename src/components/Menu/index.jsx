import React from "react";

const Menu = ({onStart = () => {} }) => {
    return (
        <div className="menu-screen">
            <h1>Welcome to the Quiz Game</h1>
            <button onClick={onStart}>Play</button>
        </div>
    );
};

export default Menu;