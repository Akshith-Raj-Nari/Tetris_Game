// import React from "react";
import useLeaderboardData from "../hooks/useLeaderboardData";
import "../css/LeaderBoard.css";

export default function LeaderBoard({ toggle }) {
  const { scores, loading } = useLeaderboardData(toggle);

  return (
    <div className="leaderboard-container mt-4">
      <h4>Leaderboard</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={3}>No scores yet.</td>
              </tr>
            ) : (
              scores.map((entry, idx) => (
                <tr key={entry._id + entry.score + idx}>
                  <td>{idx + 1}</td>
                  <td>{entry._id}</td>
                  <td>{entry.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
