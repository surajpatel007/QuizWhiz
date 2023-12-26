const userName = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");

const mostRecentScore = localStorage.getItem("mostRecentScore");
finalScore.innerText = `Your Score : ${mostRecentScore}`;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
console.log(highScores);

userName.addEventListener('keyup', () => {
    saveScoreBtn.disabled  = !userName.value;
})

saveHighScore = e => {
  e.preventDefault();

  const score = {
    score : mostRecentScore,
    name : userName.value
};

highScores.push(score);
highScores.sort( (a,b) => b.score - a.score);
highScores.splice(5);

//update the high scores in local storage
localStorage.setItem("highScores", JSON.stringify(highScores));
window.location.assign("/");
}

