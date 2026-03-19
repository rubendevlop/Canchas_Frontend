const url = `${import.meta.env.VITE_API_URL}/book/booking`;

export const getBooking = async (date, fieldId) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, fieldId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener reservas");
    }

    return data.msg;
  } catch (error) {
    console.log("getBooking error:", error);
    return null;
  }
};

const reserveUrl = `${import.meta.env.VITE_API_URL}/book/reserveBooking`;

export const reserveBooking = async (fieldId, date, time, userId) => {
  try {
    const response = await fetch(reserveUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        fieldId,
        date,
        time,
        userId,
        status: "Confirmada",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al reservar");
    }

    return data;
  } catch (error) {
    console.log("reserveBooking error:", error);
    return { ok: false, message: error.message };
  }
};
