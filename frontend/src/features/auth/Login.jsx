import { useState } from "react";
import { userLogin } from "./authApi";

export default function Login() {
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
    for (let field in formData) {
      if (!formData[field]) {
        return setErrors({ [field]: `${field} is required` });
      }
    }

    const response = await userLogin(formData);

    if (response.status === 200) {
      alert("Login Successful!");
    } else {
      setErrors({
        api: response.MissingFeilds || response.message || response.ExistedUser,
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
        {errors.email && <p>{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        {errors.password && <p>{errors.password}</p>}

        <button type="submit">Login</button>
        {errors.api && <p>{errors.api}</p>}
      </form>
    </>
  );
}
