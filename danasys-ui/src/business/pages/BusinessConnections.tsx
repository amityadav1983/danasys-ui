import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  expandable: boolean;
  expanded: boolean;
}> = ({ node, onClick, expandable, expanded }) => (
  <div
    onClick={onClick}
    className="relative flex flex-col items-center bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-4 border border-gray-200 w-56 cursor-pointer transition-all hover:shadow-2xl hover:brightness-105"

  >
    {/* Company Logo overlay (if available) */}
    {node.companyLogo && (
      <img
        src={node.companyLogo}
        alt="logo"
        className="absolute -top-3 -right-3 w-10 h-10 rounded-full border bg-white shadow"
      />
    )}

    <img
      src={node.profileImagePath}
      alt={node.displayName}
      className="w-16 h-16 rounded-full border-2 border-blue-500 mb-2 object-cover"
    />

    <h4 className="text-sm font-semibold text-gray-800 text-center">
      {node.displayName}
    </h4>

    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
      <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
        ✅ {node.clearedPoint}
      </span>
      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full">
        ⏳ {node.unclearedPoint}
      </span>
    </div>

    <p className="text-[11px] text-gray-400 mt-2">
      Connections: {node.totalConnection}
    </p>

    {expandable && (
      <div className="absolute bottom-2 right-2">
        {expanded ? (
          <ChevronDown size={18} className="text-gray-500" />
        ) : (
          <ChevronRight size={18} className="text-gray-500" />
        )}
      </div>
    )}
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

    if (expanded) {
      setExpanded(false);
      return;
    }

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
      <ConnectionCard
        node={node}
        onClick={handleClick}
        expandable={node.totalConnection > 0}
        expanded={expanded}
      />

      {/* Children */}
      {(expanded || alwaysExpanded) && (
        <div className="flex justify-center mt-8 relative">
          {/* Vertical line */}
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div className="h-6 w-px bg-gradient-to-b from-blue-400 to-blue-200"></div>
          </div>

          {loading ? (
            <div className="text-xs text-gray-500 mt-4 animate-pulse">
              Loading...
            </div>
          ) : (
            <div className="flex gap-12 mt-6 flex-wrap">
              {children.map((child) => (
                <div
                  key={child.userProfileId}
                  className="relative flex flex-col items-center"
                >
                  {/* Connector line */}
                  <div className="absolute -top-6 w-px h-6 bg-gradient-to-b from-blue-400 to-blue-200"></div>
                  {/* Child Node */}
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
    return (
      <div className="p-6 text-gray-500 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!root) {
    return <div className="p-6 text-red-500 text-center">No connections found.</div>;
  }

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
        🌐 My Business Connections
      </h2>

      <div className="flex justify-center overflow-auto max-w-full">
        <TreeNode node={root} alwaysExpanded />
      </div>
    </div>
  );
};

export default BusinessConnections;
