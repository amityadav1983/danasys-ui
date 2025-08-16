import { FC, useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  phoneNumber?: string;
  onLogin?: (credentials: { phone: string; otp: string }) => Promise<void>;
}

const OtpModal: FC<OtpModalProps> = ({ isOpen, onClose, onVerify, phoneNumber, onLogin }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('🔍 OtpModal: Rendering with props:', { isOpen, phoneNumber, hasOnLogin: !!onLogin });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      handleVerifyOtp(otp.join(''));
    }
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    if (!phoneNumber || !onLogin) {
      // Fallback to original onVerify if no phone login
      onVerify(otpValue);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 OtpModal: Starting OTP verification...');
      console.log('🔍 OtpModal: Phone number:', phoneNumber);
      console.log('🔍 OtpModal: OTP entered:', otpValue);
      console.log('🔍 OtpModal: Making phone login API call to /public/loginM...');

      const response = await fetch('/public/loginM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobileNumber: phoneNumber, 
          otp: otpValue 
        }),
      });

      console.log('🔍 OtpModal: Phone login API response status:', response.status);
      console.log('🔍 OtpModal: Phone login API response ok:', response.ok);
      console.log('🔍 OtpModal: Phone login API response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        // Check content type to handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        console.log('🔍 OtpModal: Response content-type:', contentType);
        
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('🔍 OtpModal: Phone login API response data (JSON):', responseData);
        } else {
          responseData = await response.text();
          console.log('🔍 OtpModal: Phone login API response data (Text):', responseData);
        }
        
        console.log('🔍 OtpModal: Phone login successful!');
        
        // Call the onLogin function with phone and OTP
        await onLogin({ phone: phoneNumber, otp: otpValue });
        
        // Close the modal only after successful login
        console.log('🔍 OtpModal: Closing modal after successful login');
        onClose();
      } else {
        const errorData = await response.text();
        console.error('❌ OtpModal: Phone login API error response:', errorData);
        throw new Error(`Phone login failed: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('❌ OtpModal: Error during phone login:', error);
      alert(`OTP verification failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      // Don't close modal on error - let user try again
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyClick = () => {
    if (otp.some((digit) => digit === '')) {
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      setShowError(false);
      handleVerifyOtp(otp.join(''));
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).id === 'otp-overlay') {
      onClose();
    }
  };

  if (!isOpen) {
    console.log('🔍 OtpModal: Modal is not open, returning null');
    return null;
  }

  console.log('🔍 OtpModal: Modal is open, rendering OTP modal content');

  return (
    <div
      id="otp-overlay"
      onClick={handleClickOutside}
      className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center border-4 border-red-500"
    >
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative shadow-2xl border-2 border-blue-500">
        {/* Debug info - remove this later */}
        {/* <div className="absolute -top-8 left-0 right-0 text-center text-xs text-white bg-red-500 p-1 rounded">
          DEBUG: OTP Modal is visible - Phone: {phoneNumber}
        </div> */}
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Enter OTP
        </h2>

        {phoneNumber && (
          <p className="text-center text-sm text-gray-600 mb-4">
            Enter the OTP sent to {phoneNumber}
          </p>
        )}

        <div className="flex justify-center gap-4 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`w-12 h-12 text-center text-lg rounded-md border ${
                showError ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                shake ? 'animate-shake' : ''
              }`}
            />
          ))}
        </div>

        {showError && (
          <p className="text-red-500 text-sm text-center mb-3">
            Enter valid OTP
          </p>
        )}

        <button
          onClick={handleVerifyClick}
          disabled={isLoading}
          className="w-full bg-[#349FDE] hover:bg-[#238ece] text-white py-2 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Resend OTP in{' '}
          <span className="font-medium text-gray-800">{timeLeft}s</span>
        </p>
      </div>
    </div>
  );
};

export default OtpModal;
