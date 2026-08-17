let selectedOps = [];
let currentQuestion = 1;
const totalQuestions = 10;
let score = 0;
let correctAnswer = 0;
let currentAnswerStr = "";
let maxResultLimit = 100;

const screenStart = document.getElementById('screen-start');
const screenGame = document.getElementById('screen-game');
const screenResults = document.getElementById('screen-results');
const userAnswerDisplay = document.getElementById('user-answer');
const feedbackMessage = document.getElementById('feedback-message');
const progressText = document.getElementById('progress-text');
const gameMascot = document.getElementById('game-mascot');

// Generador de sons simples (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'error') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

document.getElementById('btn-start').addEventListener('click', () => {
    selectedOps = [];
    if(document.getElementById('op-add').checked) selectedOps.push('+');
    if(document.getElementById('op-sub').checked) selectedOps.push('-');
    if(document.getElementById('op-mul').checked) selectedOps.push('*');
    if(document.getElementById('op-div').checked) selectedOps.push('/');

    maxResultLimit = parseInt(document.getElementById('max-result').value) || 100;
    if (maxResultLimit < 10) maxResultLimit = 10;

    if (selectedOps.length === 0) {
        alert("Si us plau, selecciona almenys una operació.");
        return;
    }

    currentQuestion = 1;
    score = 0;
    generateQuestion();
    showScreen(screenGame);
});

function generateQuestion() {
    currentAnswerStr = "";
    userAnswerDisplay.textContent = "?";
    feedbackMessage.textContent = "";
    progressText.textContent = `Activitat ${currentQuestion} de ${totalQuestions}`;
    
    // Tornem a posar el Capibara en estat d'espera
    gameMascot.src = "capi.espera.png"; 
    gameMascot.className = "mascot-small"; // Reiniciem animacions

    const op = selectedOps[Math.floor(Math.random() * selectedOps.length)];
    let num1, num2;

    switch(op) {
        case '+':
            num1 = Math.floor(Math.random() * (maxResultLimit - 1)) + 1;
            num2 = Math.floor(Math.random() * (maxResultLimit - num1)) + 1;
            correctAnswer = num1 + num2;
            document.getElementById('operator').textContent = '+';
            break;
        case '-':
            num1 = Math.floor(Math.random() * maxResultLimit) + 1;
            num2 = Math.floor(Math.random() * num1); 
            correctAnswer = num1 - num2;
            document.getElementById('operator').textContent = '-';
            break;
        case '*':
            let maxFactor = Math.min(12, Math.floor(maxResultLimit / 2));
            num1 = Math.floor(Math.random() * (maxFactor - 1)) + 2;
            let maxFactor2 = Math.floor(maxResultLimit / num1);
            num2 = Math.floor(Math.random() * maxFactor2) + 1;
            correctAnswer = num1 * num2;
            document.getElementById('operator').textContent = 'x';
            break;
        case '/':
            let maxDivisor = Math.min(12, Math.floor(maxResultLimit / 2));
            num2 = Math.floor(Math.random() * (maxDivisor - 1)) + 2; 
            let maxRes = Math.floor(maxResultLimit / num2);
            correctAnswer = Math.floor(Math.random() * maxRes) + 1;
            num1 = num2 * correctAnswer;
            document.getElementById('operator').textContent = '÷';
            break;
    }

    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;
}

document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const val = e.target.textContent;

        if (val === "Esborrar") {
            currentAnswerStr = "";
            userAnswerDisplay.textContent = "?";
        } else if (val === "Ok!") {
            checkAnswer();
        } else {
            if (currentAnswerStr.length < 5) {
                currentAnswerStr += val;
                userAnswerDisplay.textContent = currentAnswerStr;
            }
        }
    });
});

function checkAnswer() {
    if (currentAnswerStr === "") return;

    const numAnswer = parseInt(currentAnswerStr);
    
    if (numAnswer === correctAnswer) {
        score++;
        playSound('success');
        // Capibara Content + Animació Salt
        gameMascot.src = "capi.content.png";
        gameMascot.classList.add('anim-bounce');
        feedbackMessage.style.color = "#4CAF50";
        feedbackMessage.textContent = "Genial!";
        setTimeout(nextQuestion, 1200); 
    } else {
        playSound('error');
        // Capibara Trist + Animació Tremolor
        gameMascot.src = "capi.trist.png";
        gameMascot.classList.add('anim-shake');
        feedbackMessage.style.color = "#F44336";
        feedbackMessage.textContent = `Era ${correctAnswer}. Seguim!`;
        currentAnswerStr = "";
        setTimeout(nextQuestion, 2500); 
    }
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        generateQuestion();
    } else {
        finishGame();
    }
}

function finishGame() {
    document.getElementById('final-score').textContent = score;
    const resultMessage = document.getElementById('result-message');
    const resultMascot = document.getElementById('result-mascot');
    
    if (score >= 8) {
        playSound('success');
        resultMascot.src = "capi.content.png"; // Feliç si supera el nivell
        resultMessage.textContent = "Nivell superat! Ets un/a crac!";
        resultMessage.style.color = "#4CAF50";
    } else {
        playSound('error');
        resultMascot.src = "capi.espera.png"; // Mode d'ànim per intentar-ho de nou (evitem posar-lo trist al final)
        resultMessage.textContent = "Bona feina! Segueix practicant i ho aconseguiràs.";
        resultMessage.style.color = "#FF8BA7";
    }
    showScreen(screenResults);
}

document.getElementById('btn-restart').addEventListener('click', () => {
    showScreen(screenStart);
});
