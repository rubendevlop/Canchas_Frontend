import "../css/modal.css";
import close from "../assets/close.png";
const ReserveModal = ({ court, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="reserve-modal col-12 col-md-10 col-lg-7 col-xl-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeModal}>
          <img src={close} alt="Boton de cerrar Modal" />
        </button>

        <div className="modal-handle"></div>

        <h6>Reservar Turno</h6>

        <h5>{court.name}</h5>

        <p className="mt-3">Fecha</p>

        <p className="mt-3">Horarios Disponibles</p>

        <div className="reserve-footer">
          <span>{court.price}</span>

          <button className="btn-reserve" onClick={closeModal}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveModal;
