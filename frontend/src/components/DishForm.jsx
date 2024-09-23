import { useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const DishForm = ({ day, setDishes, token }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("day", day);

    const res = await axios.post(
      "http://localhost:4000/api/dish/add",
      formData,
      {
        headers: { "x-auth-token": token },
      }
    );
    setDishes((prev) => [...prev, res.data]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Dish Name"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Add Dish</button>
    </form>
  );
};

export default DishForm;
