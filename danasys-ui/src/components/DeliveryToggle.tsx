import { FaBriefcase, FaShoppingCart } from "react-icons/fa";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setMode } from "../store/mode";
import { useNavigate } from "react-router-dom";

const DeliveryToggle = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentMode = useAppSelector((state) => state.mode.currentMode);
  const isBusiness = currentMode === "business";



  return (
    <div className="flex items-center justify-center">
      {/* 🌐 Desktop View - Circle Slider */}
      <div
        className="hidden md:flex relative w-24 h-12 items-center rounded-full p-1 cursor-pointer transition-colors duration-300
        bg-blue-100"
        onClick={() => {
          console.log('Toggle clicked, current mode:', isBusiness);
          const newMode = isBusiness ? "user" : "business";
          dispatch(setMode(newMode));
          if (newMode === "user") {
            navigate("/");
          }
        }}
      >
        <div
          className={`absolute w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${
            isBusiness ? "translate-x-0" : "translate-x-12"
          }`}
        >
          {isBusiness ? (
            <FaBriefcase className="text-black text-lg" />
          ) : (
            <FaShoppingCart className="text-black text-lg" />
          )}
        </div>
      </div>

      {/* 📱 Mobile View - Pill Style */}
      <div className="flex md:hidden  rounded-full border border-gray-300 overflow-hidden shadow-sm">
        {/* User Option */}
        <button
          className={`px-4 py-2 w-40 h-full text-lg font-medium transition-all duration-300 ${
            !isBusiness
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => {
            dispatch(setMode("user"));
            navigate("/");
          }}
        >
          User
        </button>

        {/* Business Option */}
        <button
          className={`px-4 py-2 text-lg w-40 h-full font-medium transition-all duration-300 ${
            isBusiness
              ? "bg-green-100 text-green-700"
              : "bg-white text-gray-600"
          }`}
          onClick={() => dispatch(setMode("business"))}
        >
          <span className="font-semibold">Business</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryToggle;
