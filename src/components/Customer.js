import React, { useState, useEffect } from "react";
import AllPlayers from "./AllPlayers";
import Team from "./Team";
import Leaderboard from "./Leaderboard";
import AuctionViewer from "./AuctionViewer";
import "./Others.css"; // Import the CSS file

const SITE_NAME = "MARKAUC";
const TAGLINE = "by SMARTBOYS";

const Others = () => {
  const [activeTab, setActiveTab] = useState("");
  const [auctionId, setAuctionId] = useState(null);
  const [auctions, setAuctions] = useState([]);

  // Fetch auctions on initial load
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auctions`
        ); // Replace with your API URL
        const data = await response.json();
        setAuctions(data); // Assuming the response contains an array of auctions
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  // Handle auction selection
  const handleAuctionSelect = (id) => {
    setAuctionId(id);
    setActiveTab("LIVE"); // Show tabs after selecting auction
  };

  const renderActiveTab = () => {
    if (!auctionId) {
      return (
        <div className="auction-selection">
          <h2>Select an Auction</h2>
          {auctions.length === 0 ? (
            <p>Loading auctions...</p>
          ) : (
            <div className="auction-cards">
              {auctions.map((auction) => (
                <div key={auction.id} className="auction-card">
                  <h3>{auction.name}</h3>
                  <p>{auction.description}</p>
                  <button onClick={() => handleAuctionSelect(auction.id)}>
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // After selecting an auction, show the appropriate tab
    switch (activeTab) {
      case "LIVE":
        return <AuctionViewer />;
      case "PLAYERS":
        return <AllPlayers auctionId={auctionId} />;
      case "TEAM":
        return <Team auctionId={auctionId} />;
      case "LEADERBOARD":
        return <Leaderboard auctionId={auctionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="others-page">
      <header className="site-header">
        <h1>{SITE_NAME}</h1>
        <small>{TAGLINE}</small>
      </header>
      {auctionId && (
        <div className="navbar">
          <button onClick={() => setActiveTab("LIVE")}>LIVE</button>
          <button onClick={() => setActiveTab("PLAYERS")}>PLAYERS</button>
          <button onClick={() => setActiveTab("TEAM")}>TEAM</button>
          <button onClick={() => setActiveTab("LEADERBOARD")}>
            LEADERBOARD
          </button>
        </div>
      )}
      <div className="content">{renderActiveTab()}</div>
    </div>
  );
};

export default Others;
