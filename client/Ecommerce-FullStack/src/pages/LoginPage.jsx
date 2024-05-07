import { useForm } from "react-hook-form"
import { useUserContext } from "../context/UserContext"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Swal from 'sweetalert2'


const LoginPage = () => {

    const { register, handleSubmit, formState: { errors }} = useForm()
    const { setUser, setToken } = useUserContext()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            };
    
            const res = await fetch('http://localhost:4000/api/session/login', requestOptions);
            const resp = await res.json();
    
            console.log(resp);
    
            if (resp.status === 'success' && resp.payload && resp.payload.token) {
                // Almacena el token usando el contexto o cualquier método que estés usando para manejar tokens
                setToken(`Bearer ${resp.payload.token}`);
                setUser(resp.payload)
                // Muestra una alerta de éxito y redirige a la página de productos
                Swal.fire({ icon: "success", text: resp.message || "Login successful" })
                    .then(() => navigate("/products", { replace: true }));
            } else {
                // Muestra un mensaje de error si el login falló
                const errorMessage = resp.message || "Acceso no autorizado";
                Swal.fire({ icon: "error", text: errorMessage });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", text: "Error en el sistema" });
        }
    }



  return (
    <div className='bg-zinc-800 max-w-md p-10 rounded-md mx-auto mt-40'>

        <h1 className="text-2xl font-bold text-white flex justify-center mb-2">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="email" {...register("email", {required: true})} 
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Email'/>
            {
                errors.email && (<p className='text-red-500'>Email is required</p>)
            }
            <input type="password" {...register("password", {required: true})} 
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Password'/>
            {
                errors.password && (<p className='text-red-500'>Password is required</p>)
            }
            <button type='submit' className='mx-auto text-white bg-slate-400 py-2 px-4 rounded-md my-2 flex justify-center'>
                Login
            </button>

            <p className="flex gap-x-2 justify-between text-white">
                Don't have an account? <Link to={"/register"} className="text-sky-500">Sing Up</Link>
            </p>
        </form>
    </div>
  )
}

export default LoginPage