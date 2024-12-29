import React, { useState, useEffect } from "react";
import { FaHammer, FaTimesCircle } from "react-icons/fa";

const AuctionViewer = () => {
  const [playerData, setPlayerData] = useState({
    image_path: "",
    name: "",
    base_price: 0, // Added base_price in playerData state
  });
  const [bidAmount, setBidAmount] = useState(0);
  const [teamData, setTeamData] = useState({
    name: "",
    logo_path: "",
  });
  const [status, setStatus] = useState(""); // Will be set to 'bidding', 'sold', 'unsold', or 'viewing'

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000"); // Replace with actual server URL

    socket.onopen = () => {
      console.log("WebSocket connection established"); // Check if connection is open
    };

    socket.onmessage = (event) => {
      console.log("Received message from WebSocket:", event.data); // Log the raw message
      try {
        const message = JSON.parse(event.data); // Ensure the message is properly parsed
        console.log("Parsed message:", message);
        handleWebSocketMessage(message); // Pass the parsed message to the handler
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  // WebSocket message handler
  const handleWebSocketMessage = (message) => {
    console.log("Handling message type:", message.type); // Log to ensure handler is triggered

    if (message.type === "NEW_BID") {
      console.log("Handling NEW_BID message");
      setPlayerData({
        image_path: message.player_image,
        name: `Player ${message.player_id}`,
        base_price: message.base_price, // Assuming base_price is provided in NEW_BID message
      });
      setBidAmount(message.bid_value);
      setTeamData({
        name: message.team_name,
        logo_path: message.team_logo,
      });
      setStatus("bidding"); // Set the status to "bidding" on new bid
    }

    if (message.type === "PLAYER_SOLD") {
      console.log("Handling PLAYER_SOLD message");
      setPlayerData({
        image_path: message.player_image,
        name: `Player ${message.playerId}`,
        base_price: message.base_price, // Assuming base_price is provided in PLAYER_SOLD message
      });
      setBidAmount(message.bid_amount);
      setTeamData({
        name: message.team_name,
        logo_path: message.team_logo,
      });
      setStatus("sold"); // Player is now sold
    }

    if (message.type === "PLAYER_STATUS_UPDATED") {
      console.log("Handling PLAYER_STATUS_UPDATED message");
      if (message.status === "unsold") {
        setStatus("unsold"); // Update the player status to unsold
      } else {
        setStatus("bidding"); // Reset to bidding if the status is not unsold
      }
    }

    if (message.type === "VIEW") {
      console.log("Handling VIEW message");
      setPlayerData({
        image_path: message.player_image,
        name: message.player_name,
        base_price: message.base_price, // Set base price from the VIEW message
      });
      setBidAmount(0); // Reset bid amount since we're viewing base price
      setTeamData({
        name: message.team_name, // Assuming this is part of the VIEW message
        logo_path: message.team_logo, // Assuming this is part of the VIEW message
      });
      setStatus("viewing"); // Set the status to 'viewing'
    }
  };

  // Function to format currency (bid amount or base price)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return "$0"; // Default to $0 if amount is invalid
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="relative">
      {/* Conditional rendering for player status */}
      {status === "sold" && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 animate-fadeIn">
          <FaHammer className="text-white text-6xl animate-bounce mb-4" />
          <div className="text-4xl font-bold text-white mb-4">SOLD</div>
          <img
            src={`http://localhost:3000${teamData.logo_path}`}
            alt="team logo"
            className="w-20 h-20 rounded-full border-4 border-white mb-4 animate-zoomIn"
          />
          <div className="text-xl font-semibold text-white">
            {formatCurrency(bidAmount)}
          </div>
        </div>
      )}

      {status === "unsold" && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 animate-fadeIn">
          <FaTimesCircle className="text-red-500 text-6xl animate-bounce mb-4" />
          <div className="text-4xl font-bold text-white mb-4">UNSOLD</div>
        </div>
      )}

      {status === "bidding" && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="text-4xl font-bold text-white mb-4">BIDDING</div>
        </div>
      )}

      {status === "viewing" && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="text-4xl font-bold text-white mb-4">VIEWING</div>
        </div>
      )}

      {/* Transfermarkt-style player card */}
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white relative">
        {/* Player image */}
        <img
          className="w-full h-64 object-cover"
          src={`http://localhost:3000${playerData.image_path}`}
          alt="Player"
        />

        <div className="px-6 py-4">
          {/* Player Name and Team */}
          <div className="font-bold text-xl mb-2">{playerData.name}</div>
          <div className="text-gray-400 text-sm mb-2">TEAM:{teamData.name}</div>

          {/* Display either Base Price or Bid Amount */}
          <div className="text-lg text-green-400 font-semibold">
            {status === "viewing" ? (
              <>
                <span className="text-white">Base Price: </span>
                {formatCurrency(playerData.base_price)}
              </>
            ) : (
              <>
                <span className="text-white">Bid Amount: </span>
                {formatCurrency(bidAmount)}
              </>
            )}
          </div>
        </div>

        <div className="absolute top-2 right-2 bg-gray-900 text-xs rounded-full px-4 py-1">
          <span>
            {status === "sold"
              ? "SOLD"
              : status === "unsold"
              ? "UNSOLD"
              : status === "viewing"
              ? "VIEWING"
              : "BIDDING"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuctionViewer;
