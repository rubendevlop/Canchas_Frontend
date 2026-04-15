const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const readJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const normalizeApiResult = (response, data) => ({
  ...data,
  ok: Boolean(response.ok && (data?.ok ?? true)),
  status: response.status,
});

const getUsers = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      credentials: "include",
    });

    const data = await readJsonSafely(response);
    const result = normalizeApiResult(response, data);

    if (!result.ok) {
      throw new Error(result.message || "Error al obtener usuarios");
    }

    return result;
  } catch (error) {
    console.log("getUsers error:", error);
    return { ok: false, message: error.message };
  }
};

const activateUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/activate`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await readJsonSafely(response);
    const result = normalizeApiResult(response, data);

    if (!result.ok) {
      throw new Error(result.message || "Error al activar usuario");
    }

    return result;
  } catch (error) {
    console.log("activateUser error:", error);
    return { ok: false, message: error.message };
  }
};

const suspendUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/suspend`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await readJsonSafely(response);
    const result = normalizeApiResult(response, data);

    if (!result.ok) {
      throw new Error(result.message || "Error al suspender usuario");
    }

    return result;
  } catch (error) {
    console.log("suspendUser error:", error);
    return { ok: false, message: error.message };
  }
};

export { getUsers, activateUser, suspendUser };
