const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
console.log(choices);

const questionCounterText =  document.getElementById("question-counter");
const scoreText = document.getElementById("score");

const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

//here if we want we can put this questions array in a seperate file questions.json
// [
//     {
//       "question": "Inside which HTML element do we put the JavaScript??",
//       "choice1": "<script>",
//       "choice2": "<javascript>",
//       "choice3": "<js>",
//       "choice4": "<scripting>",
//       "answer": 1
//     },
//     other questions
// ]  

// And then we can you fetch() to call that file and get the values
// let questions = [];

// fetch('questions.json')
//     .then((res) => {
//         return res.json();
//     })
//     .then((loadedQuestions) => {
//         questions = loadedQuestions;
//         startGame();
//     })
//     .catch((err) => {
//         console.error(err);
//     });

//same thing we going to do using external api

fetch('https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple')
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);

        questions = loadedQuestions.results.map(loadedQuestion => {
            
           const formattedQuestion = {

                question : loadedQuestion.question,

            }; 

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            //this above line will add answer key with value a random no. b/w [0,1] in formattedQuestion like answer : [0,3]
           //now we will get the correct answer and add inside this answerChoices array randomply

           answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

           //now we are going to loop through answerChoices
           answerChoices.forEach((choice, index) => {
            formattedQuestion['choice'+ (index+1)] = choice;
           });

           console.log(formattedQuestion);
           return formattedQuestion;
        });

        // game.classList.remove('hidden');
        // loader.classList.add("hidden");

        startGame();
    })
    .catch((err) => {
          console.error(err);
    });



//constants

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add("hidden");
};

getNewQuestion = () => {

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        console.log("availableQuestions.length => "+availableQuestions.length)

        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        return window.location.assign('/end.html');
    }

    questionCounter++;

    questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;
    //`${questionCounter}/${MAX_QUESTIONS}`, using template literals also we can do

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    console.log(currentQuestion);
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        console.log(number);// 1, 2, ..
        choice.innerText = currentQuestion['choice' + number];
        console.log(currentQuestion['choice' + number]);// msgBox('Hello World'), alertBox('Hello World'),..
        
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;

}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;

        const selectedChoice = e.target;
        console.log(selectedChoice);

        const selectedAnswer = selectedChoice.dataset['number'];
        console.log(selectedAnswer);

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        console.log(classToApply);  

        if(classToApply === "correct"){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
        
        
    })
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

