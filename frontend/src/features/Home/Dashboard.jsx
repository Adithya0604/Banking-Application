import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    return navigate("/create-account");
  };
  const handleViewAccounts = () => {
    return navigate("/view-account");
  };
  const handleMoneyTransfer = () => {
    return navigate("/money-transfer");
  };
  const handleLogOut = () => {
    console.log("Logout");
  };

  return (
    <div>
      <button onClick={handleCreateAccount}>Create Account</button>
      <button onClick={handleViewAccounts}>View Accounts</button>
      <button onClick={handleMoneyTransfer}>Transfer Money</button>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  );
}

export default Dashboard;
