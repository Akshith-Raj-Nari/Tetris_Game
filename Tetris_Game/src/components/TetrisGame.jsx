import { useState, useEffect, useRef } from "react";
import GameBoard from "./GameBoard";
import Tetromino from "./Tetromino";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

function mergeShapeIntoGrid(grid, shape, position, color) {
  const newGrid = grid.map((row) => [...row]);
  if (!shape) return newGrid;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        if (
          newY >= 0 &&
          newY < newGrid.length &&
          newX >= 0 &&
          newX < newGrid[0].length
        ) {
          newGrid[newY][newX] = color;
        }
      }
    }
  }

  return newGrid;
}

export default function TetrisGame() {
  const [grid, setGrid] = useState(
    Array(20)
      .fill(null)
      .map(() => Array(10).fill(0))
  );
  const [shape, setShape] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [color, setColor] = useState("#000");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const modalRef = useRef(null);

  // Show Bootstrap modal on game over
  useEffect(() => {
    if (gameOver && modalRef.current) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();
    }
  }, [gameOver]);

  const handleRestart = () => {
    setGrid(
      Array(20)
        .fill(null)
        .map(() => Array(10).fill(0))
    );
    setShape(null);
    setPosition({ x: 4, y: 0 });
    setColor("#000");
    setScore(0);
    setGameOver(false);
  };

  const clearLines = (updatedGrid) => {
    const newGrid = updatedGrid.filter((row) => row.some((cell) => cell === 0));
    const linesCleared = 20 - newGrid.length;

    // Add empty rows at the top
    for (let i = 0; i < linesCleared; i++) {
      newGrid.unshift(Array(10).fill(0));
    }

    const pointsTable = { 1: 100, 2: 300, 3: 500, 4: 800 };
    if (linesCleared > 0) {
      setScore(
        (prev) => prev + (pointsTable[linesCleared] || linesCleared * 100)
      );
    }

    return newGrid;
  };

  const mergedGrid = mergeShapeIntoGrid(grid, shape, position, color);

  return (
    <div className="container text-center mt-4 d-flex">
      <h2 className="mb-3">Score: {score}</h2>
      <div className="d-flex justify-content-center">
        <GameBoard board={mergedGrid} />
      </div>

      <Tetromino
        grid={grid}
        setGrid={setGrid}
        shape={shape}
        setShape={setShape}
        position={position}
        setPosition={setPosition}
        color={color}
        setColor={setColor}
        clearLines={clearLines}
        setGameOver={setGameOver}
      />

      {/* Game Over Modal */}
      <div
        className="modal fade"
        id="gameOverModal"
        tabIndex="-1"
        aria-labelledby="gameOverModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h5 className="modal-title" id="gameOverModalLabel">
                Game Over
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="lead">
                Your score: <strong>{score}</strong>
              </p>
              <button
                className="btn btn-primary"
                onClick={handleRestart}
                data-bs-dismiss="modal"
              >
                Restart Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
