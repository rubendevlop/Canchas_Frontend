import CardField from "./CardField";
import { useState, useEffect, useContext } from "react";
import ReserveModal from "./ReserveModal";
import { getField } from "../helpers/field";
import { UserContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const ListCardField = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loadUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);

        const data = await getField();

        if (Array.isArray(data)) {
          setFields(data);
        } else if (Array.isArray(data?.fields)) {
          setFields(data.fields);
        } else {
          setFields([]);
        }
      } catch (error) {
        console.error("Error cargando canchas:", error);
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleOpenModal = async (field) => {
    const currentUser = user?._id ? user : await loadUserData();

    if (!currentUser?._id) {
      alert("Debes iniciar sesión para reservar una cancha");
      navigate("/login", { state: { from: location } });
      return;
    }

    setSelectedCourt(field);
  };

  if (loading) {
    return <div className="container px-4">Cargando canchas...</div>;
  }

  return (
    <div className="container px-4">
      <div className="row col-12">
        {fields.length === 0 ? (
          <p>No hay canchas disponibles</p>
        ) : (
          fields.map((field) => (
            <CardField
              key={field._id}
              court={field}
              openModal={() => handleOpenModal(field)}
            />
          ))
        )}
      </div>

      {selectedCourt && (
        <ReserveModal
          court={selectedCourt}
          closeModal={() => setSelectedCourt(null)}
        />
      )}
    </div>
  );
};

export default ListCardField;
