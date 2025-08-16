import { FC, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import OtpModal from "./OtpModal";
import EmailLogin from "./EmailLogin";
import PhoneLogin from "./PhoneLogin";
import Register from "./Register";
import newLogo from '../assets/images/COST2COST.png';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { email: string; password: string } | { phone: string; otp: string }) => Promise<void>;
}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<"login" | "phone">("login");
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    console.log('🔍 LoginModal: useEffect running, isOpen =', isOpen);
    if (isOpen) {
      console.log('🔍 LoginModal: Modal is open, resetting state...');
      setActiveTab("login");
      setShowRegister(false);
      setShowOtpModal(false);
      setPhoneNumber("");
    }
  }, [isOpen]);

  console.log('🔍 LoginModal: Rendering with props:', { isOpen, onClose: !!onClose, onLogin: !!onLogin });

  if (!isOpen) {
    console.log('🔍 LoginModal: Modal is not open, returning null');
    return null;
  }

  const handleOtpVerify = (otp: string) => {
    console.log('🔍 LoginModal: handleOtpVerify called with OTP:', otp);
    setShowOtpModal(false);
    // Don't close the main login modal - let user stay on login form
    // onClose(); // Commented out to prevent closing
  };

  const handlePhoneContinue = (phone: string) => {
    console.log('🔍 LoginModal: Phone continue called with phone:', phone);
    console.log('🔍 LoginModal: Setting phoneNumber to:', phone);
    setPhoneNumber(phone);
    console.log('🔍 LoginModal: Setting showOtpModal to true');
    setShowOtpModal(true);
    console.log('🔍 LoginModal: showOtpModal should now be true');
  };

  console.log('🔍 LoginModal: Modal is open, rendering content...');
  console.log('🔍 LoginModal: Current state - showOtpModal:', showOtpModal, 'phoneNumber:', phoneNumber);

  return (
    <>
      {/* Background with image */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
        style={{
          backgroundImage: `url(/shopping-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Modal container */}
        <div
          className="relative w-full max-w-[520px] mx-auto px-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-full h-[560px] rounded-3xl overflow-hidden shadow-3xl bg-white/100 backdrop-blur-md animate-fade-scale-slide"
          >
            <div className="relative z-10 h-full flex flex-col">
              {/* Top back button */}
              {/* <div className="p-4 pt-5">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/30 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 text-black" />
                </button>
              </div> */}

              {/* Logo */}
              <div className="text-center flex-shrink-0 mt-8">
                <div className="w-32 h-32  rounded-full flex items-center justify-center mx-auto shadow-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30">
                  <img
                    src={newLogo} 
                    alt="Logo"
                    className="w-28 h-28  object-contain drop-shadow-lg"
                  />
                </div>
                <p className="text-black/90 text-sm mt-3 font-medium">
                  Earn points, live better!
                </p>
              </div>

              {/* Tabs */}
              <div className="flex justify-center gap-6 text-black font-medium border-b border-gray-200 mt-4 pb-2">
                <button
                  className={`pb-1 ${
                    activeTab === "login"
                      ? "border-b-2 border-[#349FDE]"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`pb-1 ${
                    activeTab === "phone"
                      ? "border-b-2 border-[#349FDE]"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("phone")}
                >
                  Mobile Login
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-start items-center px-5 pb-5 space-y-4 overflow-y-auto scrollbar-hide">
                {activeTab === "login" && !showRegister && (
                  <EmailLogin onRegisterClick={() => setShowRegister(true)} onLogin={onLogin} />
                )}
                {activeTab === "login" && showRegister && (
                  <Register onBackToLogin={() => setShowRegister(false)} />
                )}
                {activeTab === "phone" && (
                  <PhoneLogin onContinue={handlePhoneContinue} onLogin={onLogin} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
        phoneNumber={phoneNumber}
        onLogin={onLogin}
      />
    </>
  );
};

export default LoginModal;
