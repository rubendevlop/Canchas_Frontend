import { getFriendlyErrorMessage } from "./handleApiError";

const url = `${import.meta.env.VITE_API_URL}/login`;
const LOGOUT_FLAG_KEY = "auth:manual_logout";
const LOGIN_FAILED_MESSAGE =
  "No se pudo iniciar sesion. Revisa tus datos y, si la cuenta fue suspendida o reactivada hace poco, contacta al administrador.";

const getRegisterMessage = (data, fallbackMessage) => {
  if (Array.isArray(data?.msg) && data.msg.length > 0) {
    return data.msg.map((error) => error.msg).join("\n");
  }

  if (typeof data?.msg === "string") {
    return data.msg;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallbackMessage;
};

const readJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const getLoginErrorMessage = (response, data) => {
  const backendMessage = data?.msg || data?.message || "";
  const payloadText = String(backendMessage || "").toLowerCase();
  const looksLikeCredentialError =
    payloadText.includes("credenciales incorrectas") ||
    payloadText.includes("incorrect credentials") ||
    payloadText.includes("invalid credentials") ||
    payloadText.includes("contrasen") ||
    payloadText.includes("password") ||
    payloadText.includes("correo") ||
    payloadText.includes("email");

  if (looksLikeCredentialError) {
    return LOGIN_FAILED_MESSAGE;
  }

  return getFriendlyErrorMessage(response, data, LOGIN_FAILED_MESSAGE);
};

const logIn = async (email, password) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await readJsonSafely(response);

  if (!response.ok) {
    return {
      ...data,
      ok: false,
      message: getLoginErrorMessage(response, data),
    };
  }

  if (data?.ok !== false) {
    localStorage.removeItem(LOGOUT_FLAG_KEY);
  }

  return data;
};

const getProfile = async () => {
  const response = await fetch(`${url}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    credentials: "include",
    cache: "no-store",
  });

  const data = await readJsonSafely(response);
  return { ok: response.ok, data };
};

const registerUser = async (userData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await readJsonSafely(response);

  return {
    ...data,
    ok: Boolean(response.ok && (data.ok ?? true)),
    status: response.status,
    message: getRegisterMessage(
      data,
      response.ok ? "Usuario creado con exito" : "Error al crear el usuario"
    ),
  };
};

export { logIn, getProfile, registerUser };
