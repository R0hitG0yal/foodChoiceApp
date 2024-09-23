import { useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      onLogin(res.data.token);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <form className="accent-indigo-400 my-1" onSubmit={handleSubmit}>
      <input
        className="px-4 py-2 border-2 rounded-lg border-indigo-400 bg-indigo-200 mx-1"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="px-4 py-2 border-2 rounded-lg border-indigo-400 bg-indigo-200 ml-1 mr-2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button
        className="bg-indigo-400 px-6 py-2 w-44 rounded-lg text-slate-100 font-bold"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
