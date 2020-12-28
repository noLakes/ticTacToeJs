
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
  
  // player factory function
  const newPlayer = (name = 'Player', mark = 'X', human = true) => {
    return {name, mark, human}
  }

  const players = {
    1 : newPlayer('Player1', 'X', true),
    2 : newPlayer('Player2', 'O', true),
  }

  const nextTurn = () => {
    // check win here
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

  const getBotMove = () => {
    // code for bot move (random for now)
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
  
  return {

    getPlayer(playerNum) {
      return players[playerNum];
    }

  }
})();

//test code
GameBoard.newBoard();
DOM.updateBoard();
