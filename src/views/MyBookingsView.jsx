import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getField } from "../helpers/field";
import { cancelBooking, formatBookingDateValue, getBookingsByDate } from "../helpers/booking";
import { generateDays } from "../helpers/date";
import "../css/my-bookings.css";

const MyBookingsView = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const datesToLoad = useMemo(() => generateDays(10), []);

  const loadBookings = async (currentUser = user) => {
    if (!currentUser?._id) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fieldsData = await getField();
      const availableFields = Array.isArray(fieldsData) ? fieldsData : [];

      const bookingsByDate = await Promise.all(
        datesToLoad.map((date) => getBookingsByDate(date, availableFields))
      );

      const userBookings = bookingsByDate
        .flat()
        .filter((booking) => String(booking.userId) === String(currentUser._id))
        .sort((a, b) => {
          const dateDiff = new Date(a.date) - new Date(b.date);
          if (dateDiff !== 0) return dateDiff;
          return a.hour - b.hour;
        });

      setBookings(userBookings);
    } catch (loadError) {
      console.error("Error cargando mis reservas:", loadError);
      setError("No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [datesToLoad, user]);

  const formatDisplayDate = (date) =>
    new Date(date).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  const handleCancelBooking = async (booking) => {
    if (!booking?.fieldId || !booking?.date || !booking?.userId) {
      alert("No se encontraron los datos necesarios para cancelar esta reserva.");
      return;
    }

    const confirmed = window.confirm(
      `Vas a cancelar tu reserva de ${booking.fieldName} a las ${booking.hour}:00 hs.`
    );

    if (!confirmed) return;

    setCancellingId(booking.id);

    try {
      const response = await cancelBooking(
        booking.fieldId,
        booking.date,
        booking.hour,
        booking.userId
      );

      if (!response?.ok) {
        throw new Error(response?.message || response?.msg || "No se pudo cancelar la reserva");
      }

      await loadBookings(user);
      alert("Reserva cancelada correctamente");
    } catch (cancelError) {
      console.error("Error cancelando reserva:", cancelError);
      alert(cancelError.message || "No se pudo cancelar la reserva");
    } finally {
      setCancellingId("");
    }
  };

  return (
    <main className="my-bookings-page">
      <section className="my-bookings-hero container">
        <div className="my-bookings-hero-card">
          <span className="my-bookings-kicker">Tus turnos</span>

          <div className="row g-4 align-items-end">
            <div className="col-12 col-lg-8">
              <h1 className="my-bookings-title">Mis reservas</h1>
              <p className="my-bookings-subtitle">
                Revisa rapido tus proximos partidos, la cancha asignada y el horario confirmado.
              </p>
            </div>

            <div className="col-12 col-lg-4">
              <div className="my-bookings-summary">
                <span className="my-bookings-summary-label">Proximas reservas</span>
                <strong>{bookings.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="my-bookings-empty text-center">
            <h5 className="fw-bold mb-2">Todavia no tenes reservas visibles</h5>
            <p className="text-muted mb-0">
              Cuando reserves una cancha, la vas a ver listada aca.
            </p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="row g-4 justify-content-center">
            {bookings.map((booking) => (
              <div className="col-12 col-md-6 col-xl-6" key={booking.id}>
                <article className="my-booking-card h-100">
                  <div className="my-booking-card-body">
                    <div className="my-booking-head">
                      <div className="my-booking-head-main">
                        <div className="my-booking-date">
                          {formatDisplayDate(booking.date)}
                        </div>
                        <h5 className="my-booking-field">{booking.fieldName}</h5>
                      </div>
                      <span className="my-booking-status">{booking.status}</span>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="my-booking-pill">{booking.hour}:00 hs</span>
                      <span className="my-booking-pill">
                        {formatBookingDateValue(booking.date).slice(0, 10)}
                      </span>
                    </div>

                    <div className="my-booking-price">
                      {booking.price
                        ? `Precio registrado: $${booking.price}`
                        : "Precio no disponible"}
                    </div>

                    <div className="my-booking-actions">
                      <button
                        type="button"
                        className="btn btn-outline-danger fw-semibold"
                        onClick={() => handleCancelBooking(booking)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? "Cancelando..." : "Cancelar reserva"}
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyBookingsView;
