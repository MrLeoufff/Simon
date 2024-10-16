let sequence = [];
let playerSequence = [];
let level = 0;
let speed = 1000;
let username = '';
let timer;

const timeLimit = 5000;
const redButton = document.getElementById('red');
const blueButton = document.getElementById('blue');
const yellowButton = document.getElementById('yellow');
const greenButton = document.getElementById('green');
const startButton = document.getElementById('start-game');
const scoreBoard = document.getElementById('score-board');
const bestScoreBoard = document.getElementById('best-score');
const usernameInput = document.getElementById('username');
const scoresList = document.getElementById('scores-list');
const timerDisplay = document.getElementById('timer-display');

let playersScores = JSON.parse(localStorage.getItem('playersScores')) || [];
let bestScore = localStorage.getItem('bestScore') || 0;
let bestPlayer = localStorage.getItem('bestPlayer') || 'Unknown';

// Mise à jour du score
function updateScoresList() {
    scoresList.innerHTML = '';
    playersScores.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.username}: ${player.score}`;
        scoresList.appendChild(listItem);
    });
}

// Ajout d'un joueur
function addPlayerScore(username, score) {
    const existingPlayer = playersScores.find(player => player.username === username);

    if (existingPlayer) {
        if (score > existingPlayer.score) {
            existingPlayer.score = score;
        }
    } else {
        playersScores.push({ username, score });
    }

    localStorage.setItem('playersScores', JSON.stringify(playersScores));

    updateScoresList();

    checkBestScore(username, score);
}

updateScoresList();

const sounds = {
    red: new Audio('sounds/A.mp3'),
    blue: new Audio('sounds/B.mp3'),
    yellow: new Audio('sounds/C.mp3'),
    green: new Audio('sounds/D.mp3'),
    wrong: new Audio('sounds/gasp.mp3')
};

// Fonction pour allumer le bouton
function lightUp(button, color) {
    button.classList.add('active');
    sounds[color].play();
    setTimeout(() => {
        button.classList.remove('active');
    }, 500);
}

// Générer une couleur aléatoire
function getRandomColor() {
    const colors = ['red', 'blue', 'yellow', 'green'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Démarrer une nouvelle partie
startButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (!username) {
        alert('Veuillez entrer votre pseudo avant de commencer le jeu.');
        return;
    }
    resetGame();
    nextRound();
});

// Passer au round suivant
function nextRound() {
    level++;
    updateScore();
    playerSequence = [];
    const nextColor = getRandomColor();
    sequence.push(nextColor);
    adjustSpeed();
    playSequence();
}

// Mettre à jour le score affiché
function updateScore() {
    scoreBoard.textContent = `Score: ${level}`;
}

// Ajuster la vitesse du jeu
function adjustSpeed() {
    // speed = Math.max(300, 1000 - (level * 50));
    speed = 800;
}

// Jouer la séquence du Simon
function playSequence() {
    sequence.forEach((color, index) => {
        setTimeout(() => {
            const button = document.getElementById(color);
            lightUp(button, color);
        }, (index + 1) * speed);
    });

    setTimeout(() => {
        startTimer();
    }, sequence.length * speed);
}


redButton.addEventListener('click', () => handlePlayerClick('red'));
blueButton.addEventListener('click', () => handlePlayerClick('blue'));
yellowButton.addEventListener('click', () => handlePlayerClick('yellow'));
greenButton.addEventListener('click', () => handlePlayerClick('green'));

// Quand l'utilisateur clique sur une couleur
function handlePlayerClick(color) {
    clearTimeout(timer);
    const button = document.getElementById(color);
    lightUp(button, color);
    playerSequence.push(color);
    checkPlayerMove();

    if (playerSequence.length < sequence.length) {
        startTimer();
    }
}

// Vérifier si l'utilisateur a correctement suivi la séquence
function checkPlayerMove() {
    const currentMove = playerSequence.length - 1;
    if (playerSequence[currentMove] !== sequence[currentMove]) {
        clearTimeout(timer);
        sounds.wrong.play();
        alert(`Séquence incorrecte ! Jeu terminé. Votre score : ${level}`);
        addPlayerScore(username, level);
        resetGame();
    } else if (playerSequence.length === sequence.length) {
        clearTimeout(timer);
        setTimeout(nextRound, 1000);
    }
}

// Démarrer le timer pour les clics utilisateur
function startTimer() {
    clearTimeout(timer);
    let timeLeft = timeLimit / 1000;
    timerDisplay.textContent = `Temps restant: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Temps restant: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            sounds.wrong.play();
            alert(`Le temps est écoulé ! Jeu terminé, ${username}. Votre score: ${level}`);
            addPlayerScore(username, level);
            resetGame();
        }
    }, 1000);
}

// Réinitialiser la partie
function resetGame() {
    sequence = [];
    playerSequence = [];
    level = 0;
    speed = 800;
    updateScore();
    clearTimeout(timer);
}

// Gérer le meilleur score
function checkBestScore(username, score) {
    if (score > bestScore) {
        bestScore = score;
        bestPlayer = username;
        localStorage.setItem('bestScore', bestScore);
        localStorage.setItem('bestPlayer', bestPlayer);
        updateBestScore();
    }
}

updateScoresList();

// Mise à jour meilleur score
function updateBestScore() {
    bestScoreBoard.textContent = `Meilleure Score: ${bestScore} par ${bestPlayer}`;
}

document.getElementById('reset-scores').addEventListener('click', resetAllScores);

// Restaurer les scores enregistrer 
function resetAllScores() {
    playersScores = [];
    localStorage.removeItem('playersScores');
    localStorage.removeItem('bestScore');
    localStorage.removeItem('bestPlayer');
    updateScoresList();
    updateBestScore();
}
