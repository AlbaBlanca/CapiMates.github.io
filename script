// Variables d'estat de la sessió
let selectedOps = [];
let currentQuestion = 1;
const totalQuestions = 10;
let score = 0;
let correctAnswer = 0;
let currentAnswerStr = "";

// Elements del DOM
const screenStart = document.getElementById('screen-start');
const screenGame = document.getElementById('screen-game');
const screenResults = document.getElementById('screen-results');
const userAnswerDisplay = document.getElementById('user-answer');
const feedbackMessage = document.getElementById('feedback-message');
const progressText = document.getElementById('progress-text');

// Navegació
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Iniciar Joc
document.getElementById('btn-start').addEventListener('click', () => {
    selectedOps = [];
    if(document.getElementById('op-add').checked) selectedOps.push('+');
    if(document.getElementById('op-sub').checked) selectedOps.push('-');
    if(document.getElementById('op-mul').checked) selectedOps.push('*');
    if(document.getElementById('op-div').checked) selectedOps.push('/');

    if (selectedOps.length === 0) {
        alert("Si us plau, selecciona almenys una operació.");
        return;
    }

    currentQuestion = 1;
    score = 0;
    generateQuestion();
    showScreen(screenGame);
});

// Generar Operació Matemàtica
function generateQuestion() {
    currentAnswerStr = "";
    userAnswerDisplay.textContent = "?";
    feedbackMessage.textContent = "";
    progressText.textContent = `Activitat ${currentQuestion} de ${totalQuestions}`;

    const op = selectedOps[Math.floor(Math.random() * selectedOps.length)];
    let num1, num2;

    // Generació simple adaptada per a edats de 10 anys
    switch(op) {
        case '+':
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
            correctAnswer = num1 + num2;
            document.getElementById('operator').textContent = '+';
            break;
        case '-':
            num1 = Math.floor(Math.random() * 90) + 20;
            num2 = Math.floor(Math.random() * (num1 - 10)) + 10; // Assegura resultat positiu
            correctAnswer = num1 - num2;
            document.getElementById('operator').textContent = '-';
            break;
        case '*':
            num1 = Math.floor(Math.random() * 9) + 2;
            num2 = Math.floor(Math.random() * 9) + 2;
            correctAnswer = num1 * num2;
            document.getElementById('operator').textContent = 'x';
            break;
        case '/':
            num2 = Math.floor(Math.random() * 9) + 2;
            correctAnswer = Math.floor(Math.random() * 9) + 2;
            num1 = num2 * correctAnswer; // Assegura divisió exacta
            document.getElementById('operator').textContent = '÷';
            break;
    }

    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;
}

// Lògica del teclat numèric
document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const val = e.target.textContent;

        if (val === "Esborrar") {
            currentAnswerStr = "";
            userAnswerDisplay.textContent = "?";
        } else if (val === "Ok") {
            checkAnswer();
        } else {
            if (currentAnswerStr.length < 4) { // Evita nombres massa llargs
                currentAnswerStr += val;
                userAnswerDisplay.textContent = currentAnswerStr;
            }
        }
    });
});

// Validació i Andamiatge
function checkAnswer() {
    if (currentAnswerStr === "") return;

    const numAnswer = parseInt(currentAnswerStr);
    
    if (numAnswer === correctAnswer) {
        score++;
        feedbackMessage.style.color = "var(--primary-color)";
        feedbackMessage.textContent = "Molt bé! Correcte.";
        setTimeout(nextQuestion, 1500); // Passa a la següent ràpid si és correcte
    } else {
        feedbackMessage.style.color = "var(--error-color)";
        feedbackMessage.textContent = `Ups! La resposta era ${correctAnswer}. Endavant amb la següent!`;
        currentAnswerStr = "";
        setTimeout(nextQuestion, 2500); // Dona més temps per processar l'error
    }
}

// Gestió del flux del joc
function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        generateQuestion();
    } else {
        finishGame();
    }
}

// Pantalla final i càlcul del 80% per superar el nivell
function finishGame() {
    document.getElementById('final-score').textContent = score;
    const resultMessage = document.getElementById('result-message');
    
    // Els usuaris han d'obtenir almenys un 80 per cent per passar al següent nivell
    if (score >= 8) {
        resultMessage.textContent = "Fantàstic! Has superat el nivell.";
        resultMessage.style.color = "var(--primary-color)";
    } else {
        resultMessage.textContent = "Bona feina! Una mica més de pràctica i ho aconseguiràs.";
        resultMessage.style.color = "var(--text-color)";
    }
    showScreen(screenResults);
}

// Bucle per reiniciar
document.getElementById('btn-restart').addEventListener('click', () => {
    showScreen(screenStart);
});
