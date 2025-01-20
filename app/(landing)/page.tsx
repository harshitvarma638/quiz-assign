"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/useContext/useContext";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { quizData , setQuizData } = useQuiz();

  const handleSubmit = () => {
    if(!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setQuizData({name, email, selectedAnswers: []});
    console.log(quizData);
    router.push('/Instructions');
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-2 gap-2 h-screen w-screen">
        <div className="col-span-1 flex flex-col items-center justify-center text-4xl">
          <Image src="/quiz.png" alt="Quiz Image" width={500} height={500}/>
        </div>
        <div className="col-span-1 flex items-center justify-center h-screen">
          <div className="flex flex-col p-6 rounded-lg shadow-md w-96 bg-[#eef3fc] justify-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Enter Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="flex flex-col mb-4 align-start">
                <label className="mb-2 block font-medium text-xl text-" htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col mb-4 align-start">
                <label className="mb-2 block font-medium text-xl text-" htmlFor="name">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="name"
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#243e8e] text-white font-medium text-xl rounded-lg"
              >
                Start the quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
