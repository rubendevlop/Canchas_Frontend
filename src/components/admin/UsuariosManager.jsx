import { useState, useEffect } from 'react';

export const UsuariosManager = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= 1. OBTENER USUARIOS (GET) =================
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/users');
      const data = await response.json();
      
      if (data.ok) {
        setUsuarios(data.users);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // ================= 2. SUSPENDER / ACTIVAR (PATCH) =================
  const cambiarEstado = async (id, isActive, username) => {
    const accion = isActive ? 'suspender' : 'activar';
    const confirmar = window.confirm(`¿Estás seguro que deseas ${accion} al usuario ${username}?`);
    
    if (!confirmar) return;

    // Ajustado a la estructura de tu backend: /api/users/:id/suspend o /api/users/:id/activate
    const endpoint = isActive ? 'suspend' : 'activate';
    const url = `http://localhost:3002/api/users/${id}/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH', // Ajustado: Tu backend usa router.patch
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.ok) {
        obtenerUsuarios(); // Recargamos la tabla
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(`Error al ${accion}:`, error);
    }
  };

  return (
    <div>
      {/* HEADER DE LA SECCIÓN */}
      <div className="mb-4">
        <h2 style={{ color: 'var(--color-title)', fontWeight: 'var(--font-weight-title)' }}>
          Gestión de Usuarios
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Administra los clientes registrados en la plataforma, sus estados y accesos.
        </p>
      </div>
      
      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded shadow-sm border-0" style={{ border: '1px solid var(--color-border)' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-3 text-muted">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people fs-1 text-muted"></i>
            <p className="mt-3 text-muted">No hay usuarios registrados todavía.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4" style={{ color: 'var(--color-title)' }}>Usuario</th>
                  <th className="py-3 px-4" style={{ color: 'var(--color-title)' }}>Rol</th>
                  <th className="py-3 px-4" style={{ color: 'var(--color-title)' }}>Estado</th>
                  <th className="py-3 px-4 text-end" style={{ color: 'var(--color-title)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    
                    {/* Columna: Nombre de Usuario y Avatar */}
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" 
                          style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary)', fontWeight: 'bold' }}
                        >
                          {/* Muestra la primera letra del username */}
                          {usuario.username ? usuario.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="fw-medium" style={{ color: 'var(--color-title)' }}>
                          {usuario.username || 'Sin nombre'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Columna: Rol (En lugar de Email) */}
                    <td className="py-3 px-4">
                      {usuario.role === 'admin' || usuario.role === 'superadmin' ? (
                        <span className="badge bg-dark rounded-pill px-3 py-2">
                          <i className="bi bi-shield-lock me-1"></i> {usuario.role.toUpperCase()}
                        </span>
                      ) : (
                        <span className="badge bg-secondary rounded-pill px-3 py-2">
                          Usuario
                        </span>
                      )}
                    </td>
                    
                    {/* Columna: Estado (Badge) */}
                    <td className="py-3 px-4">
                      {usuario.active !== false ? (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                          Activo
                        </span>
                      ) : (
                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">
                          Suspendido
                        </span>
                      )}
                    </td>
                    
                    {/* Columna: Acciones */}
                    <td className="py-3 px-4 text-end">
                      {usuario.active !== false ? (
                        <button 
                          onClick={() => cambiarEstado(usuario._id, true, usuario.username)}
                          className="btn btn-sm btn-outline-danger fw-medium px-3"
                          title="Suspender usuario"
                        >
                          <i className="bi bi-person-x me-1"></i> Suspender
                        </button>
                      ) : (
                        <button 
                          onClick={() => cambiarEstado(usuario._id, false, usuario.username)}
                          className="btn btn-sm btn-outline-success fw-medium px-3"
                          title="Activar usuario"
                        >
                          <i className="bi bi-person-check me-1"></i> Activar
                        </button>
                      )}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};