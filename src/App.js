import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auctions from "./components/Auctions";
import AddAuction from "./components/AddAuction";
import AuctionDetails from "./components/AuctionDetails";
import EditAuction from "./components/EditAuction";
import Players from "./components/Players";
import AddPlayer from "./components/AddPlayer";
import EditPlayer from "./components/EditPlayer";
import Teams from "./components/Teams";
import AddTeam from "./components/AddTeam";
import "./styles.css"; // Import the styles
import AuctionStart from "./components/Start";
import EditTeam from "./components/EditTeam";
import Customer from "./components/Customer";

function App() {
  const location = useLocation();

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', padding: '16px' }}>
      {/* Global header to display the site name */}

      {/* Show the navigation bar only if the current path is not '/view' */}
      {location.pathname !== "/view" && (
        <nav className="navbar">
          <ul className="nav-list">
            <li>
              <a href="/dashboard" className="nav-link">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/auctions" className="nav-link">
                Auctions
              </a>
            </li>
          </ul>
        </nav>
      )}

      <div >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/auction/edit/:id" element={<EditAuction />} />
          <Route path="/auction/add" element={<AddAuction />} />
          <Route path="/auction/:id/players" element={<Players />} />
          <Route path="/auction/:id/players/add" element={<AddPlayer />} />
          <Route
            path="/auction/:id/players/edit/:playerId"
            element={<EditPlayer />}
          />
          <Route path="/auction/:id/teams" element={<Teams />} />
          <Route path="/auction/:id/teams/add" element={<AddTeam />} />
          <Route path="/auction/:id/start" element={<AuctionStart />} />
          <Route
            path="/auction/:id/teams/edit/:teamId"
            element={<EditTeam />}
          />
          <Route path="/view" element={<Customer />} />
        </Routes>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
