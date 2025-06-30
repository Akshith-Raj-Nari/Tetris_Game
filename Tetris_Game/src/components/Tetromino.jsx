import { useEffect, useState } from "react";
import "../css/Tetromino.css";

const tetrominoShapes = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const shapeColors = {
  I: "#00f",
  O: "#ff0",
  T: "#800080",
  S: "#0f0",
  Z: "#f00",
  J: "#00f",
  L: "#ffa500",
};

export default function Tetromino({
  grid,
  setGrid,
  shape,
  setShape,
  position,
  setPosition,
  color,
  setColor,
  clearLines,
  setGameOver = { setGameOver },
}) {
  const [isActive, setIsActive] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  // Rotate matrix clockwise
  const rotateMatrix = (matrix) =>
    matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());

  const checkCollision = (pos = position, mat = shape) => {
    if (!mat) return false;
    for (let y = 0; y < mat.length; y++) {
      for (let x = 0; x < mat[y].length; x++) {
        if (mat[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (
            newX < 0 ||
            newX >= grid[0].length ||
            newY >= grid.length ||
            (newY >= 0 && grid[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = () => {
    const rotated = rotateMatrix(shape);
    if (!checkCollision(position, rotated)) {
      setShape(rotated);
    }
  };

  const move = (dx, dy) => {
    const nextPos = { x: position.x + dx, y: position.y + dy };
    if (!checkCollision(nextPos)) {
      setPosition(nextPos);
    } else if (dy === 1) {
      // If it collides when moving down, lock the piece
      mergeToGrid();
      generateShape();
    }
  };

  // Generate a new random shape
  const generateShape = () => {
    const shapeNames = Object.keys(tetrominoShapes);
    const randomName =
      shapeNames[Math.floor(Math.random() * shapeNames.length)];
    const newShape = tetrominoShapes[randomName];
    const startPos = { x: 4, y: 0 };

    // Check collision before setting new shape
    const willCollide = checkCollision(startPos, newShape);
    if (willCollide) {
      // 💥 Game Over
      setIsActive(false);
      if (typeof setGameOver === "function") {
        setGameOver(true);
      }
      return;
    }

    setShape(newShape);
    setColor(shapeColors[randomName]);
    setPosition(startPos);
  };

  const mergeToGrid = () => {
    const newGrid = grid.map((row) => [...row]);
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
    const clearedGrid = clearLines(newGrid);
    setGrid(clearedGrid);
  };

  const start = () => {
    setIsActive(true);
    generateShape();
    setIsFalling(true);
  };

  const stop = () => {
    setIsActive(false);
    setIsFalling(false);
    setShape(null);
    setPosition({ x: 4, y: 0 });
    setColor("#000");
    setGrid(
      Array(20)
        .fill(null)
        .map(() => Array(10).fill(0))
    );
  };

  const drop = () => move(0, 2);
  const moveLeft = () => move(-1, 0);
  const moveRight = () => move(1, 0);
  function HardDrop() {
    let dropY = position.y;
    while (!checkCollision({ x: position.x, y: dropY + 1 })) {
      dropY++;
    }
    const mergedGrid = grid.map((row) => [...row]);
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = position.x + x;
          const newY = dropY + y;
          if (
            newY >= 0 &&
            newY < mergedGrid.length &&
            newX >= 0 &&
            newX < mergedGrid[0].length
          ) {
            mergedGrid[newY][newX] = color;
          }
        }
      }
    }
    const clearedGrid = clearLines(mergedGrid);
    setGrid(clearedGrid);
    setShape(null);
    setPosition({ x: 4, y: 0 });
    generateShape();
  }
  // Auto-drop when falling
  useEffect(() => {
    if (isActive && isFalling && shape) {
      const interval = setInterval(() => {
        move(0, 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [shape, position, isActive, isFalling]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive || !shape) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;

        case "a":
          e.preventDefault();
          moveLeft();
          break;

        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;

        case "d":
          e.preventDefault();
          moveRight();
          break;

        case "ArrowDown":
          e.preventDefault();
          drop(); // soft drop
          break;

        case "s":
          e.preventDefault();
          drop(); // soft drop
          break;

        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;

        case "w":
          e.preventDefault();
          rotate();
          break;

        case " ": {
          e.preventDefault();
          HardDrop(); // hard drop
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, shape, position, grid, color]);

  return (
    <div className="tetromino-panel container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 text-center">Tetromino Controls</h2>
        </div>
        <div className="card-body">
          <div className="rotate text-center mb-3">
            <button className="btn btn-warning" onClick={rotate}>
              Rotate
            </button>
          </div>
          <div
            className="left-right"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <div className="left">
              <button className="btn btn-secondary" onClick={moveLeft}>
                ←
              </button>
            </div>
            <div className="right">
              <button className="btn btn-secondary" onClick={moveRight}>
                →
              </button>
            </div>
          </div>
          <div className="drop text-center mt-3 mb-3">
            <button className="btn btn-info" onClick={HardDrop}>
              Drop
            </button>
          </div>
          <div className="start-stop d-flex justify-content-around">
            <div className="start">
              <button className="btn btn-success" onClick={start}>
                Start
              </button>
            </div>
            <div className="reset">
              <button className="btn btn-danger" onClick={stop}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
