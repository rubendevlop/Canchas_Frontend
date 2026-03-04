import React from 'react'
import { useForm } from "react-hook-form"
import "../css/formRegister.css"


export default function FormRegister() {

const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm()

  
const onSubmit = async (data) => {

  try {

     const res =   await fetch('http://localhost:2500/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
     const  response = await res.json();

     response.ok?alert("Usuario creado con exito"):alert("Error al crear el usuario");
    
      reset();
  } catch (error) {
    console.log(error);
  } 

};

  return (
    <div className='back'>
        
        <div>
          <form className='contentForm' onSubmit={handleSubmit(onSubmit)}>
            <div>
            <label htmlFor="userName">Usuario</label>
            <input type="text" id="userName" {...register("username",{required:"El nombre es requerido"})} />
            {errors.username && <p className='error'>{errors.username.message}</p> }
            </div>
            <div>
            <label htmlFor="userEmail">Correo Electronico</label>
            <input type="email"  id="user-email"{...register("email",{required:"El email es requerido"})} />
            {errors.email && <p className='error'>{errors.email.message}</p> }
            </div>
            <div>
            <label htmlFor="userPhone">Telefono</label>
            <input type="text"  id="user-phone"{...register("phoneNumber",{required:"El numero de telefono es requerido"})} />
            {errors.phoneNumber && <p className='error'>{errors.phoneNumber.message}</p> }
            </div>
            <div>
            <label htmlFor="userPassword">Contraseña</label>
            <input type="password"  id="user-password"{...register("password",{required:"La contraseña es requerida"})} />
            {errors.password && <p className='error'>{errors.password.message}</p> }
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
