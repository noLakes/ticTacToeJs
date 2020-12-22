
const DOM = (function() {
  return {
    boardContainer : document.querySelector('.board'),
    cells : document.querySelectorAll('.cell'),

    updateBoard : function() {
      GameBoard.getBoard().forEach((cell, idx) => {
        this.cells[idx].innerHTML = cell.mark;
      })
    },

  }
})();

const GameBoard = (function() {
  // private

  // array containing actual board
  const board = []

  // cell factory function
  const cell = function(mark) {
    if(!mark) mark = '';
    return {mark};
  }
  
  return {
    
    // returns board array
    getBoard : () => { return board },
    
    // clears board and fills with 9 blank cells
    newBoard : () => {
      board.length = 0;
      for (i = 0; i < 9; i++) {
        board.push(cell(`${i}`));
      }
    },


  }
})();

// turn logic, win conditions and players
const Game = (function () {
  return {

  }
})();

const newPlayer = (name, mark, human) => {
  
  return {name, mark, human}
}

//test code
GameBoard.newBoard();
DOM.updateBoard();
const shan = newPlayer('Shan', 'X', true);