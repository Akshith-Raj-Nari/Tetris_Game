import "../css/GameBoard.css";

export default function GameBoard({ board }) {
  return (
    <div className="container mt-3">
      <div className="board-wrapper">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row d-flex">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="board-cell d-flex align-items-center justify-content-center"
                style={{ backgroundColor: cell ? cell : "#fff" }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
