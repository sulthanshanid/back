import React, { useState } from "react";
import { addTeam } from "../api";
import { useParams, useNavigate } from "react-router-dom";

const AddTeam = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [logo, setLogo] = useState(null); // State to hold the logo image file
  const [logoPath, setLogoPath] = useState(""); // State to hold the uploaded logo path
  const [isUploading, setIsUploading] = useState(false); // Track logo upload status

  const navigate = useNavigate();

  // Handle logo upload to get the logo path
  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true); // Set uploading status to true while uploading

    try {
      const response = await fetch("${process.env.REACT_APP_API_URL}/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setLogoPath(result.filePath); // Assuming the API response has a `path` field
        setIsUploading(false); // Reset upload status
      } else {
        alert("Logo upload failed");
        setIsUploading(false); // Reset upload status
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error uploading logo");
      setIsUploading(false); // Reset upload status
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are present
    if (!logoPath) {
      alert("Please upload a logo.");
      return; // Prevent form submission if no logo is uploaded
    }

    if (!name || !budget) {
      alert("Please fill in all fields.");
      return; // Prevent form submission if any field is missing
    }

    const newTeam = {
      name,
      budget,
      logo_path: logoPath, // The path from logo upload
    };

    // Debugging: log new team data
    console.log("New Team Data:", newTeam);

    try {
      // Send team data with logo_path
      const response = await addTeam(id, newTeam);

      if (response.success) {
        console.log("Team added successfully");
        navigate(`/auction/${id}/teams`);
      } else {
        console.error("Error adding team:", response.error);
        alert("Error adding team");
      }
    } catch (error) {
      console.error("Error adding team:", error);
      alert("Error adding team");
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add Team to Auction {id}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-2"
            >
              Team Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-gray-600 font-medium mb-2"
            >
              Budget
            </label>
            <input
              id="budget"
              type="number"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label
              htmlFor="logo"
              className="block text-gray-600 font-medium mb-2"
            >
              Upload Team Logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setLogo(e.target.files[0]);
                handleLogoUpload(e.target.files[0]);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading} // Disable the input while uploading
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={isUploading || !logoPath} // Disable submit if uploading or no logo is uploaded
            >
              {isUploading ? "Uploading..." : "Add Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
