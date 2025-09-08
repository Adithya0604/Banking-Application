let accessToken = null;

export default function setAccessToken(token) {
  accessToken = token;
}

export async function fetchWithAuth(url, options = {}) {
  try {
    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
    });

    if (res.status === 401) {
      const refresh = await fetch(
        "http://localhost:8003/api/user/refreshToken",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const refreshData = await refresh.json();

      if (refreshData.success) {
        accessToken = refreshData.accessToken;
        res = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: "include",
        });
      }
    }

    return res;
  } catch (err) {
    console.error("Fetch error:", err);
    return { error: err.message };
  }
}
