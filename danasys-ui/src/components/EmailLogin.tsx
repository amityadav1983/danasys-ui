import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import googleIcon from "../assets/images/google-icon.png";

interface EmailLoginProps {
  onRegisterClick: () => void;
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onRegisterClick, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  console.log('🔍 EmailLogin: Rendering with props:', { onRegisterClick: !!onRegisterClick, onLogin: !!onLogin });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 EmailLogin: Form submitted!');
    console.log('🔍 EmailLogin: Email:', email);
    console.log('🔍 EmailLogin: Password:', password ? '***' : 'empty');
    
    if (!email.trim() || !password.trim()) {
      console.log('🔍 EmailLogin: Form validation failed - empty fields');
      return;
    }

    console.log('🔍 EmailLogin: Form validation passed, calling onLogin...');
    setIsLoading(true);
    try {
      await onLogin({ email, password });
      console.log('🔍 EmailLogin: onLogin completed successfully');
    } catch (error) {
      console.error('❌ EmailLogin: onLogin failed:', error);
    } finally {
      setIsLoading(false);
      console.log('🔍 EmailLogin: Loading state set to false');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[380px] space-y-4 mt-2">
      {/* Email Input with Floating Label Design */}
      <div className="relative">
        <div className="relative bg-white rounded-xl">
          {/* Top border */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            emailFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            emailFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Left border */}
          <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            emailFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Right border */}
          <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            emailFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          
          <div className={`absolute left-4 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
            emailFocused || email ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
          }`}>
            Email
          </div>
          <Input
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            className="bg-transparent border-0 rounded-xl px-4 py-3 pt-4 focus:ring-0 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Password Input with Floating Label Design */}
      <div className="relative">
        <div className="relative bg-white rounded-xl">
          {/* Top border */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            passwordFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            passwordFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Left border */}
          <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            passwordFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Right border */}
          <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            passwordFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          
          <div className={`absolute left-4 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
            passwordFocused || password ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
          }`}>
            Password
          </div>
          <Input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            className="bg-transparent border-0 rounded-xl px-4 py-3 pt-4 focus:ring-0 focus:outline-none"
            required
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={!password.trim() || isLoading}
        className="w-full bg-[#349FDE] hover:bg-[#2e90cd] text-white py-3 rounded-xl shadow-lg font-medium text-sm h-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      <div className="flex justify-between text-xs text-black/90">
        <button type="button" className="underline">Forgot Password?</button>
        <button type="button" className="underline" onClick={onRegisterClick}>
          Don't have an account?
        </button>
      </div>
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
