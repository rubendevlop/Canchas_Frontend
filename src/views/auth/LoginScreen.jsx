import "../../css/login.css";
import imagenlogin from "../../assets/imagen1.webp";

const LoginScreen = () => {
  return (
   <div className="container-fluid login-wrapper">
      <div className="row min-vh-100">
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center abajo">
          <div className="login-card">

            <button className="back-button"></button>

            <div className="circulo"></div>

            <h2 className="title">¡Hola de nuevo!</h2>
            <p className="subtitle">
              Ingresá para gestionar tus reservas
            </p>

            <form className="login-form">
              <label>Correo electrónico</label>
              <input 
                type="email" 
                placeholder="juan.perez@ejemplo.com" 
              />

              <label>Contraseña</label>
              <div className="password-wrapper">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                />
                <span className="eye"></span>
              </div>

              <button type="submit" className="login-button">
                Iniciar sesión
              </button>
            </form>

            <div className="register-link">
              ¿No tienes cuenta? <span>Registrate acá</span>
            </div>

          </div>
        </div>
        <div className="col-12 col-lg-6 login-image-container">
          <img 
            src={imagenlogin}
            alt="Complejo deportivo"
            className="login-image"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;
