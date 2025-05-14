import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("adminAuthenticated");
      setIsAuthenticated(!!auth);
      if (auth) {
        navigate("/admin/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div>
      <AdminLogin />
    </div>
  );
};

export default Admin;
