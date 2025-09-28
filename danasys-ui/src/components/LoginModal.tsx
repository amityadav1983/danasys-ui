import { FC, useState, useEffect } from "react";
import OtpModal from "./OtpModal";
import EmailLogin from "./EmailLogin";
import PhoneLogin from "./PhoneLogin";
import Register from "./Register";
import newLogo from "../assets/images/cost2cost-new.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    credentials:
      | { email: string; password: string }
      | { phone: string; otp: string }
  ) => Promise<void>;
}

interface ThemeResponse {
  backGroundImageURL?: string;
  companyLogo?: string;
}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<"login" | "phone">("login");
  const [showRegister, setShowRegister] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // ✅ Default (local) theme
  const [backgroundImage, setBackgroundImage] = useState<string>("/shopping-bg.jpg");
  const [companyLogo, setCompanyLogo] = useState<string>(newLogo);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("login");
      setShowRegister(false);
      setShowOtpModal(false);
      setPhoneNumber("");

      // ✅ Theme API fetch with fallback
      const fetchTheme = async () => {
        try {
          const res = await fetch("/public/loginTheem");
          if (!res.ok) throw new Error("Failed to fetch theme");

          const data: ThemeResponse = await res.json();

          setBackgroundImage(
            data.backGroundImageURL && data.backGroundImageURL.trim() !== ""
              ? data.backGroundImageURL
              : "/shopping-bg.jpg"
          );

          setCompanyLogo(
            data.companyLogo && data.companyLogo.trim() !== ""
              ? data.companyLogo
              : newLogo
          );
        } catch (error) {
          console.error("Theme API error:", error);
          setBackgroundImage("/shopping-bg.jpg");
          setCompanyLogo(newLogo);
        }
      };

      fetchTheme();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOtpVerify = (otp: string) => {
    setShowOtpModal(false);
  };

  const handlePhoneContinue = (phone: string) => {
    setPhoneNumber(phone);
    setShowOtpModal(true);
  };

  return (
    <>
      {/* Background with theme */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
        style={{
          backgroundImage: `url(${backgroundImage})`,
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
          <div className="relative w-full h-[560px] rounded-3xl overflow-hidden shadow-3xl bg-white/100 backdrop-blur-md animate-fade-scale-slide">
            <div className="relative z-10 h-full flex flex-col">
              {/* Logo */}
              <div className="text-center flex-shrink-0">
                <img
                  src={companyLogo}
                  alt="Logo"
                  className="w-[160px] h-auto mx-auto object-contain"
                />
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
                  <EmailLogin
                    onRegisterClick={() => setShowRegister(true)}
                    onLogin={onLogin}
                  />
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
