import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { hide as hideModal } from "../store/modal";
import OrderSuccessModal from "./OrderSuccessModal";
import LoginModal from "./LoginModal";
import UpdateProfile from "./Updates/UpdateProfile";
import UpdateAddress from "./Updates/UpdateAddress";
import UpdatePassword from "./Updates/UpdatePassword";
import MyConnections from "./MyRef/MyConnections";
import MyReferences from "./MyRef/MyReferences";

const Modal = () => {
  const { type, data } = useAppSelector((state) => state.modal.modalData);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(hideModal());
  };

  const output =
    type === "discount" ? (
      null
    ) : type === "orderSuccess" && data ? (
      <OrderSuccessModal data={data} />
    ) : type === "login" ? (
      <LoginModal
        isOpen={true}
        onClose={handleClose}
        onLogin={async (credentials) => {
          console.log("User attempted login", credentials);
        }}
      />
    ) : type === "updateProfile" ? (
      <UpdateProfile onClose={handleClose}/>
    ) : type === "updateAddress" ? (
      <UpdateAddress onClose={handleClose} />
    ) : type === "updatePassword" ? (
      <UpdatePassword onClose={handleClose} />
    ) : type === "myConnections" ? (
      <MyConnections />
    ) : type === "myReferences" ? (
      <MyReferences onBack={handleClose} />
    ) : null;

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 overflow-hidden p-4">
      <div
        className="absolute z-10 inset-0 bg-black bg-opacity-[.65]"
        onClick={handleClose}
      />
      <div className="_modal">{output}</div>
    </div>
  );
};

export default Modal;
