import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PhoneLoginProps {
  onContinue: (phone: string) => void;
  onLogin: (credentials: { phone: string; otp: string }) => Promise<void>;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onContinue, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [showError, setShowError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleContinuePhone = async () => {
    if (!phone.trim()) {
      setShowError(true);
      setShakeKey((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 PhoneLogin: Sending OTP to phone:', phone);
      console.log('🔍 PhoneLogin: Making API call to /public/registerUser/sendMobileOTP...');
      
      const response = await fetch('/public/registerUser/sendMobileOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber: phone }),
      });

      console.log('🔍 PhoneLogin: OTP API response status:', response.status);
      console.log('🔍 PhoneLogin: OTP API response ok:', response.ok);
      console.log('🔍 PhoneLogin: OTP API response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        // Check content type to handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        console.log('🔍 PhoneLogin: Response content-type:', contentType);
        
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('🔍 PhoneLogin: OTP API response data (JSON):', responseData);
        } else {
          responseData = await response.text();
          console.log('🔍 PhoneLogin: OTP API response data (Text):', responseData);
        }
        
        console.log('🔍 PhoneLogin: OTP sent successfully!');
        
        setShowError(false);
        // Call onContinue to open OTP modal
        onContinue(phone);
      } else {
        const errorData = await response.text();
        console.error('❌ PhoneLogin: OTP API error response:', errorData);
        throw new Error(`Failed to send OTP: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ PhoneLogin: Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] space-y-4 mt-2">
      {/* Phone Input with Floating Label Design */}
      <div className="relative">
        <div className="relative bg-white rounded-xl">
          {/* Top border */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            phoneFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Bottom border */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
            phoneFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Left border */}
          <div className={`absolute top-0 bottom-0 left-0 w-0.5 transition-all duration-200 ${
            phoneFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          {/* Right border */}
          <div className={`absolute top-0 bottom-0 right-0 w-0.5 transition-all duration-200 ${
            phoneFocused ? 'bg-blue-500' : 'bg-blue-200'
          }`}></div>
          
          
          
                     <div className={`absolute left-16 bg-white px-2 text-gray-500 text-sm font-medium transition-all duration-200 ${
             phoneFocused || phone ? '-top-2 text-xs text-blue-500' : 'top-3 text-sm'
           }`}>
             Enter mobile number
           </div>
           
           <div className="flex items-center">
             <div className="flex items-center px-4 py-2 border-r border-gray-300">
               <span className="text-gray-700 font-medium">+91</span>
             </div>
             <Input
               type="number"
               inputMode="numeric"
               pattern="[0-9]*"
               placeholder=""
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               onFocus={() => setPhoneFocused(true)}
               onBlur={() => setPhoneFocused(false)}
               className="appearance-none bg-transparent px-4 py-3 pt-4 text-gray-700 flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
               maxLength={10}
             />
           </div>
        </div>
      </div>
      <Button
        onClick={handleContinuePhone}
        disabled={isLoading}
        className="w-full bg-[#349FDE] hover:bg-[#2e90cd] text-white py-3 rounded-xl shadow-lg font-medium text-sm h-auto disabled:opacity-50"
      >
        {isLoading ? 'Sending OTP...' : 'Continue'}
      </Button>
    </div>
  );
};

export default PhoneLogin;
