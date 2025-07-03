// hooks/useLeaderboardData.js
import { useState, useEffect } from "react";

export default function useLeaderboardData(trigger) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    import("axios").then(({ default: axios }) => {
      axios
        .get(
          "https://scoreboardservice-production-3ceb.up.railway.app/fetchscore",
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        )
        .then((res) => setScores(res.data.data || []))
        .catch(() => setScores([]))
        .finally(() => setLoading(false));
    });
  }, [trigger]);

  return { scores, loading };
}
// This hook fetches leaderboard data from the server and returns it along with a loading state.
