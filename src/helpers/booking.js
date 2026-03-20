const url = `${import.meta.env.VITE_API_URL}/book/booking`;
const BOOKING_HOURS = [18, 19, 20, 21, 22, 23];

export const formatBookingDateValue = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate.toISOString();
};

export const getBookingHours = () => BOOKING_HOURS;

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

export const flattenBookingSlots = (booking, field) => {
  if (!booking) return [];

  return BOOKING_HOURS.map((hour) => {
    const key = `time${hour}hs`;
    const slot = booking[key];

    if (!slot?.status || slot.status === "Cancelada") {
      return null;
    }

    return {
      id: `${booking._id || field?._id || "booking"}-${hour}`,
      hour,
      status: slot.status,
      userId: slot.user || null,
      fieldId: booking.field || field?._id || null,
      fieldName: field?.name || "Cancha",
      date: booking.date,
      bookingId: booking._id || null,
      price: booking.price ?? field?.pricePerHour ?? null,
    };
  }).filter(Boolean);
};

export const getBookingsByDate = async (date, fields = []) => {
  const normalizedDate = formatBookingDateValue(date);
  const bookings = await Promise.all(
    fields.map(async (field) => {
      const booking = await getBooking(normalizedDate, field._id);
      return flattenBookingSlots(booking, field);
    })
  );

  return bookings.flat().sort((a, b) => {
    if (a.hour !== b.hour) return a.hour - b.hour;
    return a.fieldName.localeCompare(b.fieldName);
  });
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
