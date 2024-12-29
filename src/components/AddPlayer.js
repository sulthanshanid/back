import React, { useState } from "react";
import { addPlayer } from "../api"; // Adjust the import based on your actual API function
import { useParams, useNavigate } from "react-router-dom";

const AddPlayer = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null); // State to hold image
  const [imagePath, setImagePath] = useState(""); // State to hold the image path from upload
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission status

  const navigate = useNavigate();

  // Handle image upload to get the photo path
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true); // Set uploading status to true while uploading

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImagePath(result.filePath); // Assuming the API response has a `path` field
        setIsUploading(false); // Reset upload status
      } else {
        alert("Image upload failed");
        setIsUploading(false); // Reset upload status
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      setIsUploading(false); // Reset upload status
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Check if all required fields are present
    if (!imagePath) {
      alert("Please upload a photo.");
      return; // Prevent form submission if no image is uploaded
    }

    if (!name || !position || !price) {
      alert("Please fill in all fields.");
      return; // Prevent form submission if any field is missing
    }

    const newPlayer = {
      name,
      position,
      price,
      photo_path: imagePath, // The path from image upload
    };

    // Debugging: log new player data
    console.log("New Player Data:", newPlayer);

    setIsSubmitting(true); // Indicate that submission is in progress

    try {
      // Send player data with photo_path
      const response = await addPlayer(id, newPlayer);

      if (response.success) {
        console.log("Player added successfully");
        navigate(`/auction/${id}/players`);
      } else {
        console.error("Error adding player:", response.error);
        alert("Error adding player");
      }
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Error adding player");
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add Player to Auction {id}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-2"
            >
              Player Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter player name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label
              htmlFor="position"
              className="block text-gray-600 font-medium mb-2"
            >
              Position
            </label>
            <input
              id="position"
              type="text"
              placeholder="Enter player position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-gray-600 font-medium mb-2"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="image"
              className="block text-gray-600 font-medium mb-2"
            >
              Upload Player Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                handleImageUpload(e.target.files[0]);
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
              disabled={isUploading || !imagePath || isSubmitting} // Disable submit if uploading or no image is uploaded
            >
              {isSubmitting
                ? "Adding Player..."
                : isUploading
                ? "Uploading..."
                : "Add Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlayer;
