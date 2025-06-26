import "../css/GameBoard.css";
export default function GameBoard({ board }) {
  return (
    <>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="board-cell"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #ccc",
                  display: "inline-block",
                  backgroundColor: cell ? cell : "#fff",
                }}
              >
                {rowIndex},{cellIndex}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
