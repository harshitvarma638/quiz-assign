import React, { useState, useEffect } from 'react';
import { useQuiz } from "../../useContext/useContext";

function Timer() {
    const { timeLeft} = useQuiz();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <div className='text-2xl text-black font-semibold py-2 px-5 m-2 rounded-lg bg-white'>{formatTime(timeLeft)}</div>
        </div>
    );
};

export default Timer;