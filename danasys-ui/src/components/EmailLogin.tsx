import { useState } from "react";
import { Button } from "./ui/button";
import FloatingInput from "./FloatingInput";
import googleIcon from "../assets/images/google-icon.png";

interface EmailLoginProps {
  onRegisterClick: () => void;
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onRegisterClick, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    try {
      await onLogin({ email, password });
    } catch (error) {
      console.error("❌ Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[380px] space-y-4 mt-2"
    >
      {/* Email */}
      <FloatingInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password */}
      <FloatingInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Login Button */}
      <Button
        type="submit"
        disabled={!password.trim() || isLoading}
        className="w-full bg-[#349FDE] hover:bg-[#2e90cd] text-white py-3 rounded-xl shadow-lg font-medium text-sm h-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {/* Links */}
      <div className="flex justify-between text-xs text-black/90">
        <button type="button" className="underline">
          Forgot Password?
        </button>
        <button type="button" className="underline" onClick={onRegisterClick}>
          Don't have an account?
        </button>
      </div>

      {/* Google Button */}
      <Button
        type="button"
        className="w-full bg-white px-1.5 py-1.5 text-gray-700 rounded-xl shadow-md flex items-center justify-center gap-2 border-2 border-blue-500"
      >
        <img
          src={googleIcon}
          alt="Google"
          className="w-7 h-7 border-2 border-blue-200 rounded-full"
        />
        Continue with Google
      </Button>
    </form>
  );
};

export default EmailLogin;
