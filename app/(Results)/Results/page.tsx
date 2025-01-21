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
      <div className="flex items-center justify-between p-4 bg-[#243e8e]">
        <h1 className="text-2xl font-bold text-white">Quiz Results</h1>
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
          className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-md"
        >
          Go Home
        </button>
      </div>
      <div className="my-4 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Your Score</h1>
        <div className="mt-4 flex flex-col gap-6 md:flex-row">
          <ProgressBar score={totalCorrect} total={quizData.questions.length} color="#243e8e" label="Total Score" />
          <ProgressBar score={difficultyScores.easy} total={quizData.questions.filter((q) => q.difficulty === "easy").length} color="#66bb6a" label="Easy" />
          <ProgressBar score={difficultyScores.medium} total={quizData.questions.filter((q) => q.difficulty === "medium").length} color="#ffa726" label="Medium" />
          <ProgressBar score={difficultyScores.hard} total={quizData.questions.filter((q) => q.difficulty === "hard").length} color="#ef5350" label="Hard" />
        </div>
      </div>
      <div className="mt-4 p-4">
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-xl font-bold">Your Responses</h2>
        </div>
        {quizData.questions.map((question, index) => {
          const selectedAnswer = quizData.selectedAnswers.find((ans) => ans.question === question.question);
          const questionWithShuffledOptions = processedQuestions.find((q) => q.question === question.question);
  
          return (
            <div key={index} className="mb-4 border-2 rounded-lg p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <p className="font-semibold">{index + 1} - {question.question}</p>
                <div className="flex flex-col md:flex-row items-start md:items-center mt-2 md:mt-0 space-y-2 md:space-y-0 md:space-x-2">
                  <h2
                    className={`text-sm font-bold px-3 py-1 rounded-lg inline-block ${
                      question.difficulty === "easy"
                        ? "bg-green-400"
                        : question.difficulty === "medium"
                        ? "bg-orange-400"
                        : "bg-red-500"
                    }`}
                  >
                    {question.difficulty}
                  </h2>
                  {!selectedAnswer && (
                    <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-gray-400 text-white">
                      Not Attempted
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2" style={{ width: 'fit-content', minWidth: '25%' }}>
                {questionWithShuffledOptions?.shuffledOptions.map((opt: any, i: any) => {
                  const isSelected = opt.option === selectedAnswer?.selectedOption;
                  const isCorrect = opt.isCorrect;
                  const isIncorrect = isSelected && !isCorrect;
  
                  return (
                    <label
                      key={opt.option}
                      className={`flex items-center justify-between m-2 space-x-3 cursor-pointer rounded-md border-[1px] border-gray-600 p-2`}
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
                      <span className="flex items-center text-sm font-medium px-2 h-6 border-[1px] bg-white rounded-sm" style={{ color: "#243e8e", borderColor: "#243e8e" }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-md items-center w-full font-medium">{opt.option}</span>
                      <div className="flex relative">
                        <input
                          type="radio"
                          name={question.question}
                          value={opt.option}
                          checked={isSelected}
                          className="appearance-none w-5 h-5 rounded-full focus:outline-none"
                          disabled
                        />
                        {isCorrect && <Check size={20} className="absolute top-0 left-0 text-green-500" />}
                        {isIncorrect && <X size={20} className="absolute top-0 left-0 text-red-500" />}
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
