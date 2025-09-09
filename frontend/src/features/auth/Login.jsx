import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "./authApi";
import { setAccessToken } from "../../utlis/fetchWithAuth"; 

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    // validation
    const newErrors = {};
    for (let field in formData) {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    }

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    // login API call
    const response = await userLogin(formData);

    if (response.status === 200 && response.accessToken) {
      setAccessToken(response.accessToken); 
      alert("Login Successful!");
      navigate("/dashboard");
    } else {
      setErrors({
        api: response.MissingFields || response.message || response.ExistedUser,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} method="post">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <button type="submit">Login</button>
        {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
      </form>
    </>
  );
}
