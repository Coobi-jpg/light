
class GameLogic {
    constructor(size = 3) {
        this.size = size;
        this.resetGame();
    }
    
    resetGame(triesAllowed = 9) {
        this.board = Array.from({ length: this.size * this.size }, () => Math.random() >= 0.5);
        this.tries = 0;
        this.triesAllowed = triesAllowed;
    }
    toggleLight(x, y) {
        const index = x * this.size + y;
        const indicesToToggle = new Set();
        if (x === 2 && y === 0) {  // 左下角
            indicesToToggle.add(3); // 左边这一列中间格子
            indicesToToggle.add(6); // 左下的格子
            indicesToToggle.add(7); // 最下面一行中间的格子
        } else if (x === 0 && y === 2) { // 右上角
            indicesToToggle.add(5); // 右边这一列中间格子
            indicesToToggle.add(2); // 右上的格子
            indicesToToggle.add(1); // 最上面一行中间的格子
        } else if (x === 1 && y === 0) { // 左边这一列中间的格子
            indicesToToggle.add(3); // 左边这一列中间格子
            indicesToToggle.add(6); // 左下的格子
            indicesToToggle.add(0); // 左上的格子
            indicesToToggle.add(4); // 最中间的格子
        } else if (x === 1 && y === 2) { // 右边这一列中间的格子
            indicesToToggle.add(5); // 右边这一列中间格子
            indicesToToggle.add(8); // 右下的格子
            indicesToToggle.add(2); // 右上的格子
            indicesToToggle.add(4); // 最中间的格子
        } else {
            indicesToToggle.add(index); // 自身
            if (x > 0) indicesToToggle.add(index - this.size); // 上
            if (x < this.size - 1) indicesToToggle.add(index + this.size); // 下
            if (y > 0) indicesToToggle.add(index - 1); // 左
            if (y < this.size - 1) indicesToToggle.add(index + 1); // 右
        }
        
        indicesToToggle.forEach(i => {
            if (i >= 0 && i < this.size * this.size) {
                this.board[i] = !this.board[i];
            }
        });
        
        this.tries++;
    }
    checkWin() {
        return this.board.every(light => light);
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
            button.textContent = light ? '💡' : '';
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
        document.getElementById('game-status').textContent = ""; // 清除成功或失败的消息
        this.gameLogic.resetGame(tries);
        this.gameUI.updateUI();
    }
    startNewGame() {
        this.gameLogic.resetGame();
        this.gameUI.updateUI();
    }
}
const gameController = new GameController();
