/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";

function DishColumn({ day, dishes, setDishes, token }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dishName, setDishName] = useState("");
  const [image, setImage] = useState(null);

  const onDragStart = (e, dishId) => {
    e.dataTransfer.setData("dishId", dishId);
  };

  const onDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default behavior
  };

  const onDrop = async (e) => {
    const dishId = e.dataTransfer.getData("dishId");

    // Send request to backend to update the dish's day
    try {
      const res = await fetch("http://localhost:4000/api/dish/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ dishId, newDay: day }),
      });

      if (res.ok) {
        const updatedDish = await res.json();
        // Update local state with new dish data
        setDishes((prevDishes) =>
          prevDishes.map((dish) =>
            dish._id === updatedDish._id ? updatedDish : dish
          )
        );
      }
    } catch (error) {
      console.error("Error moving dish:", error);
    }
  };

  const toggleForm = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleDishNameChange = (e) => setDishName(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if dishName or image is empty
    if (!dishName || !image) {
      alert("Please provide both dish name and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", dishName);
    formData.append("image", image);
    formData.append("day", day);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/dish/add",
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Add the new dish to the current list of dishes
      setDishes((prevDishes) => [...prevDishes, res.data]);
      toggleForm(); // Close the form after submission
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  return (
    <div
      className="day-column text-center"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h3 className="my-4 text-2xl font-extrabold underline underline-offset-2 ">
        {day}
      </h3>
      <button
        className="bg-indigo-400 px-4 py-2 m-2 rounded-lg text-slate-100 font-semibold"
        onClick={toggleForm}
      >
        {isFormVisible ? "Cancel" : "Add Dish"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={dishName}
            onChange={handleDishNameChange}
            placeholder="Dish Name"
            required
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          <button
            className="bg-indigo-400 px-2 m-2 rounded-lg text-slate-100 font-semibold"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}

      <div className="dishes-list">
        {dishes.map((dish) => (
          <div
            key={dish._id}
            className="dish-item border-slate-800 border-2 p-4 my-2"
            draggable
            onDragStart={(e) => onDragStart(e, dish._id)}
          >
            <img
              className="size-24"
              src={`http://localhost:4000/${dish.image}`}
              alt={dish.name}
            />
            <p className="text-center">{dish.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DishColumn;
