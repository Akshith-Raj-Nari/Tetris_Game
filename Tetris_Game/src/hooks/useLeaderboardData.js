// hooks/useLeaderboardData.js
import { useState, useEffect } from "react";

export default function useLeaderboardData(trigger) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/fetchScore", {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => setScores(data.data || []))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [trigger]);

  return { scores, loading };
}
// This hook fetches leaderboard data from the server and returns it along with a loading state.
