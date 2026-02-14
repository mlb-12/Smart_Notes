import { useState } from "react";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Create Account 🚀" : "Login 🔐"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 cursor-pointer ml-1"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
