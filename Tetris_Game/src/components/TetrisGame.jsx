import { useState, useEffect, useRef } from "react";
import GameBoard from "./GameBoard";
import Tetromino from "./Tetromino";
import LeaderBoard from "./LeaderBoard";
import "../css/TetrisGame.css";

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
    let modal;
    if (gameOver && modalRef.current) {
      modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();

      // Listen for modal close (not via Save & Restart)
      const handleHidden = () => {
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

      modalRef.current.addEventListener("hidden.bs.modal", handleHidden);

      // Cleanup
      return () => {
        modalRef.current.removeEventListener("hidden.bs.modal", handleHidden);
      };
    }
  }, [gameOver]);

  const handleRestart = async () => {
    const name = document.getElementById("name").value;
    setUpdateLeaderboard((prev) => !prev); // ensures it changes each time
    // Only send if valid
    if (name && score > 0) {
      try {
        const response = await fetch("http://localhost:8080/addscore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, score }),
        });

        const result = await response.json();
        if (result.status) {
          console.log("Score saved successfully:", result);
        } else {
          alert(result.message || "Failed to save score");
        }
      } catch (error) {
        console.error("Error sending score:", error);
        alert("Error sending score to server");
      }
    }

    // Reset game state
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

    // Close modal
    if (modalRef.current) {
      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    }
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
  const [updateLeaderboard, setUpdateLeaderboard] = useState(false);

  return (
    <div className="container py-3">
      <div className="row g-4 justify-content-center">
        <div
          className="col-12 col-sm-10 col-md-6 col-lg-5 order-1 order-lg-1"
          style={{ minWidth: "max-content" }}
        >
          <div className="card shadow-sm card-body-tetris">
            <div className="card-body">
              <h2 className="card-title text-center mb-3">
                <span className="score-badge badge bg-primary">
                  Score: {score}
                </span>
              </h2>
              <div className="game-area d-flex justify-content-center align-items-start">
                <GameBoard board={mergedGrid} />
                <div className="ms-3" style={{ minWidth: "max-content" }}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Leaderboard</h4>
              <LeaderBoard toggle={updateLeaderboard} />
            </div>
          </div>
        </div>
      </div>

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
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Enter your Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Your name"
                  autoFocus
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleRestart}
                data-bs-dismiss="modal"
              >
                Save & Restart Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
