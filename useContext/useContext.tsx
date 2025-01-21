"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface quizData {
  name: string;
  email: string;
  questions: any[];
  hasStarted: boolean;
  hasSubmitted: boolean;
  selectedAnswers: { question: string; selectedOption: string }[];
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

export const QuizProvider: React.FC<quizProviderProps> = ({ children }) => {
  const defaultQuizData = {
    name: "",
    email: "",
    questions: [],
    hasStarted: false,
    hasSubmitted: false,
    selectedAnswers: [],
    currentQuestion: 0,
    seenQuestions: [],
  };

  const [quizData, setQuizData] = useState<quizData>(defaultQuizData);
  const [timeLeft, setTimeLeft] = useState<number>(1800);

  // Synchronize `quizData` with localStorage on client side
  useEffect(() => {
    const storedQuizData = localStorage.getItem("quizData");
    if (storedQuizData) {
      setQuizData(JSON.parse(storedQuizData));
    }
  }, []);

  // Synchronize `timeLeft` with localStorage on client side
  useEffect(() => {
    const storedTimeLeft = localStorage.getItem("timeLeft");
    if (storedTimeLeft) {
      setTimeLeft(parseInt(storedTimeLeft, 10));
    }
  }, []);

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
    const storedEndTime = localStorage.getItem("end_time");
    if (storedEndTime) {
      const remainingTime = Math.max(0, Math.floor((+storedEndTime - Date.now()) / 1000));
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        startCountdown(remainingTime);
      } else {
        localStorage.removeItem("end_time");
      }
    }
  }, []);

  const setCurrentQuestion = (index: number) => {
    setQuizData((prev) => ({ ...prev, currentQuestion: index }));
  };

  return (
    <quizContext.Provider
      value={{ quizData, setQuizData, timeLeft, startCountdown, setCurrentQuestion, setTimeLeft }}
    >
      {children}
    </quizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(quizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a quizProvider");
  }
  return context;
};
