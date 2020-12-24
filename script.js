
const DOM = (function() {
  return {
    boardContainer : document.querySelector('.board'),
    cells : document.querySelectorAll('.cell'),
    newGameButton : document.querySelector('.new-game'),
    
    player1 : {
      name : document.querySelector('.player1 .name span'),
      mark : document.querySelector('.player1 .mark span'),
      humanity : document.querySelector('.player1 .humanity'),
    },

    player2 : {
      name : document.querySelector('.player2 .name span'),
      mark : document.querySelector('.player2 .mark span'),
      humanity : document.querySelector('.player2 .humanity'),
    },

    updateBoard() {
      GameBoard.getBoard().forEach((cell, idx) => {
        this.cells[idx].innerHTML = cell.mark;
      })
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
        board.push(cell(`${i}`));
      }
    },


  }
})();

// turn logic, win conditions and players
const Game = (function () {

  // player factory function
  const newPlayer = (name = 'Player', mark = 'X', human = true) => {
    return {
      name,
      mark,
      human,
    }
  }
  
  return {
    players : {
      1 : newPlayer('Player1', 'X', true),
      2 : newPlayer('Player2', 'O', true),
    },
    
  }
})();

//test code
GameBoard.newBoard();
DOM.updateBoard();
