import React from 'react'
import { useForm } from "react-hook-form"
import "../css/formRegister.css"

export default function FormRegister() {

const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  
const onSubmit = async (data) => {
    
 const res =   await fetch('http://localhost:2500/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

  console.log(res)  
};

  return (
    <div className='back'>
        
        <div>
          <form className='contentForm' onSubmit={handleSubmit(onSubmit)}>
            <div>
            <label htmlFor="userName">Usuario</label>
            <input type="text" id="userName" {...register("username")} />
            </div>
            <div>
            <label htmlFor="userEmail">Correo Electronico</label>
            <input type="email"  id="user-email"{...register("email")} />
            </div>
            <div>
            <label htmlFor="userPhone">Telefono</label>
            <input type="text"  id="user-phone"{...register("phoneNumber")} />
            </div>
            <div>
            <label htmlFor="userPassword">Contraseña</label>
            <input type="password"  id="user-password"{...register("password")} />
            </div>
            <div>
            <label htmlFor="repeatUserPassword">Repetir Contraseña</label>
            <input type="password" id="repeat-user-password" />
            </div>
            <div className='contentButtons'>
               <button type="submit">Enviar</button><button type="reset">Cancelar</button>
            </div>
          </form>
        </div>

    </div>
  )
}
