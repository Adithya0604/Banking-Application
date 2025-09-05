import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAccountCreation } from "../features/auth/authApi";

function DashboardComponent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    balance: "",
    currency: "",
    userId: "",
    branch: "",
    accountStatus: "",
    lastTransactionDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const newError = {};
    for (let feild in formData) {
      if (!formData[feild]) {
        newError[feild] = `${feild} is required`;
      }
    }

    if (Object.keys(newError).length > 0) {
      setErrors(newError);
      return;
    }

    const response = await userAccountCreation(formData);

    if (response.status === 201) {
      alert("Account Creation");
      navigate("/dashboard");
    } else {
      setErrors({
        api: response.MissingFeilds || response.message || response.ExistedUser,
      });
    }
  };

  console.log(formData);

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
          }}
        >
          <label>accountNumber</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.accountNumber && <p>{errors.accountNumber}</p>}
          <label>ifscCode</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.ifscCode && <p>{errors.ifscCode}</p>}
          <label>accountType</label>
          <input
            type="text"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.accountType && <p>{errors.accountType}</p>}
          <label>balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.balance && <p>{errors.balance}</p>}
          <label>currency</label>
          <input
            type="text"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.currency && <p>{errors.currency}</p>}
          <label>userId</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.userId && <p>{errors.userId}</p>}
          <label>branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.branch && <p>{errors.branch}</p>}
          <label>accountStatus</label>
          <input
            type="text"
            name="accountStatus"
            value={formData.accountStatus}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.accountStatus && <p>{errors.accountStatus}</p>}
          <label>lastTransactionDate</label>
          <input
            type="date"
            name="lastTransactionDate"
            value={formData.lastTransactionDate}
            onChange={handleChange}
            autoSave="true"
          />
          {errors.lastTransactionDate && <p>{errors.lastTransactionDate}</p>}

          <button type="submit">Create Account</button>
          {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
        </form>
      </div>
    </>
  );
}

export default DashboardComponent;
