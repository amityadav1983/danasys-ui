import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaUsers } from "react-icons/fa";

interface Connection {
  displayName: string;
  profileImagePath: string;
  clearedPoint: number;
  unclearedPoint: number;
  companyLogo?: string | null;
  totalConnection: number;
  child: Connection[];
}

const fetchConnections = async (userProfileId: number): Promise<Connection> => {
  const res = await fetch(`http://localhost:8080/myConnections/${userProfileId}`);
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
};

const ConnectionNode: React.FC<{
  node: Connection;
  level?: number;
}> = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<Connection[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (!children && node.totalConnection > 0) {
      try {
        setLoading(true);
        const data = await fetchConnections(1); // 🔹 abhi ke liye fixed id = 1
        setChildren(data.child);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="ml-4 mt-3">
      <div
        className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
        onClick={toggleExpand}
      >
        <img
          src={node.profileImagePath}
          alt={node.displayName}
          className="w-10 h-10 rounded-full border object-cover"
        />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800">
            {node.displayName}
          </h4>
          <p className="text-xs text-gray-500">
            Cleared: {node.clearedPoint} | Unclear: {node.unclearedPoint}
          </p>
        </div>
        {node.totalConnection > 0 && (
          loading ? (
            <span className="text-xs text-gray-400">Loading...</span>
          ) : (
            <span className="text-gray-500">
              {expanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          )
        )}
      </div>

      {/* Children */}
      {expanded && children && (
        <div className="ml-6 border-l border-gray-300">
          {children.map((child, idx) => (
            <ConnectionNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const MyConnection: React.FC = () => {
  const [root, setRoot] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoot = async () => {
      try {
        const data = await fetchConnections(1); // 🔹 abhi ke liye parent id = 1
        setRoot(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRoot();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        Loading Connections...
      </div>
    );
  }

  if (!root) {
    return (
      <div className="flex items-center justify-center py-10 text-red-500">
        Failed to load connections.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
        <FaUsers className="text-indigo-500" /> My Connections
      </h2>
      <ConnectionNode node={root} />
    </div>
  );
};

export default MyConnection;
