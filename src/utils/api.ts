const BASE_URL = "http://10.0.2.2:3000";

export const login = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("로그인 실패");

  return await response.json();
};

export const refreshToken = async (
  token: string
): Promise<{ newToken: string }> => {
  const response = await fetch(`${BASE_URL}/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("토큰 갱신 실패");

  return await response.json();
};
