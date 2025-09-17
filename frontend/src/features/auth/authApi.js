// features/auth/authApi.js

import { setAccessToken, fetchWithAuth } from "../../utlis/fetchWithAuth";

// User Registration
export async function userRegister(userData) {
  const response = await fetch("http://localhost:8003/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return { status: response.status, ...data };
}

// User Login
export async function userLogin(userData) {s
  console.log("in here");

  const response = await fetch("http://localhost:8003/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  const data = await response.json();

  // Save access token if login successful
  if (response.status === 200 && data.accessToken){ 
    setAccessToken(data.accessToken);
  }

  return { status: response.status, ...data };
}

// Account Creation
export async function userAccountCreation(userData) {
  const response = await fetch(
    "http://localhost:8003/api/user/AccountCreation/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }
  );
  const data = await response.json();
  return { status: response.status, ...data };
}

// Money Transfer
export async function userMoneyTransfer(userData) {
  try {
    const response = await fetchWithAuth(
      "http://localhost:8003/api/user/Transaction/Transfer/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    return { status: response.status, ...data };
  } catch (err) {
    return { status: "Error", message: err.message };
  }
}

// LogOut
export async function userLogout() {
  try {
    const response = await fetch("http://localhost:8003/api/user/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }

    return { status: response.status, ...data };
  } catch (err) {
    return { status: "Error", message: err.message };
  }
}
