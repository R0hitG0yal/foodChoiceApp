/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useDrop } from "react-dnd";

// eslint-disable-next-line react/prop-types
const Dish = ({ dish, token, setDishes }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "DISH",
    drop: async (item, monitor) => {
      const newDay = dish.day;
      const res = await axios.post(
        "http://localhost:4000/api/dish/move",
        {
          dishId: item.id,
          newDay,
        },
        {
          headers: { "x-auth-token": token },
        }
      );

      setDishes((prev) =>
        prev.map((d) => (d._id === item.id ? { ...d, day: newDay } : d))
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div className="dish" ref={drop}>
      <img src={`http://localhost:4000/${dish.image}`} alt={dish.name} />
      <p>{dish.name}</p>
    </div>
  );
};

export default Dish;
