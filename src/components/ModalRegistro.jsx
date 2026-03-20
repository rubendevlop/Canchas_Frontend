import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { registerUser } from "../helpers/auth";

const ModalRegistro = ({ isOpen, onClose }) => {
  const [verPassword, setVerPassword] = useState(false);
  const [verRepetirPassword, setVerRepetirPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    try {
      const { repeatpassword, terminos, ...submitData } = data;
      const response = await registerUser(submitData);

      response.ok
        ? alert("Usuario creado con exito")
        : alert(response.message || "Error al crear el usuario");

      if (response.ok) {
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  const togglePasswordVisibilidad = (tipo) => {
    if (tipo === "password") {
      setVerPassword((prev) => !prev);
      return;
    }

    setVerRepetirPassword((prev) => !prev);
  };

  const fieldHintClass = "form-text text-start ps-3 mt-1 mb-2 small text-muted";
  const fieldErrorClass = "text-danger text-start ps-3 mt-1 mb-2 small fw-semibold";

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg p-3" style={{ borderRadius: "20px" }}>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body text-center pt-0">
            <div
              className="mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: "#1ea53a",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="bi bi-person-plus-fill text-white fs-2"></i>
            </div>

            <h2 className="fw-bold h4">Crea tu cuenta</h2>
            <p className="text-muted small mb-4">Completa tus datos y reserva</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group mb-1">
                <input
                  type="text"
                  className="form-control rounded-start-pill bg-light border-0 py-2 ps-3"
                  placeholder="Usuario"
                  aria-label="Usuario"
                  {...register("username", {
                    required: "El usuario es requerido",
                    minLength: {
                      value: 3,
                      message: "Debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "No puede superar los 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+$/,
                      message: "Usa solo letras, numeros, puntos, guiones o guion bajo",
                    },
                  })}
                />
                <span className="input-group-text rounded-end-pill bg-light border-0 text-muted pe-3">
                  <i className="bi bi-person"></i>
                </span>
              </div>
              <div className={errors.username ? fieldErrorClass : fieldHintClass}>
                {errors.username?.message || "Entre 3 y 20 caracteres. Ej: juan_10"}
              </div>

              <div className="input-group mb-1">
                <input
                  type="email"
                  className="form-control rounded-start-pill bg-light border-0 py-2 ps-3"
                  placeholder="Correo electronico"
                  aria-label="Correo electronico"
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo valido. Ej: nombre@mail.com",
                    },
                  })}
                />
                <span className="input-group-text rounded-end-pill bg-light border-0 text-muted pe-3">
                  <i className="bi bi-envelope"></i>
                </span>
              </div>
              <div className={errors.email ? fieldErrorClass : fieldHintClass}>
                {errors.email?.message || "Usa un correo valido para recibir novedades y acceso."}
              </div>

              <div className="input-group mb-1">
                <input
                  type="tel"
                  className="form-control rounded-start-pill bg-light border-0 py-2 ps-3"
                  placeholder="Numero de telefono"
                  aria-label="Numero de telefono"
                  {...register("phoneNumber", {
                    required: "El numero de telefono es requerido",
                    pattern: {
                      value: /^[0-9+\s()-]{8,20}$/,
                      message: "Ingresa un telefono valido. Ej: 3815551234",
                    },
                  })}
                />
                <span className="input-group-text rounded-end-pill bg-light border-0 text-muted pe-3">
                  <i className="bi bi-telephone"></i>
                </span>
              </div>
              <div className={errors.phoneNumber ? fieldErrorClass : fieldHintClass}>
                {errors.phoneNumber?.message || "Entre 8 y 20 caracteres. Se permiten numeros y + () -"}
              </div>

              <div className="input-group mb-1">
                <input
                  type={verPassword ? "text" : "password"}
                  className="form-control rounded-start-pill bg-light border-0 py-2 ps-3"
                  placeholder="Contrasena"
                  aria-label="Contrasena"
                  {...register("password", {
                    required: "La contrasena es requerida",
                    minLength: {
                      value: 8,
                      message: "Debe tener al menos 8 caracteres",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                      message: "Debe incluir al menos una letra y un numero",
                    },
                  })}
                />
                <button
                  className="btn btn-light rounded-end-pill border-0 text-muted pe-3 shadow-none"
                  type="button"
                  onClick={() => togglePasswordVisibilidad("password")}
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <i className={`bi ${verPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </button>
              </div>
              <div className={errors.password ? fieldErrorClass : fieldHintClass}>
                {errors.password?.message || "Minimo 8 caracteres, con al menos una letra y un numero."}
              </div>

              <div className="input-group mb-1">
                <input
                  type={verRepetirPassword ? "text" : "password"}
                  className="form-control rounded-start-pill bg-light border-0 py-2 ps-3"
                  placeholder="Repetir contrasena"
                  aria-label="Repetir contrasena"
                  {...register("repeatpassword", {
                    required: "Repetir contrasena es requerido",
                    validate: (value) =>
                      value === passwordValue || "Las contrasenas no coinciden",
                  })}
                />
                <button
                  className="btn btn-light rounded-end-pill border-0 text-muted pe-3 shadow-none"
                  type="button"
                  onClick={() => togglePasswordVisibilidad("repetir")}
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <i className={`bi ${verRepetirPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </button>
              </div>
              <div className={errors.repeatpassword ? fieldErrorClass : fieldHintClass}>
                {errors.repeatpassword?.message || "Repite exactamente la misma contrasena."}
              </div>

              <div className="form-check text-start mb-4 small">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terminos"
                  {...register("terminos", {
                    required: "Por favor acepta terminos y condiciones",
                  })}
                />
                <label className="form-check-label text-muted" htmlFor="terminos">
                  Aceptar terminos y solicitudes
                </label>
                {errors.terminos && (
                  <div className="text-danger mt-2 small fw-semibold">{errors.terminos.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn w-100 rounded-pill py-2 fw-bold text-white shadow-sm"
                style={{ backgroundColor: "#1ea53a" }}
              >
                Crear cuenta
              </button>
            </form>

            <div className="mt-4 small">
              <span className="text-muted">Ya tienes cuenta? </span>
              <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#1ea53a" }}>
                Ingresa aqui
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistro;
