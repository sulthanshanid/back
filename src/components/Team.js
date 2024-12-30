import React, { useEffect, useState } from "react";
import "./Team.css"; // Custom styles for responsive design and styling

const Team = ({ auctionId }) => {
  const [teams, setTeams] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null); // Track expanded team

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auctions/${auctionId}/teamstat`
        );
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [auctionId]);

  const toggleExpand = (teamId) => {
    setExpandedTeam((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <div className="team-container">
      <h2 className="team-title">Teams</h2>
      {teams.length === 0 ? (
        <p>Loading teams...</p>
      ) : (
        <table className="team-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Purse</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <React.Fragment key={team.id}>
                <tr className="team-row">
                  <td>
                    <img
                      src={`http://localhost:3000${
                        team.logo || "/default-logo.jpg"
                      }`}
                      alt={team.name}
                      className="team-logo"
                    />
                  </td>
                  <td>{team.name}</td>
                  <td className={team.purse < 0 ? "negative" : "positive"}>
                    ${team.purse.toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="expand-button"
                      onClick={() => toggleExpand(team.id)}
                    >
                      {expandedTeam === team.id ? "Collapse" : "Expand"}
                    </button>
                  </td>
                </tr>
                {expandedTeam === team.id && (
                  <tr className="player-row">
                    <td colSpan="4">
                      <div className="player-container">
                        {team.players.length === 0 ? (
                          <p>No players bought yet.</p>
                        ) : (
                          team.players.map((player) => (
                            <div key={player.id} className="player-card">
                              <img
                                src={`http://localhost:3000${player.photo_path}`}
                                alt={player.name}
                                className="player-photo"
                              />
                              <div className="player-details">
                                <p className="player-name">{player.name}</p>
                                <p className="player-position">
                                  {player.position}
                                </p>
                                <p className="player-base-price">
                                  Base Price: ${player.base_price.toFixed(2)}
                                </p>
                                <p className="player-current-bid">
                                  Current Bid: ${player.current_bid.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Team;
