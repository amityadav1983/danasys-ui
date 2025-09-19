import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import BusinessHeader from "./BusinessHeader";
import BusinessSideMenu from "./BusinessSideMenu";

type Props = {
  component: React.ReactElement;
};

const BusinessLayout = ({ component }: Props) => {
  const navigate = useNavigate();
  const currentMode = useAppSelector((state) => state.mode.currentMode);

  console.log('BusinessLayout rendered with currentMode:', currentMode);

  useEffect(() => {
    console.log('BusinessLayout: currentMode changed to', currentMode);
    if (currentMode === 'user') {
      console.log('BusinessLayout: Mode is user, navigating to home');
      navigate('/');
    }
  }, [currentMode, navigate]);

  if (currentMode === 'user') {
    return null; // or render a loading state
  }

  return (
<div className="flex min-h-screen bg-white overflow-hidden ">
      <BusinessSideMenu />
      <div className="flex-1 flex flex-col ml-64">
        <BusinessHeader />
        <main className="flex-1 p-6">{component}</main>
      </div>
    </div>
  );
};

export default BusinessLayout;
