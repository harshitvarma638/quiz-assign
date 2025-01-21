Deployement Link - https://quiz-assign-gamma.vercel.app/

Video Demo
https://youtu.be/6Te5pxLq7jw

Overview

This is a comprehensive quiz application where users can join by entering their name and email address. The quiz answers are securely saved in local storage, ensuring they are safe and accessible even after refreshing the page. The app employs React Context for managing global state, allowing for smooth data flow between components.

The user interface, inspired by HackerEarth, is crafted to be smooth, intuitive, and easy to navigate. Framer Motion is used to create elegant transitions, enhancing the visual appeal and providing a polished experience.

Before taking the quiz, users see a dedicated instructions page to clarify the process. Additionally, a double confirmation step is included for the submit button to avoid accidental submissions, improving the application's reliability.The results page is straightforward, enabling users to review their answers alongside the correct responses for each question.

Why Next.js - Both frontend and backend can be handles from same repository and easy and better routing.

components built
1 - timer component
2 - sidebar component
3 - quiz component

Installation
1 - npm run build - to install the necessary packages and dependencies
2 - npm run dev - to run the project and open http://localhost:3000

Assumptions Made
- This is a test environment and user cannot open other routes untill the quiz is completed.
- The quiz responses are to be persistent as after every refresh the question set is changing.

Challenges Faced
- After every page refresh new API response is generated so I used local storage and useContext to get persistent storage and localStorage will be cleared once go home button is clicked after completing the quiz.
- The marking of seen, attempted was tough as I thought of using non-persistent method but later used the exisitng useContext and added
seenQuestions to mark the viewed questions by the user.

Bonus features Added
- Made it mobile responsive
- Added framer motion transition for the question navigation similar to typeform.
- Persistent quiz data it will sustain page refreshes with help of local storage.



