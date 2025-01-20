"use client";
import React,{useState, useEffect} from "react";
import Navbar from "../../../components/ui/Navbar";
import {Check} from "lucide-react";

export default function Quiz() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=15")
        .then((res) => res.json())
        .then((data) => {
            setQuestions(data.results);
        });
    }, []);

    useEffect(() => {
        if(questions.length > 0) {
            const current = questions[currentQuestion];
            const allOptions = [...current.incorrect_answers, current.correct_answer];
            setOptions(shuffleOptions(allOptions));
        }
    }, [questions, currentQuestion]);

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    }

    useEffect(() => {
        setSelectedOption("");
    }, [currentQuestion]);

    const shuffleOptions = (options: string[]) => {
        return options.map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    };

    const handleNext = () => {
        if(currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if(currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("submitted");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow p-4 m-4 border-2 border-gray-300 rounded-md overflow-auto">
                {questions && questions.length === 0 ? (
                    <p>Loading questions...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    {currentQuestion+1} - {questions[currentQuestion].question}
                                </h2>
                                <h2 
                                    className={`text-sm font-bold px-3 py-2 rounded-lg ${
                                        questions[currentQuestion].difficulty === "easy"
                                        ? "bg-green-400"
                                        : questions[currentQuestion].difficulty === "medium"
                                        ? "bg-orange-400"
                                        : "bg-red-500"
                                }`}>{questions[currentQuestion].difficulty}</h2>
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
                                                name={questions[currentQuestion]}
                                                value={option}
                                                checked={selectedOption === option}
                                                onChange={(e) =>
                                                    handleOptionChange(e.target.value)
                                                }
                                                className="appearance-none w-5 h-5 rounded-full focus:outline-none"
                                            />
                                            {selectedOption === option && (
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
            <div className="p-4 m-4 mt-2 flex justify-between items-center">
                <div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 font-semibold rounded-lg"
                    >
                        Submit
                    </button>
                </div>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-4 py-2 bg-[#243e8e] font-semibold text-white border-2 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentQuestion === questions.length - 1}
                        className="px-4 py-2 bg-[#243e8e] font-semibold text-white border-2 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );    
}