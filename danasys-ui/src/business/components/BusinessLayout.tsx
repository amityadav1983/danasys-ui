import BusinessHeader from "./BusinessHeader";
import BusinessSideMenu from "./BusinessSideMenu";

type Props = {
  component: React.ReactElement;
};

const BusinessLayout = ({ component }: Props) => {
  return (
<div className="flex min-h-screen bg-[#F9F9FF] overflow-hidden">
      <BusinessSideMenu />
      <div className="flex-1 flex flex-col ml-64">
        <BusinessHeader />
        <main className="flex-1 p-6 overflow-y-auto">{component}</main>
      </div>
    </div>
  );
};

export default BusinessLayout;
