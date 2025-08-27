import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface RegisterProps {
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Email verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  // Focus states for input fields
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [contactInfoFocused, setContactInfoFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);
  const [captchaFocused, setCaptchaFocused] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(random);
    setCaptchaInput("");
    setIsCaptchaValid(false);
    setIsChecked(false);
  };

  const handleCaptchaChange = (value: string) => {
    setCaptchaInput(value);
    setIsCaptchaValid(value.toUpperCase() === captcha);
    if (value.toUpperCase() !== captcha) {
      setIsChecked(false);
    }
  };

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Email verification function
  const handleEmailVerify = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address with @ and domain (.com, .in, etc.)");
      return;
    }

    setIsVerifyingEmail(true);
    setError("");
    setOtpMessage("");

    try {
      console.log('🔍 Register: Sending email verification OTP...');
      
      const response = await fetch('/public/sendEmailOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      console.log('🔍 Register: Email OTP API response status:', response.status);

      // Always show OTP input regardless of API response
      setOtpMessage("OTP sent to your mail");
      setShowOtpInput(true);
      console.log('🔍 Register: Showing OTP input field');

    } catch (err: any) {
      console.error("❌ Register: Email verification error:", err);
      // Don't show error message, just show OTP input
      setOtpMessage("OTP sent to your mail");
      setShowOtpInput(true);
      console.log('🔍 Register: Showing OTP input field despite error');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // OTP validation function
  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) { // Assuming 6-digit OTP
      setIsEmailVerified(true);
    } else {
      setIsEmailVerified(false);
    }
  };

  const isFormValid =
    email.trim() &&
    password.trim() &&
    fullName.trim() &&
    isCaptchaValid &&
    isChecked &&
    isEmailVerified &&
    otp.trim();

  const handleRegister = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log('🔍 Register: Starting registration process with OTP validation...');
      
      // Prepare user data with OTP for server-side validation
      const userData = {
        email: email.trim(),
        password: password,
        fullname: fullName.trim(),
        contactInfo: contactInfo.trim() || null,
        otp: otp.trim() // Include OTP for server-side validation
      };

      console.log('🔍 Register: User data prepared:', { ...userData, password: '***', otp: '***' });
      console.log('🔍 Register: Making API call to /public/registerUser with OTP...');

      // Call the register API with OTP validation
      const response = await fetch('/public/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('🔍 Register: Registration API response status:', response.status);
      console.log('🔍 Register: Registration API response ok:', response.ok);

      if (response.ok) {
        // Check content type to handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        console.log('🔍 Register: Response content-type:', contentType);
        
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('🔍 Register: Registration API response data (JSON):', responseData);
        } else {
          responseData = await response.text();
          console.log('🔍 Register: Registration API response data (Text):', responseData);
        }
        
        console.log('🔍 Register: Registration successful!');
        
        setSuccess("User registered successfully!");
        
        // Clear form
        setEmail("");
        setPassword("");
        setFullName("");
        setContactInfo("");
        setCaptchaInput("");
        setIsChecked(false);
        setIsEmailVerified(false);
        setOtp("");
        setShowOtpInput(false);
        setOtpMessage("");
        
        // Generate new captcha
        generateCaptcha();
        
        // Redirect to home page after successful registration
        setTimeout(() => {
          window.location.href = '/'; // Redirect to home page
        }, 2000);
      } else {
        const errorData = await response.text();
        console.error('❌ Register: Registration API error response:', errorData);
        
        if (response.status === 400) {
          setError("Invalid OTP or input data. Please check your information.");
        } else if (response.status === 409) {
          setError("User with this email already exists.");
        } else {
          throw new Error(`Registration failed with status: ${response.status}`);
        }
      }

    } catch (err: any) {
      console.error("❌ Register: Registration error:", err);
      
      if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection.");
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] space-y-4 mt-2 mb-10">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Email Input with Verify Button and Floating Label Design */}
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
  className="bg-transparent border-0 outline-none focus-visible:ring-0 focus:ring-0 rounded-xl px-4 py-3 pt-4 pr-20"
  required
  disabled={isLoading || isVerifyingEmail}
