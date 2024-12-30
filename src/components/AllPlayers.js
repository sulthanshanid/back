import React, { useEffect, useState } from "react";
import "./AllPlayers.css"; // Separate CSS file for styling

const AllPlayers = ({ auctionId }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auction/${auctionId}/players/`
        );
        const data = await response.json();
        setPlayers(data); // Assuming data is an array of players
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, [auctionId]);

  return (
    <div className="players-container">
      <h2 className="players-title">All Players</h2>
      {players.length === 0 ? (
        <p className="loading-text">Loading players...</p>
      ) : (
        <div className="players-grid">
          {players.map((player) => (
            <div key={player.id} className="player-card">
              <img
                src={`http://localhost:3000${player.photo_path}`}
                alt={player.name}
                className="player-photo"
              />
              <div className="player-info">
                <h3 className="player-name">{player.name}</h3>
                <p className={`status ${player.status}`}>{player.status}</p>
                <p className="base-price">Base Price: ${player.base_price}</p>
                <p className="current-bid">Current Bid: ${player.current_bid}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPlayers;
