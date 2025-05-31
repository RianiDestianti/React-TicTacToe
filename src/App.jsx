import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) { 
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) return;

    const nextSquares = squares.slice(); 
    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo.winner;
  const winningLine = winnerInfo.line;
  
  let status = '';

  if (winner) {
    status = `🎉 Winner: ${winner}`;
  } else if (squares.every(square => square)) {
    status = '🤝 It\'s a tie!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="board-container">
      <div className={`status ${winner ? 'winner-status' : ''}`}>
        {status}
      </div>

      <div className='board'>
        {squares.map((square, i) => (
          <Square 
            key={i}
            value={square} 
            onSquareClick={() => handleClick(i)}
            isWinning={winningLine && winningLine.includes(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove]; 

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true);
  }
  
  const moves = history.map((squares, move) => { 
    let description = '';
    if (move > 0) {
      description = `Move #${move}`;
    } else {
      description = 'Game start';
    }

    return (
      <li key={move} className={move === currentMove ? 'current-move' : ''}>
        <button 
          className="move-button"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className="game-header">
        <h1>⚡ React Tic-Tac-Toe</h1>
        <button className="reset-button" onClick={resetGame}>
          🔄 New Game
        </button>
      </div>
      
      <div className="game-content">
        <div className='game-board'>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        
        <div className="game-info">
          <h3>Game History</h3>
          <div className="moves-container">
            <ol className="moves-list">{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

