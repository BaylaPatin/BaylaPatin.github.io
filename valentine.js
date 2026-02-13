document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const mainTitle = document.querySelector('h1');

    // Game Elements
    const gameOverlay = document.getElementById('gameOverlay');
    const gameMessage = document.getElementById('gameMessage');
    const scoreDisplay = document.getElementById('score');
    const heartTarget = document.getElementById('heartTarget');
    const wordleGame = document.getElementById('wordleGame');
    const wordleGrid = document.getElementById('wordleGrid');
    const keyboardContainer = document.getElementById('keyboard');

    // Heart Game Vars
    let score = 0;
    const winningScore = 5;

    // Wordle Vars
    const targetWord = "HEART";
    const rows = 6;
    const cols = 5;
    let currentRow = 0;
    let currentCol = 0;
    let currentGuess = "";

    // Start Game on "Yes" click
    yesBtn.addEventListener('click', () => {
        gameOverlay.style.display = 'flex';
        startGame();
    });

    function startGame() {
        score = 0;
        updateScore();
        moveHeart();
    }

    function moveHeart() {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - 100) + 50;
        heartTarget.style.left = `${x}px`;
        heartTarget.style.top = `${y}px`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}/${winningScore}`;
    }

    // Heart Click Handler
    heartTarget.addEventListener('click', () => {
        score++;
        updateScore();

        if (score >= winningScore) {
            startWordle();
        } else {
            moveHeart();
        }
    });

    function startWordle() {
        // Hide Heart Game UI
        gameMessage.style.display = 'none';
        scoreDisplay.style.display = 'none';
        heartTarget.style.display = 'none';

        // Show Wordle UI
        wordleGame.style.display = 'flex';
        createGrid();
        createKeyboard();

        // Listen for keys
        document.addEventListener('keydown', handleKeypress);
    }

    function createGrid() {
        for (let i = 0; i < rows * cols; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `tile-${i}`;
            wordleGrid.appendChild(tile);
        }
    }

    function createKeyboard() {
        const keys = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];

        keys.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('keyboard-row');

            if (rowIndex === 2) {
                // Enter Key
                const enterKey = document.createElement('button');
                enterKey.textContent = 'ENTER';
                enterKey.classList.add('key', 'big');
                enterKey.onclick = () => handleInput('ENTER');
                rowDiv.appendChild(enterKey);
            }

            row.split('').forEach(char => {
                const key = document.createElement('button');
                key.textContent = char;
                key.classList.add('key');
                key.id = `key-${char}`;
                key.onclick = () => handleInput(char);
                rowDiv.appendChild(key);
            });

            if (rowIndex === 2) {
                // Backspace Key
                const backKey = document.createElement('button');
                backKey.textContent = '⌫';
                backKey.classList.add('key', 'big');
                backKey.onclick = () => handleInput('BACKSPACE');
                rowDiv.appendChild(backKey);
            }

            keyboardContainer.appendChild(rowDiv);
        });
    }

    function handleKeypress(e) {
        if (wordleGame.style.display === 'none') return; // Specific checks
        const key = e.key.toUpperCase();
        if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
            handleInput(key);
        }
    }

    function handleInput(key) {
        if (key === 'BACKSPACE') {
            if (currentGuess.length > 0) {
                currentGuess = currentGuess.slice(0, -1);
                updateGrid();
            }
        } else if (key === 'ENTER') {
            if (currentGuess.length === cols) {
                checkGuess();
            }
        } else if (currentGuess.length < cols && /^[A-Z]$/.test(key)) {
            currentGuess += key;
            updateGrid();
        }
    }

    function updateGrid() {
        const start = currentRow * cols;
        for (let i = 0; i < cols; i++) {
            const tile = document.getElementById(`tile-${start + i}`);
            tile.textContent = currentGuess[i] || '';
            tile.classList.toggle('active', i === currentGuess.length); // Visual cue?
        }
    }

    function checkGuess() {
        const guess = currentGuess;
        const start = currentRow * cols;

        // Simple checking logic (duplicates handled simply)
        for (let i = 0; i < cols; i++) {
            const tile = document.getElementById(`tile-${start + i}`);
            const letter = guess[i];
            const keyBtn = document.getElementById(`key-${letter}`);

            setTimeout(() => {
                if (letter === targetWord[i]) {
                    tile.classList.add('correct');
                    if (keyBtn) keyBtn.style.backgroundColor = '#6aaa64';
                } else if (targetWord.includes(letter)) {
                    tile.classList.add('present');
                    if (keyBtn && keyBtn.style.backgroundColor !== '#6aaa64') keyBtn.style.backgroundColor = '#c9b458';
                } else {
                    tile.classList.add('absent');
                    if (keyBtn) keyBtn.style.backgroundColor = '#787c7e';
                }
            }, i * 200); // Animation delay
        }

        if (guess === targetWord) {
            setTimeout(() => {
                endGame();
            }, (cols * 200) + 500);
        } else {
            currentRow++;
            currentGuess = "";
            if (currentRow >= rows) {
                alert(`The word was ${targetWord}! Refresh to try again.`);
            }
        }
    }

    function endGame() {
        gameOverlay.style.display = 'none';
        triggerFireworks();
        document.removeEventListener('keydown', handleKeypress);
    }

    function triggerFireworks() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        mainTitle.textContent = "Yay! Happy Valentine's Day! ❤️";
        yesBtn.style.transform = "scale(1.2)";
        noBtn.style.display = "none";
    }

    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
        noBtn.style.position = 'absolute';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    });
});
