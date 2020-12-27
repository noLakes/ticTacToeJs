
const DOM = (function() {

  return {
    boardContainer : document.querySelector('.board'),
    cells : document.querySelectorAll('.cell'),
    playButton : document.querySelector('.play'),
    newGameButton : document.querySelector('.new-game'),
    
    player1 : {
      name : document.querySelector('.player1 .name'),
      human : document.querySelector('.player1 .human'),
      bot : document.querySelector('.player1 .bot'),
    },

    player2 : {
      name : document.querySelector('.player2 .name'),
      human : document.querySelector('.player2 .human'),
      bot : document.querySelector('.player2 .bot'),
    },

    updateBoard() {
      GameBoard.getBoard().forEach((cell, idx) => {
        this.cells[idx].innerHTML = cell.mark;
      })
    },

    emptyCells() {
      return [...this.cells].filter(cell => cell.innerHTML === '');
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
    
    // clears board and fills with 9 blank cells
    newBoard() {
      board.length = 0;
      for (i = 0; i < 9; i++) {
        board.push(cell());
      }
    },

    fillCell(index, mark) {
      board[index].mark = mark;
    }


  }
})();

// turn logic, win conditions and players
const Game = (function () {

  // game logic variables
  let state = false;
  let turn = 1;
  
  // player factory function
  const newPlayer = (name = 'Player', mark = 'X', human = true) => {
    return {name, mark, human}
  }

  const players = {
    1 : newPlayer('Player1', 'X', true),
    2 : newPlayer('Player2', 'O', true),
  }

  const toggleTurn = () => {
    turn = (turn === 1) ? 2 : 1;
  }

  const enterMove = (e) => {
    if(e.target.innerHTML !== '') return;
    GameBoard.fillCell(e.target.dataset.idx, players[turn].mark);
    DOM.updateBoard();
    toggleTurn();
  }

  DOM.cells.forEach(cell => {
    cell.addEventListener('click', enterMove);
  });
  
  return {
    
  }
})();

//test code
GameBoard.newBoard();
DOM.updateBoard();
