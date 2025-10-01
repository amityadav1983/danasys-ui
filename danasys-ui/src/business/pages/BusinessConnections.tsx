import React, { useEffect, useState } from "react";

interface BusinessConnection {
  userProfileId: number;
  displayName: string;
  profileImagePath: string;
  clearedPoint: number;
  unclearedPoint: number;
  companyLogo?: string | null;
  totalConnection: number;
  child: BusinessConnection[];
}

const fetchUserDetails = async (): Promise<{ userProfileId: number }> => {
  const res = await fetch(`/api/user/getUserDetails`);
  if (!res.ok) throw new Error("Failed to fetch user details");
  const data = await res.json();
  return { userProfileId: data.userProfileId };
};

const fetchBusinessConnections = async (
  userId: number
): Promise<BusinessConnection> => {
  const res = await fetch(`/api/order/myConnections/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
};

const ConnectionCard: React.FC<{
  node: BusinessConnection;
  onClick: () => void;
}> = ({ node, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center bg-white shadow-md rounded-xl p-4 border border-gray-200 w-48 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
  >
    <img
      src={node.profileImagePath}
      alt={node.displayName}
      className="w-14 h-14 rounded-full border mb-2 object-cover"
    />
    <h4 className="text-sm font-semibold text-gray-800 text-center">
      {node.displayName}
    </h4>
    <p className="text-xs text-gray-500 text-center">
      ✅ {node.clearedPoint} | ⏳ {node.unclearedPoint}
    </p>
    <p className="text-[10px] text-gray-400 mt-1">
      Connections: {node.totalConnection}
    </p>
  </div>
);

const TreeNode: React.FC<{ node: BusinessConnection; alwaysExpanded?: boolean }> = ({
  node,
  alwaysExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(alwaysExpanded);
  const [children, setChildren] = useState<BusinessConnection[]>(node.child || []);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (node.totalConnection === 0) return;

    // If already expanded, collapse
    if (expanded) {
      setExpanded(false);
      return;
    }

    // Expand and fetch children if not already loaded
    setExpanded(true);
    if (children.length === 0) {
      try {
        setLoading(true);
        const data = await fetchBusinessConnections(node.userProfileId);
        setChildren(data.child || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Current Node */}
      <ConnectionCard node={node} onClick={handleClick} />

      {/* Children */}
      {(expanded || alwaysExpanded) && (
        <div className="flex justify-center mt-6 relative">
          {/* Vertical line */}
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div className="h-6 w-px bg-gray-400"></div>
          </div>

          {loading ? (
            <div className="text-xs text-gray-500 mt-4">Loading...</div>
          ) : (
            <div className="flex gap-12 mt-6">
              {children.map((child) => (
                <div key={child.userProfileId} className="relative flex flex-col items-center">
                  {/* Connector line */}
                  <div className="absolute -top-6 w-px h-6 bg-gray-400"></div>
                  {/* Child nodes */}
                  <TreeNode node={child} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BusinessConnections: React.FC = () => {
  const [root, setRoot] = useState<BusinessConnection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { userProfileId } = await fetchUserDetails();
        const data = await fetchBusinessConnections(userProfileId);
        setRoot(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading connections...</div>;
  }

  if (!root) {
    return <div className="p-6 text-red-500">No connections found.</div>;
  }

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-8 text-center">
        🌐 My Business Connections
      </h2>

      <div className="flex justify-center overflow-auto max-w-full">
        {/* Root node - show its direct children by default */}
        <TreeNode node={root} alwaysExpanded />
      </div>
    </div>
  );
};

export default BusinessConnections;
