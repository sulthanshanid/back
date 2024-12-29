import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAuctionDetails,
  fetchTeams,
  fetchPlayers,
  postBid,
  updatePlayerStatus,
  sendPlayerIdToAPI, // New API function for sending player ID to the WebSocket endpoint
} from "../api"; // Ensure you have the new API function defined here
import { FaHammer, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for better visuals

const Auction = () => {
  const { id } = useParams(); // Auction ID from URL
  const [auction, setAuction] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bidSuccess, setBidSuccess] = useState(null); // Track bid success or failure
  const [sold, setSold] = useState(false); // Track if the player is sold
  const [unsold, setUnsold] = useState(false); // Track if the player is unsold
  const [showModal, setShowModal] = useState(false); // Control the modal
  const [showSuccess, setShowSuccess] = useState(false); // Track whether to show success message
  const [showOverlay, setShowOverlay] = useState(true); // Track whether the overlay should be shown for a player

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const auctionRes = await fetchAuctionDetails(id);
        const teamsRes = await fetchTeams(id);
        const playersRes = await fetchPlayers(id);

        if (auctionRes && auctionRes.bid_increment && auctionRes.name) {
          setAuction(auctionRes);
        }

        setTeams(teamsRes);
        setPlayers(playersRes);
      } catch (err) {
        console.error("Error fetching auction data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  const handleBid = async (teamId) => {
    const currentPlayer = players[currentPlayerIndex];
    const basePrice = Number(currentPlayer.base_price);
    const bidIncrement = Number(auction.bid_increment);
    const currentBid = currentPlayer.current_bid
      ? Number(currentPlayer.current_bid)
      : basePrice + bidIncrement; // Ensure current_bid is treated as a number
    const newBidAmount = currentBid + bidIncrement;

    try {
      await postBid(id, {
        player_id: currentPlayer.id,
        bid_value: newBidAmount,
        team_id: teamId,
      });

      // Update the bid locally
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex
            ? { ...player, current_bid: newBidAmount, team_id: teamId }
            : player
        )
      );
      setBidSuccess(true); // Show success
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error placing bid:", err);
      setBidSuccess(false); // Show failure
      setShowSuccess(true);

      // Hide failure message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const handleStatusUpdate = async (status) => {
    const currentPlayer = players[currentPlayerIndex];
    try {
      await updatePlayerStatus(currentPlayer.id, {
        status,
        team_id: currentPlayer.team_id || null,
        bid_amount:
          currentPlayer.current_bid ||
          Number(currentPlayer.base_price) + Number(auction.bid_increment),
        auction_id: id,
      });

      if (status === "sold") {
        setSold(true); // Mark as sold
        setUnsold(false);
      } else {
        setUnsold(true); // Mark as unsold
        setSold(false);
      }

      setShowModal(true); // Show modal with details
    } catch (err) {
      console.error("Error updating player status:", err);
    }
  };

  const handleNextPlayer = () => {
    setSold(false); // Reset sold status for the new player
    setUnsold(false); // Reset unsold status for the new player
    setShowModal(false); // Close modal
    setShowOverlay(true); // Show overlay for the next player
    setCurrentPlayerIndex((prevIndex) =>
      Math.min(prevIndex + 1, players.length - 1)
    ); // Ensure we don't go beyond the last player
  };

  const handlePreviousPlayer = () => {
    setSold(false); // Reset sold status for the new player
    setUnsold(false); // Reset unsold status for the new player
    setShowModal(false); // Close modal
    setShowOverlay(true); // Show overlay for the previous player
    setCurrentPlayerIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Ensure we don't go before the first player
  };

  const handleOverlayClick = async () => {
    const currentPlayer = players[currentPlayerIndex];
    try {
      await sendPlayerIdToAPI(currentPlayer.id); // Send the player ID to the WebSocket API
      setShowOverlay(false); // Remove overlay after sending the ID
    } catch (err) {
      console.error("Error sending player ID to API:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-2xl text-white animate-pulse">
          Loading auction details...
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center text-white">No auction data available.</div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];
  if (!currentPlayer) {
    return (
      <div className="text-center text-white">
        No more players in this auction.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      {showSuccess && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-1/2 text-center py-2 rounded-lg shadow-lg text-lg font-semibold ${
            bidSuccess ? "bg-green-500" : "bg-red-500"
          } animate-fadeInOut`}
        >
          {bidSuccess ? "Bid Success!" : "Bid Failed!"}
        </div>
      )}
      <h1 className="text-4xl font-bold mb-6 text-gray-300">{auction.name}</h1>

      {/* Player Card */}
      <div className="bg-gray-700 shadow-lg rounded-lg p-6 mb-8 max-w-lg mx-auto relative overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Current Player</h2>
        <div className="flex flex-col items-center space-y-4 relative">
          <img
            src={`http://localhost:3000${currentPlayer.photo_path}`}
            alt={currentPlayer.name}
            className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-gray-500"
          />
          {sold && (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 animate-slideDown">
              <FaHammer className="text-white text-6xl animate-bounce mb-4" />
              <div className="text-4xl font-bold text-white mb-4">SOLD</div>
              <img
                src={`http://localhost:3000${
                  teams.find((team) => team.id === currentPlayer.team_id)?.logo
                }`}
                alt="team logo"
                className="w-20 h-20 rounded-full border-4 border-white mb-4 animate-zoomIn"
              />
              <div className="text-xl font-semibold text-white">
                {formatCurrency(currentPlayer.current_bid)}
              </div>
            </div>
          )}
          {unsold && (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 animate-slideDown">
              <FaTimesCircle className="text-red-500 text-6xl animate-bounce mb-4" />
              <div className="text-4xl font-bold text-white mb-4">UNSOLD</div>
            </div>
          )}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-300">
              {currentPlayer.name}
            </h3>
            <p>Position: {currentPlayer.position}</p>
            <p>
              Current Bid:{" "}
              {currentPlayer.current_bid
                ? formatCurrency(Number(currentPlayer.current_bid))
                : formatCurrency(
                    Number(currentPlayer.base_price) +
                      Number(auction.bid_increment)
                  )}
            </p>
          </div>
        </div>
      </div>

      {/* Teams and Start Overlay */}
      <div className="mb-8 relative">
        {showOverlay && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-70 z-10">
            <button
              onClick={handleOverlayClick}
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-lg"
            >
              Start Bidding
            </button>
          </div>
        )}

        <h3 className="text-lg font-bold mb-4">Teams</h3>
        <div className="grid grid-cols-3 gap-4">
          {teams.map((team) => (
            <button
              key={team.id}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex flex-col items-center shadow-lg"
              onClick={() => handleBid(team.id)} // Ensure this calls handleBid with the correct team ID
            >
              <img
                src={`http://localhost:3000${team.logo}`}
                alt={team.name}
                className="w-12 h-12 rounded-full mb-2"
              />
              <span className="text-sm font-medium">{team.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Player Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gray-700 p-8 rounded-lg shadow-lg text-white text-center w-3/4 max-w-md relative">
            <button
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <img
              src={`http://localhost:3000${currentPlayer.photo_path}`}
              alt={currentPlayer.name}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-4">{currentPlayer.name}</h3>
            {sold && (
              <>
                <div className="text-4xl font-bold text-green-500 mb-4">
                  SOLD
                </div>
                <img
                  src={`http://localhost:3000${
                    teams.find((team) => team.id === currentPlayer.team_id)
                      ?.logo
                  }`}
                  alt="team logo"
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <div className="text-lg font-medium">
                  Sold for {formatCurrency(currentPlayer.current_bid)}
                </div>
              </>
            )}
            {unsold && (
              <div className="text-4xl font-bold text-red-500">UNSOLD</div>
            )}
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-8">
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-lg"
          onClick={() => handleStatusUpdate("sold")}
        >
          <FaCheckCircle className="inline mr-2" /> Sold
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-lg"
          onClick={() => handleStatusUpdate("unsold")}
        >
          <FaTimesCircle className="inline mr-2" /> Unsold
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <button
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md shadow-lg"
          onClick={handlePreviousPlayer}
          disabled={currentPlayerIndex === 0} // Disable if it's the first player
        >
          Previous Player
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-lg"
          onClick={handleNextPlayer}
          disabled={currentPlayerIndex === players.length - 1} // Disable if it's the last player
        >
          Next Player
        </button>
      </div>
    </div>
  );
};

export default Auction;
