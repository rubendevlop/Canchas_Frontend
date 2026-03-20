import "../css/cardfield.css";

const CardField = ({ court, openModal }) => {
  if (!court) return null;

  const { name = "Cancha", pricePerHour = 0, image, active = false } = court;

  const imageDefault =
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200";

  const buildImage = (img) => {
    if (!img || img.trim() === "") return imageDefault;

    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    return `${import.meta.env.VITE_API_URL}${img.startsWith("/") ? img : `/${img}`}`;
  };

  const imageSrc = buildImage(image);

  return (
    <section className="col-12 col-md-6 col-xl-4">
      <div className="card court-card shadow-sm h-100">
        <div className="position-relative court-image-shell">
          <img src={imageSrc} className="card-img-top" alt={name} />

          {active ? (
            <span className="badge-available text-success border border-success px-3 py-2 rounded-pill">
              Disponible
            </span>
          ) : (
            <span className="badge-available text-danger border border-danger px-3 py-2 rounded-pill">
              No disponible
            </span>
          )}
        </div>

        <div className="card-body court-card-body">
          <h5 className="court-title">{name}</h5>

          <div className="d-flex gap-2 flex-wrap mb-3">
            <span className="badge-tag">Futbol 5</span>
            <span className="badge-tag">Cesped sintetico</span>
            <span className="badge-tag">Al aire libre</span>
          </div>

          <p className="court-copy">
            Espacio listo para jugar comodo, reservar rapido y asegurar tu horario sin vueltas.
          </p>

          <div className="court-footer d-flex justify-content-between align-items-center">
            <div className="price-wrap">
              <h4 className="price">${Number(pricePerHour).toLocaleString("es-AR")}</h4>
              <small className="price-note">por hora</small>
            </div>

            <button className="btn-reserve" onClick={openModal} disabled={!active}>
              Reservar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardField;
