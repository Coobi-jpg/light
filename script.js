class GameLogic {
    constructor(size = 3) {
        this.size = size;
        this.resetGame();
    }
    
    resetGame(triesAllowed = 9) {
        // Initialize board with random lights on
        this.board = Array.from({ length: this.size * this.size }, () => Math.random() >= 0.5);
        this.tries = 0;
        this.triesAllowed = triesAllowed;
    }
    toggleLight(x, y) {
        const index = x * this.size + y;
        const indicesToToggle = [
            index, index - 1, index + 1, index - this.size, index + this.size
        ];
        indicesToToggle.forEach(i => {
            if (i >= 0 && i < this.size * this.size) {
                this.board[i] = !this.board[i];
            }
        });
        this.tries++;
    }
    checkWin() {
        return this.board.every(light => !light);
    }
}
class GameUI {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
    }
    updateUI() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; 
        this.gameLogic.board.forEach((light, idx) => {
            const button = document.createElement('button');
            button.textContent = light ? '??' : '';
            button.onclick = () => {
                this.gameLogic.toggleLight(Math.floor(idx / this.gameLogic.size), idx % this.gameLogic.size);
                if(this.gameLogic.checkWin()) {
                    document.getElementById('game-status').textContent = "Congratulations! You've won!";
                } else if (this.gameLogic.tries >= this.gameLogic.triesAllowed) {
                    document.getElementById('game-status').textContent = "Sorry, you've reached the maximum tries!";
                }
                this.updateUI();
            };
            gameBoard.appendChild(button);
        });
        document.getElementById('tries-info').textContent = `Tries: ${this.gameLogic.tries}/${this.gameLogic.triesAllowed}`;
    }
}
class GameController {
    constructor() {
        this.gameLogic = new GameLogic();
        this.gameUI = new GameUI(this.gameLogic);
        this.setMode(9);
    }
    setMode(tries) {
        this.gameLogic.resetGame(tries);
        this.gameUI.updateUI();
    }
    startNewGame() {
        const seed = parseFloat(document.getElementById('seed-input').value);
        seed && this.gameLogic.resetGame();
        this.gameLogic.board = Array.from({ length: this.gameLogic.size * this.gameLogic.size },
            (_, i) => Math.random() < 0.5);
        this.gameUI.updateUI();
    }
}
const gameController = new GameController();
var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: "http://127.0.0.1:8080",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