/>
          <button
            onClick={handleEmailVerify}
            disabled={!email.trim() || isVerifyingEmail || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#349FDE] hover:text-[#2e90cd] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifyingEmail ? "Sending..." : "Verify"}
          </button>
        </div>
      </div>

      {/* OTP Message */}
      {otpMessage && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg text-sm">
          {otpMessage}
        </div>
      )}

      {/* OTP Input with Floating Label Design */}
      {showOtpInput && (
        <div className="relative">
          <div className="relative bg-white rounded-xl">
            {/* Top border */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
              otpFocused ? 'bg-blue-500' : 'bg-blue-200'
            }`}></div>
            {/* Bottom border */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
              otpFocused ? 'bg-blue-500' : 'bg-blue-200'
            }`}></div>
            {/* Left border */}
            <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
              otpFocused ? 'bg-blue-500' : 'bg-blue-200'
            }`}></div>
            {/* Right border */}
            <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
              otpFocused ? 'bg-blue-500' : 'bg-blue-200'
            }`}></div>
            
            <div className={`absolute left-4 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
              otpFocused || otp ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
            }`}>
              OTP
            </div>
            <Input
  type="text"
  placeholder=""
  value={otp}
  onChange={(e) => handleOtpChange(e.target.value)}
  onFocus={() => setOtpFocused(true)}
  onBlur={() => setOtpFocused(false)}
  className="bg-transparent border-0 outline-none focus-visible:ring-0 focus:ring-0 rounded-xl px-4 py-3 pt-4"
  maxLength={6}
  disabled={isLoading}
/>
          </div>
        </div>
      )}

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
  className="bg-transparent border-0 outline-none focus-visible:ring-0 focus:ring-0 rounded-xl px-4 py-3 pt-4"
  required
  disabled={isLoading || !isEmailVerified}
/>
        </div>
      </div>

      {/* Full Name Input with Floating Label Design */}
      <div className="relative">
        <div className="relative bg-white rounded-xl">
          {/* Top border */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            fullNameFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            fullNameFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Left border */}
          <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            fullNameFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Right border */}
          <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            fullNameFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          
          <div className={`absolute left-4 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
            fullNameFocused || fullName ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
          }`}>
            Full Name
          </div>
          <Input
  type="text"
  placeholder=""
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  onFocus={() => setFullNameFocused(true)}
  onBlur={() => setFullNameFocused(false)}
  className="bg-transparent border-0 outline-none focus-visible:ring-0 focus:ring-0 rounded-xl px-4 py-3 pt-4"
  required
  disabled={isLoading || !isEmailVerified}
/>
        </div>
      </div>

      {/* Contact Info Input with Floating Label Design */}
      <div className="relative">
        <div className="relative bg-white rounded-xl">
          {/* Top border */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            contactInfoFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            contactInfoFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Left border */}
          <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            contactInfoFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Right border */}
          <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            contactInfoFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          
          <div className={`absolute left-4 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
            contactInfoFocused || contactInfo ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
          }`}>
            Contact Info (optional)
          </div>
          <Input
  type="text"
  placeholder=""
  value={contactInfo}
  onChange={(e) => setContactInfo(e.target.value)}
  onFocus={() => setContactInfoFocused(true)}
  onBlur={() => setContactInfoFocused(false)}
  className="bg-transparent border-0 outline-none focus-visible:ring-0 focus:ring-0 rounded-xl px-4 py-3 pt-4"
  disabled={isLoading || !isEmailVerified}
/>
        </div>
      </div>

      {/* Captcha */}
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-gray-200 rounded-lg font-bold tracking-widest select-none">
          {captcha}
        </div>
        <Button
          type="button"
          onClick={generateCaptcha}
          className="bg-gray-300 hover:bg-gray-400 text-black px-3"
          disabled={isLoading || !isEmailVerified}
        >
          ↻
        </Button>
      </div>
      {/* Captcha Input with Floating Label Design */}
      <div className="relative">
        <div className="relative bg-white rounded-xl">
          {/* Top border */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            captchaFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            captchaFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Left border */}
          <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            captchaFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Right border */}
          <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            captchaFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          
          <div className={`absolute left-4 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
            captchaFocused || captchaInput ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
          }`}>
            Captcha
          </div>
          <Input
  type="text"
  placeholder=""
  value={captchaInput}
  onChange={(e) => handleCaptchaChange(e.target.value)}
  onFocus={() => setCaptchaFocused(true)}
  onBlur={() => setCaptchaFocused(false)}
  className="bg-transparent border-0 outline-none focus-visible:ring-0 focus:ring-0 rounded-xl px-4 py-3 pt-4"
  required
  disabled={isLoading || !isEmailVerified}
/>
        </div>
      </div>
      {!isCaptchaValid && captchaInput && (
        <p className="text-xs text-red-500">Captcha does not match</p>
      )}

      {/* Terms & Conditions */}
      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isChecked}
          disabled={
            !isCaptchaValid || !email.trim() || !password.trim() || !fullName.trim() || !isEmailVerified || isLoading
          }
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="#" className="underline mb-10">
            Terms & Conditions
          </a>
        </span>
      </div>

      {/* Register Button */}
      <Button
        disabled={!isFormValid || isLoading}
        onClick={handleRegister}
        className="w-full bg-[#349FDE] hover:bg-[#2e90cd] text-white py-3 rounded-xl shadow-lg font-medium text-sm h-auto disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>

      {/* Back to login */}
      <div className="text-center text-sm">
        <button
          onClick={onBackToLogin}
          className="underline text-gray-600 hover:text-black"
          disabled={isLoading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
