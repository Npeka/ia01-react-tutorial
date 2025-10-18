import { useState } from "react";

const BOARD_SIZE = 3;
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  };

  const gameResult = calculateWinner(squares);
  const getGameStatus = () => {
    if (gameResult) {
      return `Winner: ${gameResult.winner}`;
    }
    if (!squares.includes(null)) {
      return "Draw!";
    }
    return `Next player: ${xIsNext ? "X" : "O"}`;
  };

  const renderBoard = () => {
    const boardRows = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const boardCols = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const index = row * BOARD_SIZE + col;
        boardCols.push(
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            highlight={gameResult?.line.includes(index)}
          />
        );
      }
      boardRows.push(
        <div key={row} className="board-row">
          {boardCols}
        </div>
      );
    }
    return boardRows;
  };

  return (
    <>
      <div className="status">{getGameStatus()}</div>
      {renderBoard()}
    </>
  );
}

function calculateWinner(squares) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveLocations, setMoveLocations] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares, index) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const row = Math.floor(index / BOARD_SIZE) + 1;
    const col = (index % BOARD_SIZE) + 1;
    const nextMoveLocations = [
      ...moveLocations.slice(0, currentMove),
      { row, col },
    ];

    setMoveLocations(nextMoveLocations);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  const createMoveDescription = (move) => {
    if (move === 0) {
      return "Go to game start";
    }
    const location = moveLocations[move - 1];
    return `Go to move #${move} (${location.row}, ${location.col})`;
  };

  const renderMoveButton = (move, description) => {
    if (move === currentMove) {
      return <span>You are at move #{move}</span>;
    }
    return <button onClick={() => jumpTo(move)}>{description}</button>;
  };

  const moves = history.map((_, move) => {
    const description = createMoveDescription(move);
    return <li key={move}>{renderMoveButton(move, description)}</li>;
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <>
      <h1 className="app-title">IA01 React Tutorial</h1>
      <div className="game-container">
        <div className="game">
          <div className="game-board">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
            />
          </div>
          <div className="game-info">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isAscending}
                onChange={toggleSortOrder}
              />
              <span className="slider" />
              <span className="label-text">
                {isAscending ? "Ascending" : "Descending"}
              </span>
            </label>
            <ol>{sortedMoves}</ol>
          </div>
        </div>
      </div>
    </>
  );
}
