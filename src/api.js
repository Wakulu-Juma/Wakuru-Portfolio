const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://backend-potfolio-37dj.onrender.com";

export async function get(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

export async function post(path, body) {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

export { API_BASE };
