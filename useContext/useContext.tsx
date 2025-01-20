"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface quizData {
    name: string;
    email: string;
    selectedAnswers: {question: string; selectedOption: string}[];
}

interface quizContextType {
    quizData: quizData;
    setQuizData: React.Dispatch<React.SetStateAction<quizData>>;
    timeLeft: number;
    startCountdown: (duration: number) => void;
}

interface quizProviderProps {
    children: React.ReactNode;
}

const quizContext = createContext<quizContextType | undefined>(undefined);

export const QuizProvider: React.FC<quizProviderProps> = ({ children}) => {
    const [quizData, setQuizData] = useState<quizData>(() =>{
        const data = localStorage.getItem("quizData");
        return data ? JSON.parse(data) : {name: "", email: "", selectedAnswers: []};
    });

    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const time = localStorage.getItem("timeLeft");
        return time ? parseInt(time, 10) : 1800;
    });

    useEffect(() => {
        localStorage.setItem("quizData", JSON.stringify(quizData));
    }, [quizData]);

    useEffect(() => {
        localStorage.setItem("timeLeft", timeLeft.toString());
    }, [timeLeft]);

    const countdownRef = React.useRef<NodeJS.Timeout | null>(null);

    const startCountdown = (initialTime: number) => {
        const endTime = Date.now() + initialTime * 1000;
        localStorage.setItem("end_time", endTime.toString());

        setTimeLeft(initialTime);
        if(countdownRef.current) {
            clearInterval(countdownRef.current);
        }

        countdownRef.current = setInterval(() => {
            const timeRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(timeRemaining);

            if(timeRemaining <= 0) {
                clearInterval(countdownRef.current!);
                countdownRef.current = null;
            }
        }, 1000);
    };
      
    useEffect(() => {
        const storedEndTime = localStorage.getItem("end_time");
        if(storedEndTime) {
            const remainingTime = Math.max(0, Math.floor((+storedEndTime - Date.now()) / 1000));
            if(remainingTime > 0){
                setTimeLeft(remainingTime);
                startCountdown(remainingTime); // restarting the countdown with remaining time after page reload
            }
            else {
                localStorage.removeItem("end_time");
            }
        }
    }, []);

    return (
        <quizContext.Provider value={{quizData, setQuizData, timeLeft, startCountdown}}>
            {children}
        </quizContext.Provider>
    );
}

export const useQuiz = () => {
    const context = useContext(quizContext);
    if (!context) {
        throw new Error("useQuiz must be used within a quizProvider");
    }
    return context;
}