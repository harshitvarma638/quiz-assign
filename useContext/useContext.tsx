"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface quizData {
    name: string;
    email: string;
    questions: any[];
    hasStarted: boolean;
    hasSubmitted: boolean;
    selectedAnswers: {question: string; selectedOption: string}[];
    seenQuestions: string[];
    currentQuestion: number;
}

interface quizContextType {
    quizData: quizData;
    setQuizData: React.Dispatch<React.SetStateAction<quizData>>;
    timeLeft: number;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    startCountdown: (duration: number) => void;
    setCurrentQuestion: (index: number) => void;
}

interface quizProviderProps {
    children: React.ReactNode;
}

const quizContext = createContext<quizContextType | undefined>(undefined);

export const QuizProvider: React.FC<quizProviderProps> = ({ children}) => {
    const [quizData, setQuizData] = useState<quizData>(() =>{
        if (typeof window !== "undefined") {
            const data = window.localStorage.getItem("quizData");
            return data ? JSON.parse(data) : {name: "", email: "", questions: [], hasStarted: false, hasSubmitted: false,selectedAnswers: [], currentQuestion: 0, seenQuestions: []};
        }
        return {name: "", email: "", questions: [], hasStarted: false, hasSubmitted: false,selectedAnswers: [], currentQuestion: 0, seenQuestions: []};
    });

    const [timeLeft, setTimeLeft] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const time = window.localStorage.getItem("timeLeft");
            return time ? parseInt(time, 10) : 1800;
        }
        return 1800;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("quizData", JSON.stringify(quizData));
        }
    }, [quizData]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("timeLeft", timeLeft.toString());
        }
    }, [timeLeft]);

    const countdownRef = React.useRef<NodeJS.Timeout | null>(null);

    const startCountdown = (initialTime: number) => {
        const endTime = Date.now() + initialTime * 1000;
        if (typeof window !== "undefined") {
            window.localStorage.setItem("end_time", endTime.toString());
        }

        setTimeLeft(initialTime);
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
        }

        countdownRef.current = setInterval(() => {
            const timeRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(countdownRef.current!);
                countdownRef.current = null;
            }
        }, 1000);
    };
      
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEndTime = window.localStorage.getItem("end_time");
            if (storedEndTime) {
                const remainingTime = Math.max(0, Math.floor((+storedEndTime - Date.now()) / 1000));
                if (remainingTime > 0) {
                    setTimeLeft(remainingTime);
                    startCountdown(remainingTime); // restart countdown with remaining time
                } else {
                    window.localStorage.removeItem("end_time");
                }
            }
        }
    }, []);

    const setCurrentQuestion = (index: number) => {
        setQuizData((prev) => ({...prev, currentQuestion: index}));
    }

    return (
        <quizContext.Provider value={{quizData, setQuizData, timeLeft, startCountdown, setCurrentQuestion, setTimeLeft}}>
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