import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const fetchPlayers = async (auctionId) => {
  const response = await axios.get(`${API_URL}/auction/${auctionId}/players`);
  return response.data;
};

export const addPlayer = async (auctionId, player) => {
  const response = await axios.post(
    `${API_URL}/auctions/${auctionId}/players`,
    player
  );
  return response.data;
};

export const updatePlayer = async (auctionId, playerId, player) => {
  const response = await axios.put(
    `${API_URL}/auctions/${auctionId}/players/${playerId}`,
    player
  );
  return response.data;
};

export const fetchPlayer = async (auctionId, playerId) => {
  const response = await axios.get(`${API_URL}/player/${playerId}`);
  return response.data;
};

export const fetchTeams = async (auctionId) => {
  const response = await axios.get(`${API_URL}/auctions/${auctionId}/teams`);
  return response.data;
};

export const addTeam = async (auctionId, team) => {
  const response = await axios.post(
    `${API_URL}/auctions/${auctionId}/teams`,
    team
  );
  return response.data;
};

export const updateTeam = async (auctionId, teamId, team) => {
  const response = await axios.put(
    `${API_URL}/auctions/${auctionId}/teams/${teamId}`,
    team
  );
  return response.data;
};

export const fetchTeam = async (auctionId, teamId) => {
  const response = await axios.get(
    `${API_URL}/auctions/${auctionId}/teams/${teamId}`
  );
  return response.data;
};

// Function to fetch all auctions
export const fetchAuctions = async () => {
  try {
    const response = await axios.get(`${API_URL}/auctions`); // Update with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    throw error;
  }
};

// Function to fetch a single auction by ID
export const fetchAuction = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/auction/${id}`); // Update with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching auction:", error);
    throw error;
  }
};

// Function to add a new auction
export const addAuction = async (auctionData) => {
  try {
    const response = await axios.post(`${API_URL}/auction`, auctionData); // Update with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Error adding auction:", error);
    throw error;
  }
};

export const updateAuction = async (id, auctionData) => {
  const response = await axios.put(`${API_URL}/auction/${id}`, auctionData);
  return response.data;
};
// You can add other API functions here like addPlayer, addTeam, etc.

export const searchPlayersByQuery = async (auctionId, query) => {
  const response = await fetch(
    `${API_URL}/auction/${auctionId}/search?query=${query}`
  );
  return await response.json();
};

export const fetchAuctionDetails = async (auctionId) => {
  const response = await fetch(`${API_URL}/auction/${auctionId}/`);
  return await response.json();
};

export const fetchAuctionPlayers = async (auctionId) => {
  const response = await fetch(`${API_URL}/auction/${auctionId}/players`);
  return await response.json();
};

export const fetchAuctionTeams = async (auctionId) => {
  const response = await fetch(`${API_URL}/auction/${auctionId}/teams`);
  return await response.json();
};

export const updatePlayerStatus = async (playerId, data) => {
  const response = await fetch(`${API_URL}/finalstatus/${playerId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const postBid = async (auctionId, data) => {
  const response = await fetch(`${API_URL}/bids/${auctionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const sendPlayerIdToAPI = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/ws/${playerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to send player ID");
    }
    return response.json();
  } catch (err) {
    console.error("Error sending player ID:", err);
  }
};
