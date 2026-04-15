const url = `${import.meta.env.VITE_API_URL}/fields`;

const getField = async (adminRequest = false) => {
  try {
    const opts = adminRequest ? { credentials: "include" } : {};
    const response = await fetch(url, opts);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudieron cargar las canchas");
    }

    return data.fields || [];
  } catch (error) {
    console.error("Error al obtener canchas:", error);
    throw error;
  }
};

const saveField = async (id, data) => {
  const targetUrl = id ? `${url}/${id}` : url;
  const method = id ? "PUT" : "POST";
  const response = await fetch(targetUrl, { method, body: data, credentials: "include" });
  return await response.json();
};

const deleteField = async (id) => {
  const response = await fetch(`${url}/${id}`, { method: "DELETE", credentials: "include" });
  return await response.json();
};

export { getField, saveField, deleteField };
