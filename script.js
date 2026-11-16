const road = document.getElementById('road');
const playerCar = document.getElementById('player-car');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let playerX = 145;
const playerSpeed = 25;
const roadWidth = 334; // Largura útil da pista (350px - 16px das bordas)
const carWidth = 45;

let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let obstacleInterval;
let gameLoopId;

// Movimentação do jogador
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowLeft' && playerX > 10) {
        playerX -= playerSpeed;
    } else if (e.key === 'ArrowRight' && playerX < roadWidth - carWidth - 10) {
        playerX += playerSpeed;
    }
    playerCar.style.left = playerX + 'px';
});

// Cria um novo obstáculo
function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    // Posição horizontal aleatória dentro da pista
    const maxPos = roadWidth - carWidth;
    const randomX = Math.floor(Math.random() * maxPos);
    
    obstacle.style.left = randomX + 'px';
    obstacle.style.top = '-90px';
    road.appendChild(obstacle);
}

// Atualiza a posição dos obstáculos e verifica colisões
function updateGame() {
    if (isGameOver) return;

    const obstacles = document.querySelectorAll('.obstacle');
    const playerRect = playerCar.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        let top = parseInt(obstacle.style.top);
        top += gameSpeed;
        obstacle.style.top = top + 'px';

        // Verifica colisão
        const obsRect = obstacle.getBoundingClientRect();
        if (
            playerRect.left < obsRect.right &&
            playerRect.right > obsRect.left &&
            playerRect.top < obsRect.bottom &&
            playerRect.bottom > obsRect.top
        ) {
            endGame();
        }

        // Remove obstáculo que saiu da tela e soma pontos
        if (top > 600) {
            obstacle.remove();
            score += 10;
            scoreDisplay.innerText = 'Pontos: ' + score;

            // Aumenta a velocidade a cada 50 pontos
            if (score % 50 === 0) {
                gameSpeed += 1;
            }
        }
    });

    gameLoopId = requestAnimationFrame(updateGame);
}

function endGame() {
    isGameOver = true;
    clearInterval(obstacleInterval);
    cancelAnimationFrame(gameLoopId);
    road.style.animationPlayState = 'paused';
    finalScoreDisplay.innerText = 'Sua pontuação: ' + score;
    gameOverScreen.classList.remove('hidden');
}

function startGame() {
    // Reseta variáveis
    isGameOver = false;
    score = 0;
    gameSpeed = 5;
    playerX = 145;
    playerCar.style.left = playerX + 'px';
    scoreDisplay.innerText = 'Pontos: 0';
    gameOverScreen.classList.add('hidden');
    road.style.animationPlayState = 'running';

    // Remove obstáculos antigos
    document.querySelectorAll('.obstacle').forEach(obs => obs.remove());

    // Inicia loops
    obstacleInterval = setInterval(createObstacle, 1200);
    gameLoopId = requestAnimationFrame(updateGame);
}

restartBtn.addEventListener('click', startGame);

// Inicia o jogo automaticamente ao carregar
startGame();
