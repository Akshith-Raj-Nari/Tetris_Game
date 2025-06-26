// src/components/TetrisGame.jsx
import { useState } from "react";
import GameBoard from "./GameBoard";
import Tetromino from "./Tetromino";

export default function TetrisGame() {
  const [grid, setGrid] = useState(
    Array(20)
      .fill(null)
      .map(() => Array(10).fill(0))
  );

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <GameBoard board={grid} />
      <Tetromino grid={grid} setGrid={setGrid} />
    </div>
  );
}
