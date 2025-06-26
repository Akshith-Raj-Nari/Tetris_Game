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

  const generateShape = () => {
    const shapeNames = Object.keys(tetrominoShapes);
    const randomName =
      shapeNames[Math.floor(Math.random() * shapeNames.length)];
    setShape(tetrominoShapes[randomName]);
    setColor(shapeColors[randomName]);
    setPosition({ x: 3, y: 0 });
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
    setGrid(newGrid);
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

  const drop = () => move(0, 1);
  const moveLeft = () => move(-1, 0);
  const moveRight = () => move(1, 0);

  // Auto-drop when falling
  useEffect(() => {
    if (isActive && isFalling && shape) {
      const interval = setInterval(() => {
        move(0, 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [shape, position, isActive, isFalling]);

  return (
    <div className="tetromino-panel">
      <h2>Tetromino Controls</h2>
      <div className="tetromino-controls">
        <button onClick={start}>Start</button>
        <button onClick={drop}>Drop</button>
        <button onClick={rotate}>Rotate</button>
        <button onClick={moveLeft}>←</button>
        <button onClick={moveRight}>→</button>
        <button onClick={stop}>Reset</button>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <p>
          Position: ({position.x}, {position.y})
        </p>
        <p>Active: {isActive.toString()}</p>
      </div>
    </div>
  );
}
