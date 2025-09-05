export async function userRegister(userData) {
  const response = await fetch("http://localhost:8003/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return { status: response.status, ...data };
}

export async function userLogin(userData) {
  const response = await fetch("http://localhost:8003/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  const data = await response.json();
  return { status: response.status, ...data };
}

export async function userAccountCreation(userData) {
  const response = await fetch(
    "http://localhost:8003/api/user/AccountCreation/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();
  return { status: response.status, ...data };
}
