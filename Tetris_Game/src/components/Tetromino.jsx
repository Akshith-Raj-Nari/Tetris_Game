import { useState, useEffect } from "react";
import "../css/Tetromino.css";

// Tetromino shape definitions
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

export default function Tetromino({ grid, setGrid }) {
  const [shape, setShape] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [color, setColor] = useState("#000");
  const [isActive, setIsActive] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  // Rotate matrix (clockwise)
  const rotateMatrix = (matrix) => {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
  };

  const rotate = () => {
    if (!shape) return;
    const rotated = rotateMatrix(shape);
    if (!checkCollision(position, rotated)) {
      setShape(rotated);
    }
  };

  const moveLeft = () => {
    const nextPos = { ...position, x: position.x - 1 };
    if (!checkCollision(nextPos)) {
      setPosition(nextPos);
    }
  };

  const moveRight = () => {
    const nextPos = { ...position, x: position.x + 1 };
    if (!checkCollision(nextPos)) {
      setPosition(nextPos);
    }
  };

  const moveDown = () => {
    const nextPos = { ...position, y: position.y + 1 };
    if (!checkCollision(nextPos)) {
      setPosition(nextPos);
    } else {
      mergeToGrid();
      setIsFalling(false);
      generateShape();
    }
  };

  const generateShape = () => {
    const shapeNames = Object.keys(tetrominoShapes);
    const randomName =
      shapeNames[Math.floor(Math.random() * shapeNames.length)];
    setShape(tetrominoShapes[randomName]);
    setColor(shapeColors[randomName]);
    setPosition({ x: 4, y: 0 });
  };

  const checkCollision = (pos = position, mat = shape) => {
    if (!mat) return false;

    for (let y = 0; y < mat.length; y++) {
      for (let x = 0; x < mat[y].length; x++) {
        if (mat[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;

          // Wall or floor collision
          if (newX < 0 || newX >= grid[0].length || newY >= grid.length) {
            return true;
          }

          // Collision with placed blocks
          if (newY >= 0 && grid[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const drop = () => {
    if (!shape) return;
    setIsFalling(true); // this triggers `useEffect` auto drop every 500ms
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
            newY < grid.length &&
            newX >= 0 &&
            newX < grid[0].length
          ) {
            newGrid[newY][newX] = color;
          }
        }
      }
    }
    setGrid(newGrid);
  };

  const start = () => {
    setIsActive(true);
    setIsFalling(true);
    generateShape();
  };

  const stop = () => {
    setIsActive(false);
    setShape(null);
    setPosition({ x: 4, y: 0 });
    setColor("#000");
    setIsFalling(false);
    setGrid(
      Array(20)
        .fill(null)
        .map(() => Array(10).fill(0))
    );
  };

  // Auto-drop every 500ms when falling
  useEffect(() => {
    if (isActive && isFalling && shape) {
      const timer = setTimeout(() => {
        moveDown();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [position, isFalling, isActive]);

  return (
    <div className="tetromino-panel">
      <h2>Tetromino Component</h2>

      <div className="tetromino-controls">
        <button onClick={start}>Start</button>
        <button onClick={drop}>Drop</button>
        <button onClick={rotate}>Rotate</button>
        <button onClick={moveLeft}>←</button>
        <button onClick={moveRight}>→</button>
        <button onClick={stop}>Reset</button>
      </div>

      <div style={{ marginTop: "1rem", textAlign: "left" }}>
        <p>
          Position: ({position.x}, {position.y})
        </p>
        <p>Active: {isActive.toString()}</p>
      </div>

      <div className="tetromino-display">
        {shape &&
          shape.map((row, rowIndex) => (
            <div className="tetromino-row" key={rowIndex}>
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`tetromino-cell ${cell ? "tetromino-block" : ""}`}
                  style={{ color: color }}
                ></div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
// Note: The grid rendering and collision detection logic is simplified for clarity.
// In a complete Tetris game, you would need to handle line clearing, scoring, and more complex collision detection.
// This component is a basic implementation of Tetris mechanics and can be expanded further.
