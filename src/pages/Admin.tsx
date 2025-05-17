import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("adminAuthenticated");
    setIsAuthenticated(!!authStatus);

    // Check if the URL is correct
    if (window.location.pathname !== "/secure-merchant-admin-panel") {
      navigate("/secure-merchant-admin-panel");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default Admin;
