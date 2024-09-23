import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import DishColumn from "./components/DishColumn";
import Login from "./components/Login";
import Register from "./components/Register";

// Socket connection
const socket = io("http://localhost:4000");

function App() {
  const [dishes, setDishes] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch dishes when token is set
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/dish", {
          headers: { "x-auth-token": token },
        });
        setDishes(res.data);
      } catch (error) {
        console.error("Error fetching dishes", error);
      }
    };

    if (token) {
      fetchDishes();
    }
  }, [token]);

  // Socket listener for dish updates
  useEffect(() => {
    socket.on("updateDish", (data) => {
      setDishes((prev) =>
        prev.map((dish) => (dish._id === data._id ? data : dish))
      );
    });

    return () => {
      socket.off("updateDish");
    };
  }, []);

  // Handle login/logout
  const handleLogin = (userToken) => {
    setToken(userToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setDishes([]);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <button
            className="bg-indigo-400 px-8 py-3 m-2 rounded-lg text-slate-100 font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
          <div className="columns flex justify-evenly">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <DishColumn
                key={day}
                day={day}
                dishes={dishes.filter((dish) => dish.day === day)}
                setDishes={setDishes}
                token={token}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-screen h-screen items-center justify-center ">
          <Login onLogin={handleLogin} />
          <Register />
        </div>
      )}
    </div>
  );
}

export default App;
