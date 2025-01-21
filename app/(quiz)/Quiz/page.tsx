"use client";
import React,{useState, useEffect} from "react";
import Navbar from "../../../components/ui/Navbar";
import {Check} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import { useQuiz } from "@/useContext/useContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const questionVariants = {
    enter: { opacity: 0, y: 50 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
};

export default function Quiz() {
    // const [currentQuestion, setCurrentQuestion] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {quizData,setQuizData, setCurrentQuestion, timeLeft} = useQuiz();
    const router = useRouter();

    useEffect(() => {
        if (!quizData.questions || quizData.questions.length === 0) {
            setIsLoading(true);
            fetch("https://opentdb.com/api.php?amount=15")
                .then((res) => res.json())
                .then((data) => {
                    setQuizData((prev) => ({
                        ...prev,
                        questions: data.results,
                    }));
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching questions:", error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [quizData.questions, setQuizData]);

    useEffect(() => {
        if (quizData.questions && quizData.questions.length > 0) {
            window.history.pushState(null, "", window.location.href);
            window.onpopstate = function () {
                router.push("/Quiz");
            };
        }
        if (quizData.hasSubmitted) {
            router.push("/Results");
        }
    }, [quizData.questions, router, quizData.hasSubmitted]);

    useEffect(() => {
        if (quizData?.questions?.length > 0) {
            const current = quizData.questions[quizData.currentQuestion];
            const allOptions = [...current.incorrect_answers, current.correct_answer];
            setOptions(shuffleOptions(allOptions));
        }
    }, [quizData.questions, quizData.currentQuestion]);

    useEffect(() => {
        if(timeLeft === 0) {
            setQuizData((prev) => ({...prev, hasSubmitted: true}));
            router.push("/Results");
        }
    }, [timeLeft, setQuizData, router]);

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);

        setQuizData((prev) => {
            const updatedAnswers = [...prev.selectedAnswers];
            const existingAnswer = updatedAnswers.findIndex(
                (answer) => answer.question === quizData?.questions[quizData.currentQuestion].question
            );

            if (existingAnswer !== -1) {
                updatedAnswers[existingAnswer].selectedOption = option;
            } else {
                updatedAnswers.push({
                    question: quizData?.questions[quizData.currentQuestion].question,
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
        if(quizData.currentQuestion < quizData.questions.length - 1) {
            setQuizData((prev) => {
                const seenQuestions = Array.isArray(quizData.seenQuestions) ? quizData.seenQuestions : [];
                return {
                    ...prev,
                    seenQuestions: [...new Set([...seenQuestions, quizData.questions[quizData.currentQuestion].question])]
                };
            });
            setCurrentQuestion((quizData.currentQuestion) + 1);
        }
    };

    const handlePrevious = () => {
        if(quizData.currentQuestion > 0) {
            setQuizData((prev) => {
                const seenQuestions = Array.isArray(quizData.seenQuestions) ? quizData.seenQuestions : [];
                return {
                    ...prev,
                    seenQuestions: [...new Set([...seenQuestions, quizData.questions[quizData.currentQuestion].question])]
                };
            });
            setCurrentQuestion((quizData.currentQuestion) - 1);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const confirmSubmit = () => {
        setIsModalOpen(false);
        setQuizData((prev) => ({
            ...prev,
            hasSubmitted: true,
        }));
        router.push("/Results");
    };

    return (
        <div className="flex flex-col min-h-screen">
          <Sidebar />
          <main className="flex flex-col min-h-screen ml-16">
            <Navbar />
            <div className="flex-grow p-4 m-4 border-2 border-gray-300 rounded-md overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xl">Loading questions...</p>
                </div>
              ) : !quizData.questions || quizData.questions.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xl">No questions available. Please try again.</p>
                </div>
              ) : (
                <form>
                  <div className="flex flex-col space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={quizData.currentQuestion}
                        variants={questionVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex flex-col space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">
                                {quizData.currentQuestion + 1} - {quizData.questions[quizData.currentQuestion].question}
                            </h2>
                            <div className="flex justify-start">
                                <h2
                                    className={`text-sm font-bold px-3 py-1 rounded-lg mt-2 sm:mt-0 inline-block ${
                                    quizData.questions[quizData.currentQuestion].difficulty === "easy"
                                        ? "bg-green-400"
                                        : quizData.questions[quizData.currentQuestion].difficulty === "medium"
                                        ? "bg-orange-400"
                                        : "bg-red-500"
                                    }`}
                                >
                                    {quizData.questions[quizData.currentQuestion].difficulty}
                                </h2>
                            </div>
                        </div>
                        <div className="mt-2 sm:w-1/4 w-full space-y-4">
                          {options.map((option, index) => (
                            <label
                              key={option}
                              className="flex items-center space-x-3 cursor-pointer rounded-md border-[1px] p-2"
                              style={{
                                backgroundColor: `rgba(36,62,142, 0.1)`,
                                boxShadow: `inset 0px 0px 0px 1px rgba(36,62,142, 0.6)`,
                              }}
                            >
                              <span
                                className="flex items-center text-sm font-medium px-2 h-6 border-[1px] bg-white rounded-sm"
                                style={{
                                  color: "#243e8e",
                                  borderColor: "#243e8e",
                                }}
                              >
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span
                                className="text-md items-center w-full font-medium min-h-6 h-auto"
                                style={{
                                  color: "#000000",
                                  borderColor: "#000000",
                                }}
                              >
                                {option}
                              </span>
                              <div className="flex relative">
                                <input
                                  type="radio"
                                  name={quizData.questions[quizData.currentQuestion]}
                                  value={option}
                                  checked={
                                    quizData.selectedAnswers.some(
                                      (answer) =>
                                        answer.question ===
                                          quizData.questions[quizData.currentQuestion].question &&
                                        answer.selectedOption === option
                                    )
                                  }
                                  onChange={(e) => handleOptionChange(e.target.value)}
                                  className="appearance-none w-5 h-5 rounded-full focus:outline-none"
                                />
                                {quizData.selectedAnswers.some(
                                  (answer) =>
                                    answer.question ===
                                      quizData.questions[quizData.currentQuestion].question &&
                                    answer.selectedOption === option
                                ) && (
                                  <Check
                                    className="absolute top-0 left-0 w-5 h-5 transition duration-200"
                                    style={{ color: "#243e8e" }}
                                  />
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </form>
              )}
            </div>
            {!isLoading && quizData.questions && quizData.questions.length > 0 && (
              <div className="p-4 m-4 mt-2 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-row">
                  <button
                    type="submit"
                    onClick={openModal}
                    className="px-4 py-2 bg-green-500 font-semibold rounded-lg"
                  >
                    Submit
                  </button>
                </div>
                <div className="flex flex-row flex-wrap gap-3 sm:gap-4 ml-2 sm:ml-5">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200"></button>
                        <span className="text-xs sm:text-sm whitespace-nowrap">Not visited</span>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500"></button>
                        <span className="text-xs sm:text-sm whitespace-nowrap">Visited</span>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500"></button>
                        <span className="text-xs sm:text-sm whitespace-nowrap">Answered</span>
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
                    disabled={quizData.currentQuestion === quizData.questions.length - 1}
                    className="px-4 py-2 bg-[#243e8e] font-semibold text-white border-2 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                  <h2 className="text-lg font-bold mb-4">Confirm Submission</h2>
                  <p>Are you sure you want to submit the quiz?</p>
                  <div className="flex flex-col mt-4 space-y-4">
                    <h2 className="text-md font-semibold">Attempted - {quizData.selectedAnswers.length}</h2>
                    <h2 className="text-md font-semibold">Unattempted - {quizData.questions.length - quizData.selectedAnswers.length}</h2>
                    <h2 className="text-md font-semibold">Viewed - {quizData.seenQuestions.length}</h2>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={confirmSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
    );      
}