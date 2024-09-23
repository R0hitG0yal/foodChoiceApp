import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        email,
        password,
      });
      setSuccess("Registration successful! Please login.");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Error registering, please try again");
    }
  };

  return (
    <form className="my-1 accent-indigo-400 " onSubmit={handleSubmit}>
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
      {success && <p>{success}</p>}
      <button
        className="bg-indigo-400 px-6 py-2 w-44 rounded-lg text-slate-100 font-bold"
        type="submit"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
