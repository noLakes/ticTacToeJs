
const DOM = (function() {

  return {
    boardContainer : document.querySelector('.board'),
    cells : document.querySelectorAll('.cell'),
    playButton : document.querySelector('.play'),
    newGameButton : document.querySelector('.new-game'),
    
    p1Name : document.querySelector('.player1 .name'),
    p2Name : document.querySelector('.player2 .name'),
    humanityButtons : document.querySelectorAll('.humanity button'),

    updateBoard() {
      GameBoard.getBoard().forEach((cell, idx) => {
        this.cells[idx].innerHTML = cell.mark;
      })
    },

    emptyCells() {
      return [...this.cells].filter(cell => cell.innerHTML === '');
    },

    switchActive(element) {
      element.classList.add('active');
      if(element.nextElementSibling) {
        element.nextElementSibling.classList.remove('active');
      }
      if(element.previousElementSibling) {
        element.previousElementSibling.classList.remove('active');
      }
    },

  }
})();

const GameBoard = (function() {

  // array containing actual board
  const board = []

  // cell factory function
  const cell = function(mark) {
    if(!mark) mark = '';
    return {mark};
  }
  
  return {
    
    // returns board array
    getBoard() { return board },

    getCell(idx) { return board[idx] },
    
    // clears board and fills with 9 blank cells
    newBoard() {
      board.length = 0;
      for (i = 0; i < 9; i++) {
        board.push(cell());
      }
    },

    fillCell(index, mark) {
      board[index].mark = mark;
    },

  }
})();

// turn logic, win conditions and players
const Game = (function () {

  // game logic variables
  let state = false;
  let turn = 1;

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const checkWin = () => {
    let result = false;
    wins.forEach(condition => {
      const marks = condition.map(idx => GameBoard.getCell(idx).mark);
      if(marks.every(m => m === 'X') || marks.every(m => m === 'O')) {
        result = marks[0];
      }
    });
    
    if(!result && DOM.emptyCells().length === 0) { result = 'draw'};
  
    return result;
  }
  
  // player factory function
  const newPlayer = (name = 'Player', mark = 'X', human = true) => {
    return {name, mark, human}
  }

  const players = {
    1 : newPlayer('Player1', 'X', true),
    2 : newPlayer('Player2', 'O', true),
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const nextTurn = () => {
    const result = checkWin();
    if(result) { 
      endGame(result);
      return;
    };
    turn = (turn === 1) ? 2 : 1;
    // check if current player is bot - make bot move if true
    if(!players[turn].human) getBotMove();
  }

  const enterMove = (e) => {
    if(e.target.innerHTML !== '') return;
    GameBoard.fillCell(e.target.dataset.idx, players[turn].mark);
    DOM.updateBoard();
    nextTurn();
  }

  const getBotMove = async () => {
    await sleep(1000);
    validCells = DOM.emptyCells();
    move = validCells[Math.floor(Math.random() * validCells.length)];
    GameBoard.fillCell(move.dataset.idx, players[turn].mark);
    DOM.updateBoard();
    nextTurn();
  }

  const toggleHuman = (e) => {
    if(e.target.classList.contains('active')) return;
    playerNum = e.target.dataset.pnum;
    players[playerNum].human = !players[playerNum].human;
    DOM.switchActive(e.target);
  }

  // adds event listeners to each DOM cell element
  DOM.cells.forEach(cell => {
    cell.addEventListener('click', enterMove);
  });

  DOM.humanityButtons.forEach(button => {
    button.addEventListener('click', toggleHuman);
  });

  const endGame = (result) => {
    switch(result) {
      case players[1].mark:
        alert(`Game over! ${players[1].name} (${players[1].mark}) wins!`);
        break;
      case players[2].mark:
        alert(`Game over! ${players[2].name} (${players[2].mark}) wins!`);
        break;
      case 'draw':
        alert("Game over! It's a draw");
        break;
    }
    resetGame();
  }

  const resetGame = () => {
    GameBoard.newBoard();
    DOM.updateBoard();
    turn = 1;
    if(players[turn].human === false) { getBotMove() };
  }
  
  return {

    getPlayer(playerNum) {
      return players[playerNum];
    }

  }
})();

//test code
GameBoard.newBoard();
DOM.updateBoard();
