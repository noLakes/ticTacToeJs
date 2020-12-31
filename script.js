
const DOM = (function() {

  return {
    boardContainer : document.querySelector('.board'),
    cells : document.querySelectorAll('.cell'),
    resetButton : document.querySelector('.reset'),
    
    playerNames : {
      1 : document.querySelector('.player1 .name'),
      2 : document.querySelector('.player2 .name'),
    },

    humanityButtons : document.querySelectorAll('.humanity button'),

    updateBoard() {
      GameBoard.getBoard().forEach((cell, idx) => {
        this.cells[idx].innerHTML = cell.mark;
      })
    },

    emptyCells() {
      return [...this.cells].filter(cell => cell.innerHTML === '');
    },

    switchActiveName(element) {
      element.classList.add('active');
      if (element === this.playerNames[1]) {
        this.playerNames[2].classList.remove('active');
      } else {
        this.playerNames[1].classList.remove('active');
      }
    },

    switchActiveHuman(element) {
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
  
  // player factory function
  const newPlayer = (name = 'Player', mark = 'X', human = true) => {
    return {name, mark, human}
  }

  const players = {
    1 : newPlayer('Player1', 'X', true),
    2 : newPlayer('Player2', 'O', true),
  }

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

  const nextTurn = () => {
    const result = checkWin();
    if(result) { 
      endGame(result);
      return;
    };
    turn = (turn === 1) ? 2 : 1;
    DOM.switchActiveName(DOM.playerNames[turn]);
    // check if current player is bot - make bot move if true
    if(!players[turn].human) getBotMove();
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    DOM.switchActiveHuman(e.target);
    if(Number(playerNum) === turn) { getBotMove() };
  }

  const enterMove = (e) => {
    if(e.target.innerHTML !== '') return;
    GameBoard.fillCell(e.target.dataset.idx, players[turn].mark);
    DOM.updateBoard();
    nextTurn();
  }

  const resetGame = () => {
    GameBoard.newBoard();
    DOM.updateBoard();
    turn = 1;
    DOM.switchActiveName(DOM.playerNames[turn]);
    if(players[turn].human === false) { getBotMove() };
  }

  // adds event listeners to each DOM cell element
  DOM.cells.forEach(cell => {
    cell.addEventListener('click', enterMove);
  });

  DOM.humanityButtons.forEach(button => {
    button.addEventListener('click', toggleHuman);
  });

  DOM.resetButton.addEventListener('click', resetGame);

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
  
  return {
    getPlayer(playerNum) {
      return players[playerNum];
    }
  }
})();

//test code
GameBoard.newBoard();
DOM.updateBoard();
