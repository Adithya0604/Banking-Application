import React, { useState } from "react";
import { userMoneyTransfer } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";

export default function MoneyTransferComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNumberFrom: "",
    accountNumberTo: "",
    amount: "",
    narration: "",
    ifscCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleSAN = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const newError = {};
    for (let field in formData)
      if (!formData[field]) newError[field] = `This field ${field} is required`;
    if (Object.keys(newError).length > 0) return setErrors(newError);

    const response = await userMoneyTransfer(formData);

    if (response.status === 200) {
      alert("Money Transferred Successfully");
      navigate("/dashboard");
    } else {
      setErrors({
        api: response.Missingfields || response.message || response.ExistedUser,
      });
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <form onSubmit={handleSubmit} method="post">
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Sender's Account Number</label>
            <input
              type="text"
              name="accountNumberFrom"
              value={formData.accountNumberFrom}
              onChange={handleSAN}
              style={{ width: "100%" }}
            />
            {errors.accountNumberFrom && (
              <p style={{ color: "red" }}>{errors.accountNumberFrom}</p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label>Receiver's Account Number</label>
            <input
              type="text"
              name="accountNumberTo"
              value={formData.accountNumberTo}
              onChange={handleSAN}
              style={{ width: "100%" }}
            />
            {errors.accountNumberTo && (
              <p style={{ color: "red" }}>{errors.accountNumberTo}</p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleSAN}
              style={{ width: "100%" }}
            />
            {errors.amount && <p style={{ color: "red" }}>{errors.amount}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label>IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleSAN}
              style={{ width: "100%" }}
            />
            {errors.ifscCode && (
              <p style={{ color: "red" }}>{errors.ifscCode}</p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Narration</label>
            <input
              type="text"
              name="narration"
              value={formData.narration}
              onChange={handleSAN}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button type="submit" style={{ padding: "8px 20px" }}>
            Transfer Money
          </button>
        </div>
        {errors.api && (
          <p style={{ color: "red", textAlign: "center" }}>{errors.api}</p>
        )}
      </form>
    </div>
  );
}
