import React from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../utlis/fetchWithAuth"; // FIXED import

const tokenFromStorage = localStorage.getItem("accessToken");
if (tokenFromStorage) {
  setAccessToken(tokenFromStorage);
}

function Dashboard() {
  const navigate = useNavigate();

  const handleCreateAccount = () => navigate("/create-account");
  const handleViewAccounts = () => navigate("/view-account");
  const handleMoneyTransfer = () => navigate("/money-transfer");
  const handleViewTransfer = () => navigate("/view-transfer");
  const handleLogOut = () => {
    localStorage.removeItem("accessToken"); // clear token on logout
    setAccessToken(null); // clear in-memory token
    navigate("/login"); // redirect to login
  };

  return (
    <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
      <button onClick={handleCreateAccount}>Create Account</button>
      <button onClick={handleViewAccounts}>View Accounts</button>
      <button onClick={handleMoneyTransfer}>Transfer Money</button>
      <button onClick={handleViewTransfer}>View Transfer</button>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  );
}

export default Dashboard;
