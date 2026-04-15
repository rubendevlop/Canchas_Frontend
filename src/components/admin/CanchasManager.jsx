import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getField, saveField, deleteField } from "../../helpers/field";

const IMAGE_DEFAULT =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200";
const FIELD_NAME_MIN = 2;
const FIELD_NAME_MAX = 20;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripValidationPrefix = (message) =>
  String(message || "")
    .trim()
    .replace(/^(field\s+)?validation failed:\s*/i, "")
    .replace(/^(name|pricePerHour|price|image|archivo|active)\s*:\s*/i, "");

const extractFieldMessage = (message, fieldName) => {
  const normalizedMessage = stripValidationPrefix(message);

  if (!normalizedMessage) {
    return "";
  }

  const parts = normalizedMessage.split(/,\s*(?=[a-zA-Z_]+\s*:)/);

  for (const part of parts) {
    const match = part.match(/^([a-zA-Z_]+)\s*:\s*(.+)$/);

    if (match && match[1].toLowerCase() === String(fieldName).toLowerCase()) {
      return match[2].trim();
    }
  }

  const fieldPrefix = new RegExp(`^${escapeRegExp(fieldName)}\\s*:\\s*`, "i");
  return normalizedMessage.replace(fieldPrefix, "").trim();
};

export const CanchasManager = () => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [preview, setPreview] = useState(IMAGE_DEFAULT);
  const [fieldSubmitError, setFieldSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      pricePerHour: "",
      active: true,
      imageFile: null,
    },
  });

  const obtenerCanchas = async () => {
    setLoading(true);

    try {
      const fields = await getField(true);
      if (fields) setCanchas(fields);
    } catch (error) {
      console.error("Error cargando canchas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCanchas();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setValue("imageFile", file, { shouldValidate: true });
      clearErrors("imageFile");
      setPreview(URL.createObjectURL(file));
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditandoId(null);
    setFieldSubmitError("");
    setPreview(IMAGE_DEFAULT);
    clearErrors();
  };

  const abrirModalCrear = () => {
    setEditandoId(null);
    setFieldSubmitError("");
    setPreview(IMAGE_DEFAULT);
    reset({
      name: "",
      pricePerHour: "",
      active: true,
      imageFile: null,
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (cancha) => {
    setEditandoId(cancha._id);
    setFieldSubmitError("");
    setPreview(cancha.image || IMAGE_DEFAULT);
    reset({
      name: cancha.name || "",
      pricePerHour: cancha.pricePerHour ?? "",
      active: cancha.active !== false,
      imageFile: null,
    });
    setMostrarModal(true);
  };

  const mapBackendFieldErrors = (res) => {
    const fieldMap = {
      name: "name",
      pricePerHour: "pricePerHour",
      price: "pricePerHour",
      image: "imageFile",
      archivo: "imageFile",
      active: "active",
    };
    const backendErrors = res?.errors;
    const backendDetails = res?.details;
    let hasMappedErrors = false;

    const registerMappedError = (rawField, issue) => {
      const fieldName = rawField || issue?.path || issue?.param || issue?.field;
      const targetField = fieldMap[fieldName];
      const rawMessage = issue?.msg || issue?.message || issue;
      const message =
        targetField && typeof rawMessage === "string"
          ? extractFieldMessage(rawMessage, fieldName)
          : rawMessage;

      if (targetField && typeof message === "string" && message.trim()) {
        hasMappedErrors = true;
        setError(targetField, { type: "server", message });
      }
    };

    if (Array.isArray(backendErrors)) {
      backendErrors.forEach((issue) => registerMappedError(undefined, issue));
    } else if (backendErrors && typeof backendErrors === "object") {
      Object.entries(backendErrors).forEach(([field, issue]) => {
        if (Array.isArray(issue)) {
          issue.forEach((item) => registerMappedError(field, item));
          return;
        }

        registerMappedError(field, issue);
      });
    }

    if (Array.isArray(backendDetails)) {
      backendDetails.forEach((issue) => registerMappedError(issue?.field, issue));
    } else if (backendDetails && typeof backendDetails === "object") {
      Object.entries(backendDetails).forEach(([field, issue]) => {
        if (Array.isArray(issue)) {
          issue.forEach((item) => registerMappedError(field, item));
          return;
        }

        registerMappedError(field, issue);
      });
    }

    if (!hasMappedErrors && typeof res?.message === "string") {
      if (/ya existe una cancha con ese nombre/i.test(res.message)) {
        hasMappedErrors = true;
        setError("name", { type: "server", message: res.message.trim() });
      } else {
        ["name", "pricePerHour", "price", "image", "archivo"].forEach((field) => {
          const hasFieldPrefix = new RegExp(`\\b${escapeRegExp(field)}\\s*:`, "i").test(res.message);

          if (!hasMappedErrors && hasFieldPrefix) {
            const parsedMessage = extractFieldMessage(res.message, field);
            const targetField = fieldMap[field];

            if (targetField && parsedMessage) {
              hasMappedErrors = true;
              setError(targetField, { type: "server", message: parsedMessage });
            }
          }
        });
      }
    }

    if (!hasMappedErrors) {
      setFieldSubmitError(
        stripValidationPrefix(res?.message) || "No se pudo guardar la cancha."
      );
    }
  };

  const guardarCancha = async (values) => {
    clearErrors();
    setFieldSubmitError("");

    const data = new FormData();
    data.append("name", values.name.trim());
    data.append("pricePerHour", values.pricePerHour);
    data.append("active", values.active);

    if (values.imageFile) {
      data.append("archivo", values.imageFile);
    }

    try {
      const resData = await saveField(editandoId, data);

      if (resData.ok) {
        cerrarModal();
        reset({
          name: "",
          pricePerHour: "",
          active: true,
          imageFile: null,
        });
        obtenerCanchas();
      } else {
        mapBackendFieldErrors(resData);
      }
    } catch (error) {
      console.error("Error al guardar cancha:", error);
      setFieldSubmitError("Error de conexión con el servidor. Revisá la consola.");
    }
  };

  const borrarCancha = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que querés eliminar "${nombre}"?`)) return;

    try {
      const data = await deleteField(id);

      if (data.ok) {
        obtenerCanchas();
      } else {
        alert(data.message || "No se pudo eliminar la cancha.");
      }
    } catch (error) {
      console.error("Error al eliminar cancha:", error);
      alert("Error de conexión con el servidor. Revisá la consola.");
    }
  };

  return (
    <div className="position-relative">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <h2
            className="m-0"
            style={{ color: "var(--color-title)", fontWeight: "var(--font-weight-title)" }}
          >
            Gestión de canchas
          </h2>
          <p className="mb-0 text-muted">Administra espacios, precios y fotos de tu complejo.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="btn text-white shadow-sm d-flex align-items-center gap-2"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <i className="bi bi-plus-lg"></i> Nueva cancha
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
        </div>
      ) : (
        <div className="row g-4">
          {canchas.map((cancha) => (
            <div className="col-12 col-md-6 col-lg-4" key={cancha._id}>
              <div className={`card h-100 shadow-sm border-0 ${!cancha.active ? "opacity-75" : ""}`}>
                <div style={{ height: "180px", overflow: "hidden" }} className="bg-light position-relative">
                  {cancha.image ? (
                    <img
                      src={cancha.image}
                      alt={cancha.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center">
                      <i className="bi bi-image fs-1 opacity-25"></i>
                    </div>
                  )}

                  {!cancha.active && (
                    <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                      Inactiva
                    </span>
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{cancha.name}</h5>
                  <p className="fs-5 mb-4" style={{ color: "var(--color-primary)", fontWeight: "600" }}>
                    ${cancha.pricePerHour} <span className="fs-6 text-muted fw-normal">/ hora</span>
                  </p>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      onClick={() => abrirModalEditar(cancha)}
                      className="btn btn-outline-secondary flex-grow-1 d-flex justify-content-center align-items-center gap-2"
                    >
                      <i className="bi bi-pencil-square"></i> Editar
                    </button>

                    <button
                      onClick={() => borrarCancha(cancha._id, cancha.name)}
                      className="btn btn-outline-danger flex-grow-1 d-flex justify-content-center align-items-center gap-2"
                    >
                      <i className="bi bi-trash3"></i> Borrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow-lg w-100"
            style={{ maxWidth: "500px", maxHeight: "95vh", overflowY: "auto" }}
          >
            <h5 className="fw-bold mb-4">
              {editandoId ? "Actualizar cancha" : "Crear nueva cancha"}
            </h5>

            <form onSubmit={handleSubmit(guardarCancha)} className="row g-3" noValidate>
              <div className="col-12 text-center mb-2">
                <div
                  className="border rounded p-2 bg-light mx-auto"
                  style={{ width: "100%", height: "180px" }}
                >
                  <img
                    src={preview || IMAGE_DEFAULT}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    alt="Vista previa de la cancha"
                  />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-muted">Imagen de la cancha</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.imageFile && (
                  <small className="text-danger d-block mt-1">{errors.imageFile.message}</small>
                )}
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-muted">Nombre</label>
                <input
                  type="text"
                  className={`form-control text-uppercase fw-bold ${errors.name ? "is-invalid" : ""}`}
                  maxLength={FIELD_NAME_MAX}
                  {...register("name", {
                    required: "El nombre es obligatorio.",
                    validate: {
                      notBlank: (value) =>
                        value.trim().length > 0 || "El nombre es obligatorio.",
                      minLength: (value) =>
                        value.trim().length >= FIELD_NAME_MIN ||
                        `El nombre debe tener al menos ${FIELD_NAME_MIN} caracteres.`,
                      maxLength: (value) =>
                        value.trim().length <= FIELD_NAME_MAX ||
                        `El nombre no puede superar ${FIELD_NAME_MAX} caracteres.`,
                    },
                  })}
                />
                {errors.name && <small className="text-danger d-block mt-1">{errors.name.message}</small>}
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-muted">Precio por hora ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-control fw-bold ${errors.pricePerHour ? "is-invalid" : ""}`}
                  {...register("pricePerHour", {
                    required: "El precio es obligatorio.",
                    valueAsNumber: true,
                    validate: (value) =>
                      Number.isFinite(value) || "Ingresá un precio válido.",
                    min: {
                      value: 0,
                      message: "El precio no puede ser menor a 0.",
                    },
                  })}
                />
                {errors.pricePerHour && (
                  <small className="text-danger d-block mt-1">{errors.pricePerHour.message}</small>
                )}
              </div>

              {editandoId && (
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="field-active-switch"
                      {...register("active")}
                    />
                    <label className="form-check-label" htmlFor="field-active-switch">
                      Cancha activa
                    </label>
                  </div>
                </div>
              )}

              {fieldSubmitError && (
                <div className="col-12">
                  <div className="alert alert-danger mb-0 py-2" role="alert">
                    {fieldSubmitError}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light px-4" onClick={cerrarModal}>
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn text-white px-4 fw-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
