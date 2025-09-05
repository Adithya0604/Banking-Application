import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import { userRegister } from "./authApi";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    isPhoneVerified: false,
    DOB: "",
    Address: "",
    State: "",
    PostalCode: "",
    Country: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Simple front-end validations
    for (let field in formData) {
      if (!formData[field] && field !== "isPhoneVerified") {
        return setErrors({ [field]: `${field} is required` });
      }
    }

    const response = await userRegister(formData);

    if (response.status === 201) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      setErrors({
        api: response.MissingFields || response.message || response.ExistedUser,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="FirstName"
        value={formData.FirstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      {errors.FirstName && <p>{errors.FirstName}</p>}

      <input
        name="LastName"
        value={formData.LastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      {errors.LastName && <p>{errors.LastName}</p>}

      <input
        name="Email"
        value={formData.Email}
        onChange={handleChange}
        placeholder="Email"
      />
      {errors.Email && <p>{errors.Email}</p>}

      <input
        name="Password"
        type="password"
        value={formData.Password}
        onChange={handleChange}
        placeholder="Password"
        autocomplete="current-password"
      />
      {errors.Password && <p>{errors.Password}</p>}

      <input
        name="PhoneNumber"
        value={formData.PhoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      {errors.PhoneNumber && <p>{errors.PhoneNumber}</p>}

      <input
        name="DOB"
        type="date"
        value={formData.DOB}
        onChange={handleChange}
      />
      {errors.DOB && <p>{errors.DOB}</p>}

      <input
        name="Address"
        value={formData.Address}
        onChange={handleChange}
        placeholder="Address"
      />
      {errors.Address && <p>{errors.Address}</p>}

      <input
        name="State"
        value={formData.State}
        onChange={handleChange}
        placeholder="State"
      />

      <input
        name="PostalCode"
        value={formData.PostalCode}
        onChange={handleChange}
        placeholder="Postal Code"
      />

      <input
        name="Country"
        value={formData.Country}
        onChange={handleChange}
        placeholder="Country"
      />
      {errors.Country && <p>{errors.Country}</p>}

      <button type="submit">Register</button>
      {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
    </form>
  );
}
