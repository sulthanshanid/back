import React, { useEffect, useState } from "react";
import "./Leaderboard.css"; // Separate CSS file for better styling

const Leaderboard = ({ auctionId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/leaderboard/${auctionId}`
        );
        const data = await response.json();
        setLeaderboard(data); // Assuming data is an array of leaderboard entries
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [auctionId]);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p className="loading-text">Loading leaderboard...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Player Photo</th>
              <th>Player Name</th>
              <th>Team Logo</th>
              <th>Team Name</th>
              <th>Winning Bid (Current Bid)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => {
              const playerPhotoUrl = `${process.env.REACT_APP_API_URL}${entry.photo_path}`;
              const teamLogoUrl = `${process.env.REACT_APP_API_URL}${entry.logo}`;

              return (
                <tr key={index}>
                  <td className="player-photo-cell">
                    <img
                      src={playerPhotoUrl}
                      alt={entry.name}
                      className="player-photo"
                    />
                  </td>
                  <td>{entry.name}</td>
                  <td className="team-logo-cell">
                    <img
                      src={teamLogoUrl}
                      alt={entry.team}
                      className="team-logo"
                    />
                  </td>
                  <td>{entry.team}</td>
                  <td>{entry.current_bid}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
