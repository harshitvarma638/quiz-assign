"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/useContext/useContext";
import ProgressBar from "@/components/ui/ProgressBar";
import { Check, X } from "lucide-react";

const shuffleArray = (array: any[]) => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...item }) => item);
};

export default function Results() {
    const { quizData, setQuizData } = useQuiz();
    const router = useRouter();

    const [processedQuestions, setProcessedQuestions] = useState<any[]>([]);

    useEffect(() => {
        const shuffledQuestions = quizData.questions.map((question) => {
        const allOptions = [
            ...question.incorrect_answers.map((opt: any) => ({ option: opt, isCorrect: false })),
            { option: question.correct_answer, isCorrect: true },
        ];
        const shuffledOptions = shuffleArray(allOptions);

        return { ...question, shuffledOptions };
        });

        setProcessedQuestions(shuffledQuestions);
    }, [quizData]);

    const calculateScore = () => {
        return quizData.selectedAnswers.reduce((score, answer) => {
        const question = quizData.questions.find((q) => q.question === answer.question);
        return question?.correct_answer === answer.selectedOption ? score + 1 : score;
        }, 0);
    };

    const calculateDifficultyScores = () => {
        const difficultyScores = {
        easy: 0,
        medium: 0,
        hard: 0,
        };

        quizData.selectedAnswers.forEach((answer) => {
        const question = quizData.questions.find((q) => q.question === answer.question);
        if (question) {
            const isAnsweredCorrectly = question.correct_answer === answer.selectedOption;
            if (isAnsweredCorrectly) {
            if (question.difficulty === "easy") {
                difficultyScores.easy++;
            }
            if (question.difficulty === "medium") {
                difficultyScores.medium++;
            }
            if (question.difficulty === "hard") {
                difficultyScores.hard++;
            }
            }
        }
        });

        return {
        difficultyScores,
        totalCorrect: calculateScore(),
        };
    };

    const { difficultyScores, totalCorrect } = calculateDifficultyScores();

    return (
        <div>
        <div className="flex items-center justify-between p-3 sm:p-4 bg-[#243e8e]">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Quiz Results</h1>
            <button
            onClick={() => {
                localStorage.clear();
                setQuizData({
                name: "",
                email: "",
                questions: [],
                hasStarted: false,
                hasSubmitted: false,
                selectedAnswers: [],
                currentQuestion: 0,
                seenQuestions: [],
                });
                router.push("/");
            }}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md font-semibold text-sm sm:text-md"
            >
            Go Home
            </button>
        </div>
        <div className="my-2 sm:my-4 flex flex-col items-center justify-center p-3 sm:p-4">
            <h1 className="text-xl sm:text-2xl font-bold">Your Score</h1>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row gap-4 sm:gap-6 w-full px-4 sm:px-0">
            <div className="w-full md:w-auto">
                <ProgressBar score={totalCorrect} total={quizData.questions.length} color="#243e8e" label="Total Score" />
            </div>
            <div className="w-full md:w-auto">
                <ProgressBar score={difficultyScores.easy} total={quizData.questions.filter((q) => q.difficulty === "easy").length} color="#66bb6a" label="Easy" />
            </div>
            <div className="w-full md:w-auto">
                <ProgressBar score={difficultyScores.medium} total={quizData.questions.filter((q) => q.difficulty === "medium").length} color="#ffa726" label="Medium" />
            </div>
            <div className="w-full md:w-auto">
                <ProgressBar score={difficultyScores.hard} total={quizData.questions.filter((q) => q.difficulty === "hard").length} color="#ef5350" label="Hard" />
            </div>
            </div>
        </div>
        <div className="mt-2 sm:mt-4 p-3 sm:p-4">
            <div className="mb-3 sm:mb-4 flex items-center justify-center">
            <h2 className="text-lg sm:text-xl font-bold">Your Responses</h2>
            </div>
            {quizData.questions.map((question, index) => {
            const selectedAnswer = quizData.selectedAnswers.find((ans) => ans.question === question.question);
            const questionWithShuffledOptions = processedQuestions.find((q) => q.question === question.question);

            return (
                <div key={index} className="mb-4 border-2 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
                        <p className="text-sm sm:text-base font-semibold">{index + 1} - {question.question}</p>
                        <h2
                            className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-lg inline-block w-fit ${
                            question.difficulty === "easy"
                                ? "bg-green-400"
                                : question.difficulty === "medium"
                                ? "bg-orange-400"
                                : "bg-red-500"
                            }`}
                        >
                            {question.difficulty}
                        </h2>
                    </div>
                    <div className="mt-2 w-full sm:w-fit">
                    {questionWithShuffledOptions?.shuffledOptions.map((opt: any, i: any) => {
                    const isSelected = opt.option === selectedAnswer?.selectedOption;
                    const isCorrect = opt.isCorrect;
                    const isIncorrect = isSelected && !isCorrect;

                    return (
                        <label
                        key={opt.option}
                        className={`flex items-center justify-between w-full sm:min-w-[300px] m-1 sm:m-2 space-x-2 sm:space-x-3 cursor-pointer rounded-md border-[1px] border-gray-600 p-2 text-sm sm:text-base`}
                        style={{
                            boxShadow:
                            isCorrect
                                ? "rgba(76, 175, 80, 0.2)"
                                : isIncorrect
                                ? "rgba(244, 67, 54, 0.2)"
                                : isSelected
                                ? `rgba(36,62,142, 0.1)`
                                : undefined,
                            backgroundColor: isCorrect
                            ? "rgba(76, 175, 80, 0.2)"
                            : isIncorrect
                            ? "rgba(244, 67, 54, 0.2)"
                            : isSelected
                            ? `rgba(36,62,142, 0.1)`
                            : undefined,
                        }}
                        >
                        <span className={`flex items-center text-xs sm:text-sm font-medium px-2 h-5 sm:h-6 border-[1px] bg-white rounded-sm`} style={{ color: "#243e8e", borderColor: "#243e8e" }}>
                            {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm sm:text-md items-center w-full font-medium min-h-5 sm:min-h-6 h-auto" style={{ color: "#000000", borderColor: "#000000" }}>
                            {opt.option}
                        </span>
                        <div className="flex relative">
                            <input
                            type="radio"
                            name={question.question}
                            value={opt.option}
                            checked={isSelected}
                            className="appearance-none w-4 h-4 sm:w-5 sm:h-5 rounded-full focus:outline-none"
                            disabled
                            />
                            {isCorrect && <Check size={16} className="absolute top-0 left-0 text-green-500 sm:size-20" />}
                            {isIncorrect && <X size={16} className="absolute top-0 left-0 text-red-500 sm:size-20" />}
                        </div>
                        </label>
                    );
                    })}
                </div>
                </div>
            );
            })}
        </div>
        </div>
    );
}
