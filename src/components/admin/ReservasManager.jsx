import { useEffect, useMemo, useState } from "react";
import { getField } from "../../helpers/field";
import { getBookingsByDate } from "../../helpers/booking";
import { generateDays } from "../../helpers/date";

export const ReservasManager = () => {
  const dateOptions = useMemo(() => generateDays(7), []);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const fields = await getField();
        const availableFields = Array.isArray(fields) ? fields : [];
        const bookingsData = await getBookingsByDate(selectedDate, availableFields);
        setBookings(bookingsData);
      } catch (loadError) {
        console.error("Error cargando reservas:", loadError);
        setError("No se pudieron cargar las reservas.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [selectedDate]);

  const formatDateOption = (date) =>
    new Date(date).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <section>
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 className="m-0 fw-bold" style={{ color: "var(--color-title)" }}>
            Gestión de reservas
          </h2>
          <p className="text-muted mb-0">
            Visualizá las reservas confirmadas por cancha y horario.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {dateOptions.map((date) => {
            const isActive =
              selectedDate &&
              new Date(selectedDate).toDateString() === new Date(date).toDateString();

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={`btn btn-sm ${isActive ? "text-white" : "btn-outline-secondary"}`}
                style={isActive ? { backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)" } : {}}
                onClick={() => setSelectedDate(date)}
              >
                {formatDateOption(date)}
              </button>
            );
          })}
        </div>
      </div>

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
        <div className="p-5 text-center bg-light rounded border">
          <h4 className="fw-bold mb-2">No hay reservas para esta fecha</h4>
          <p className="text-muted mb-0">
            Probá con otro día para revisar la ocupación de las canchas.
          </p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="row g-3">
          {bookings.map((booking) => (
            <div className="col-12 col-md-6 col-xl-4" key={booking.id}>
              <article className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <div className="text-muted small text-uppercase fw-semibold mb-1">
                        {formatDateOption(booking.date)}
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: "var(--color-title)" }}>
                        {booking.fieldName}
                      </h5>
                    </div>
                    <span className="badge text-bg-success">{booking.status}</span>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge rounded-pill text-bg-light border">
                      {booking.hour}:00 hs
                    </span>
                    {booking.price && (
                      <span className="badge rounded-pill text-bg-light border">
                        ${booking.price}
                      </span>
                    )}
                  </div>

                  <div className="small text-muted">
                    Usuario: {booking.userId || "Sin asignar"}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
