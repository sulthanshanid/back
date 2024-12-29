import React, { useEffect, useState } from "react";

const AuctionViewer = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [auctionLog, setAuctionLog] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    ws.onmessage = (message) => {

      const data = JSON.parse(message.data);
      console.log(data)
      switch (data.type) {
        case "players":
          setPlayers(data.players);
          setCurrentPlayer(data.players[0]);
          break;

        case "bid_update":
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === data.playerId
                ? { ...player, currentBid: data.bid }
                : player
            )
          );
          if (currentPlayer && currentPlayer.id === data.playerId) {
            setCurrentPlayer((prev) => ({ ...prev, currentBid: data.bid }));
          }
          setAuctionLog((prevLog) => [
            ...prevLog,
            `Player ${data.playerId} bid updated to ${data.bid}`,
          ]);
          break;

        case "status_update":
          setAuctionLog((prevLog) => [
            ...prevLog,
            `Player ${data.playerId} was ${data.status.toUpperCase()}`,
          ]);
          break;

        default:
          console.warn("Unhandled message type:", data.type);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [currentPlayer]);

  if (!currentPlayer) {
    return (
      <div className="text-center text-gray-500">Loading auction details...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-300">Live Auction Viewer</h1>

      {/* Current Player */}
      <div className="bg-gray-700 shadow-lg rounded-lg p-6 mb-8 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Current Player</h2>
        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:3000${currentPlayer.photo_path}`}
            alt={currentPlayer.name}
            className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-gray-500"
          />
          <div className="text-center">
            <h3 className="text-lg font-bold">{currentPlayer.name}</h3>
            <p>Position: {currentPlayer.position}</p>
            <p>Current Bid: ₹{currentPlayer.currentBid}</p>
          </div>
        </div>
      </div>

      {/* Auction Log */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-lg max-w-lg mx-auto">
        <h3 className="text-lg font-bold mb-2">Auction Log</h3>
        <ul className="space-y-2 text-gray-400">
          {auctionLog.map((log, index) => (
            <li key={index} className="text-sm">
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuctionViewer;
