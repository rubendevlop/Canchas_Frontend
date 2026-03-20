import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getField } from "../helpers/field";
import { formatBookingDateValue, getBookingsByDate } from "../helpers/booking";
import { generateDays } from "../helpers/date";

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
    <main className="container py-4 py-md-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2" style={{ color: "var(--color-title)" }}>
          Mis reservas
        </h1>
        <p className="text-muted mb-0">
          Acá ves tus turnos confirmados para los próximos días.
        </p>
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
        <div className="bg-white border rounded-4 shadow-sm p-4 text-center">
          <h5 className="fw-bold mb-2">Todavía no tenés reservas visibles</h5>
          <p className="text-muted mb-0">
            Cuando reserves una cancha, la vas a ver listada acá.
          </p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="row g-3">
          {bookings.map((booking) => (
            <div className="col-12 col-md-6 col-xl-4" key={booking.id}>
              <article className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <div className="text-muted small text-uppercase fw-semibold mb-1">
                        {formatDisplayDate(booking.date)}
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
                    <span className="badge rounded-pill text-bg-light border">
                      {formatBookingDateValue(booking.date).slice(0, 10)}
                    </span>
                  </div>

                  <div className="small text-muted">
                    {booking.price ? `Precio registrado: $${booking.price}` : "Precio no disponible"}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyBookingsView;
