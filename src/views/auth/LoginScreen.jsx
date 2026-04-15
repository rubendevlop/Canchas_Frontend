import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import "../../css/login.css";
import imagenlogin from "../../assets/imagen1.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logIn } from "../../helpers/auth";
import { SUSPENDED_ACCOUNT_MESSAGE } from "../../helpers/handleApiError";
import AlertApp from "../../components/AlertApp";
import visible from "../../assets/visible.png";
import invisible from "../../assets/invisible.png";
import regresar from "../../assets/regresar.png";
import ModalRegistro from "../../components/ModalRegistro";

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [response, setResponse] = useState();
  const { loadUserData } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const redirectTarget = location.state?.from
    ? `${location.state.from.pathname || ""}${location.state.from.search || ""}${location.state.from.hash || ""}`
    : "/";

  const onSubmit = async (data) => {
    const loginResponse = await logIn(data.email, data.password);

    setResponse(loginResponse);

    if (loginResponse.ok) {
      const profile = await loadUserData();

      if (profile?.active === false) {
        setResponse({
          ok: false,
          message: SUSPENDED_ACCOUNT_MESSAGE,
        });
        return;
      }

      navigate(redirectTarget || "/", { replace: true });
    }
  };

  return (
    <>
      <div className="container-fluid login-wrapper">
        <div className="row min-vh-100">
          <div className="col-12 col-lg-7 d-flex justify-content-center align-items-center abajo">
            <div className="login-card">
              <Link to="/" className="back-button">
                <img src={regresar} alt="Regresar al inicio" />
              </Link>

              <div className="circulo"></div>

              <h2 className="title">Hola de nuevo!</h2>
              <p className="subtitle">Ingresa para gestionar tus reservas</p>

              <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <label>Correo electronico</label>
                <input
                  type="email"
                  placeholder="juan.perez@ejemplo.com"
                  {...register("email", { required: "El email es obligatorio" })}
                />
                {errors.email && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.email.message}
                  </span>
                )}

                <label>Contrasena</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    {...register("password", {
                      required: "La contrasena es obligatoria",
                    })}
                  />
                  <img
                    src={showPassword ? visible : invisible}
                    alt="Mostrar contrasena"
                    className="eye"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.password && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.password.message}
                  </span>
                )}

                <button type="submit" className="login-button">
                  {isSubmitting ? "Ingresando..." : "Iniciar sesion"}
                </button>
              </form>

              {!response?.ok && response && (
                <AlertApp message={response?.message} />
              )}

              <div className="register-link">
                No tenes cuenta?{" "}
                <Link
                  to="/login"
                  className="link-register"
                  onClick={() => setMostrarModal(true)}
                >
                  <span>Registrate aca</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5 p-0">
            <img
              src={imagenlogin}
              alt="Complejo deportivo"
              className="login-image"
            />
          </div>
        </div>
      </div>
      <ModalRegistro
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />
    </>
  );
};

export default LoginScreen;
