"use client";
import {useState,useEffect} from "react";
import Navbar from "../../../components/ui/Navbar";
import {useQuiz} from "../../../useContext/useContext";
import {useRouter} from "next/navigation";

export default function Instructions() {
    const router = useRouter();
    const {startCountdown, quizData, setQuizData} = useQuiz();

    function handleStartQuiz() {
        startCountdown(1800);
        setQuizData((prev) => ({...prev, hasStarted: true}));
        router.push("/Quiz");
    }

    useEffect(() => {
        if(quizData.hasStarted) {
            router.push("/Quiz");
        }
        if(quizData.hasSubmitted) {
            router.push("/Results");
        }
    }, [router, quizData.hasStarted]);

    return (
        <>
            <Navbar/>
            <h1 className="p-4 font-semibold text-xl">Instructions</h1>
            <div className="border-2 border-gray-300 p-4 m-4 mt-0 rounded-md">
                <p>Read the instructions carefully before starting the quiz</p>
                <ul className="list-disc list-inside">
                    <li className="m-2">There are 15 questions in total</li>
                    <li className="m-2">Each question has 4 options</li>
                    <li className="m-2">The test duration is 30 minutes</li>
                    <li className="m-2">Choose the correct option for each question</li>
                    <li className="m-2">Once you have selected an option, you can change it as per wish.</li>
                    <li className="m-2">Click on the "Next" button to move to the next question</li>
                    <li className="m-2">Click on the "Previous" button to go back to the previous question</li>
                    <li className="m-2">You can skip a question and come back to it later</li>
                    <li className="m-2">The quiz automatically ends once the time is up</li>
                    <li className="m-2">Once you have answered all the questions, click on the "Submit" button to see your score</li>
                    <li className="m-2">You can see your score and the correct answers after submitting the quiz</li>
                </ul>
                <p className="font-bold">Good luck!!</p>
            </div>
            <div className="flex justify-center">
                <button className="bg-[#243e8e] text-white font-bold py-2 px-4 rounded m-4" onClick={() => router.push("/")}>Go back</button>
                <button 
                    className="bg-[#248e34]  text-white font-bold py-2 px-4 rounded m-4"
                    onClick={handleStartQuiz}
                >Start Quiz</button>
            </div>
        </>
    )
}
