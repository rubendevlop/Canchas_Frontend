import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getField } from "../helpers/field";
import { formatBookingDateValue, getBookingsByDate } from "../helpers/booking";
import { generateDays } from "../helpers/date";
import "../css/my-bookings.css";

const MyBookingsView = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const datesToLoad = useMemo(() => generateDays(10), []);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?._id) {
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
          .filter((booking) => booking.userId === user._id)
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

    loadBookings();
  }, [datesToLoad, user]);

  const formatDisplayDate = (date) =>
    new Date(date).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

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
          <div className="row g-4">
            {bookings.map((booking) => (
              <div className="col-12 col-md-6 col-xl-4" key={booking.id}>
                <article className="my-booking-card h-100">
                  <div className="my-booking-card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div>
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
