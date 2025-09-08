import "./App.css";
import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Dashboard from "./features/Home/dashboard";
import DashboardComponent from "./component/DashboardComponent";
import ViewAccountComponent from "./component/ViewAccountComponent";
import MoneyTransferComponent from "./component/MoneyTransferComponent";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-account" element={<DashboardComponent />} />
        <Route path="/view-account" element={<ViewAccountComponent />} />
        <Route path="/money-transfer" element={<MoneyTransferComponent />} />
      </Routes>
    </>
  );
}

export default App;
