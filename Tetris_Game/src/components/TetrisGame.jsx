import { useState } from "react";
import GameBoard from "./GameBoard";
import Tetromino from "./Tetromino";

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

  const clearLines = (updatedGrid) => {
    const newGrid = updatedGrid.filter(
      (row) => row.some((cell) => cell === 0) === true
    );
    const linesCleared = 20 - newGrid.length;

    // Add empty rows at the top
    for (let i = 0; i < linesCleared; i++) {
      newGrid.unshift(Array(10).fill(0));
    }

    // Update score based on number of lines cleared
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
    <div className="game-container" style={{ display: "flex" }}>
      <h2>Score: {score}</h2>
      <GameBoard board={mergedGrid} />
      <Tetromino
        grid={grid}
        setGrid={setGrid}
        shape={shape}
        setShape={setShape}
        position={position}
        setPosition={setPosition}
        color={color}
        setColor={setColor}
        clearLines={clearLines} // 🔥 pass clear function
      />
    </div>
  );
}
