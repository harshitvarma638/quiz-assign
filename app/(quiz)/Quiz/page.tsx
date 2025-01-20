"use client";
import React,{useState, useEffect} from "react";
import Navbar from "../../../components/ui/Navbar";
import {Check} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import { useQuiz } from "@/useContext/useContext";

export default function Quiz() {
    const [questions, setQuestions] = useState<any[]>([]);
    // const [currentQuestion, setCurrentQuestion] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState("");
    const {quizData,setQuizData, setCurrentQuestion} = useQuiz();

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=15")
        .then((res) => res.json())
        .then((data) => {
            setQuestions(data.results);
        });
    }, []);

    useEffect(() => {
        if(questions.length > 0) {
            const current = questions[quizData.currentQuestion];
            const allOptions = [...current.incorrect_answers, current.correct_answer];
            setOptions(shuffleOptions(allOptions));
        }
    }, [questions, quizData.currentQuestion]);

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);

        setQuizData((prev) => {
            const updatedAnswers = [...prev.selectedAnswers];
            const existingAnswer = updatedAnswers.findIndex(
                (answer) => answer.question === questions[quizData.currentQuestion].question
            );

            if (existingAnswer !== -1) {
                updatedAnswers[existingAnswer].selectedOption = option;
            } else {
                updatedAnswers.push({
                    question: questions[quizData.currentQuestion].question,
                    selectedOption: option,
                });
            }
            return { ...prev, selectedAnswers: updatedAnswers };
        });
    };

    useEffect(() => {
        setSelectedOption("");
    }, [quizData.currentQuestion]);

    const shuffleOptions = (options: string[]) => {
        return options.map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    };

    const handleNext = () => {
        if(quizData.currentQuestion < questions.length - 1) {
            setQuizData((prev) => {
                const seenQuestions = Array.isArray(quizData.seenQuestions) ? quizData.seenQuestions : [];
                return {
                    ...prev,
                    seenQuestions: [...new Set([...seenQuestions, questions[quizData.currentQuestion].question])]
                };
            });
            setCurrentQuestion(quizData.currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if(quizData.currentQuestion > 0) {
            setQuizData((prev) => {
                const seenQuestions = Array.isArray(quizData.seenQuestions) ? quizData.seenQuestions : [];
                return {
                    ...prev,
                    seenQuestions: [...new Set([...seenQuestions, questions[quizData.currentQuestion].question])]
                };
            });
            setCurrentQuestion(quizData.currentQuestion - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("submitted");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar 
                questions={questions}
            />
            <main className="flex flex-col min-h-screen ml-16">  
                <Navbar />
                <div className="flex-grow p-4 m-4 border-2 border-gray-300 rounded-md overflow-auto">
                    {questions && questions.length === 0 ? (
                        <p>Loading questions...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        {(quizData.currentQuestion)+1} - {questions[quizData.currentQuestion].question}
                                    </h2>
                                    <h2 
                                        className={`text-sm font-bold px-3 py-2 rounded-lg ${
                                            questions[quizData.currentQuestion].difficulty === "easy"
                                            ? "bg-green-400"
                                            : questions[quizData.currentQuestion].difficulty === "medium"
                                            ? "bg-orange-400"
                                            : "bg-red-500"
                                    }`}>{questions[quizData.currentQuestion].difficulty}</h2>
                                </div>
                                <div
                                    className="space-y-2"
                                    style={{ width: 'fit-content', minWidth: '25%' }}
                                >
                                    {options.map((option, index) => (
                                        <label
                                            key={option}
                                            className={`flex items-center justify-between min-w-1/4 space-x-3 cursor-pointer rounded-md border-[1px] p-2`}
                                            style={{
                                                backgroundColor: `rgba(36,62,142, 0.1)`,
                                                boxShadow: `inset 0px 0px 0px 1px rgba(36,62,142, 0.6)`,
                                            }}
                                        >
                                            <span
                                                className={`flex items-center text-sm font-medium px-2 h-6 border-[1px] bg-white rounded-sm`}
                                                style={{
                                                    color: '#243e8e',
                                                    borderColor: '#243e8e',
                                                }}
                                            >
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            <span
                                                className="text-md items-center w-full font-medium min-h-6 h-auto"
                                                style={{
                                                    color: '#000000',
                                                    borderColor: '#000000',
                                                }}
                                            >
                                                {option}
                                            </span>
                                            <div className="flex relative">
                                                <input
                                                    type="radio"
                                                    name={questions[quizData.currentQuestion]}
                                                    value={option}
                                                    checked={
                                                        quizData.selectedAnswers.some(
                                                          (answer) =>
                                                            answer.question === questions[quizData.currentQuestion].question &&
                                                            answer.selectedOption === option
                                                        )
                                                    }
                                                    onChange={(e) =>
                                                        handleOptionChange(e.target.value)
                                                    }
                                                    className="appearance-none w-5 h-5 rounded-full focus:outline-none"
                                                />
                                                {quizData.selectedAnswers.some(
                                                    (answer) =>
                                                    answer.question === questions[quizData.currentQuestion].question &&
                                                    answer.selectedOption === option
                                                ) && (
                                                    <Check
                                                        className="absolute top-0 left-0 w-5 h-5 transition duration-200"
                                                        style={{ color: '#243e8e' }}
                                                    />
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                <div className="p-4 m-4 mt-2 flex flex-row justify-between items-center">
                    <div className="flex flex-row">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 font-semibold rounded-lg"
                        >
                            Submit
                        </button>
                    </div>
                    <div className="flex flex-row space-x-4 ml-5">
                        <div className="flex flex-row items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-200"></button>
                            <span>Not visited</span>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-red-500"></button>
                            <span>Visited</span>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-green-500"></button>
                            <span>Answered</span>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={quizData.currentQuestion === 0}
                            className="px-4 py-2 bg-[#243e8e] font-semibold text-white border-2 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={quizData.currentQuestion === questions.length - 1}
                            className="px-4 py-2 bg-[#243e8e] font-semibold text-white border-2 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );    
}