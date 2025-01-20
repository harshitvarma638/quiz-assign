import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useQuiz } from '@/useContext/useContext';

interface SidebarProps {
    questions: any[];
}

export default function Sidebar({ questions }: SidebarProps) {
    const {quizData,setQuizData, setCurrentQuestion} = useQuiz();
    const [open, setOpen] = useState(false);

    const handleQuestionClick = (index: number) => {
        setCurrentQuestion(index);
        setQuizData((prev) => {
            const seenQuestions = Array.isArray(quizData.seenQuestions) ? quizData.seenQuestions : [];
            return {
                ...prev,
                seenQuestions: [...new Set([...seenQuestions, questions[index].question])]
            };
        });
    };

    return (
        <div className={`${open ? "w-96" : "w-16"} h-screen border-r border-gray-200 bg-white fixed left-0 flex flex-col transition-width duration-300`}>
            <div className="flex-none flex items-center justify-center p-4 border-b border-gray-200">
                <button onClick={() => setOpen((prev) => !prev)}>
                    {open ? <X size={24}/> : <Menu size={24} />}
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center py-4 space-y-2 overflow-y-scroll no-scrollbar">
                <style>
                    {`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                {questions.map((question: any, index: number) => (
                    <div key={index} className="w-full flex items-center justify-center">
                        <button
                            onClick={() => handleQuestionClick(index)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                                ${
                                    quizData.currentQuestion === index
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : quizData.selectedAnswers.some(
                                            (answer) =>
                                                answer.question === question.question && answer.selectedOption !== ""
                                        )
                                        ? "bg-green-500 text-white"
                                        : quizData.seenQuestions.includes(question.question)
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-200"
                                }`}
                        >
                            {index + 1}
                        </button>
                        {open && (
                            <div className='ml-4 flex flex-row items-center justify-center'>
                                <span
                                    onClick={() => handleQuestionClick(index)} 
                                    className='flex items-center justify-center font-normal text-sm p-1 rounded-lg bg-gray-200 text-black m-1 w-56 cursor-pointer'
                                >{question.question.slice(0,40)}</span>
                                <span
                                    onClick={() => handleQuestionClick(index)}
                                    className={`flex text-sm px-1 py-2 rounded-lg w-16 items-center justify-center cursor-pointer
                                    ${question.difficulty === "easy"
                                        ? "bg-green-400"
                                        : question.difficulty === "medium"
                                        ? "bg-orange-400"
                                        : "bg-red-500"
                                }`}>{question.difficulty}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );    
}
