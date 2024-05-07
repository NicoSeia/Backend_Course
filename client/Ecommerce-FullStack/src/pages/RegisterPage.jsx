import { useForm } from 'react-hook-form'
import { useUserContext } from '../context/UserContext'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'


const RegisterPage = () => {

    const { register, handleSubmit, formState: { errors }, } = useForm()
    const { setToken, setUser } = useUserContext()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            };
    
            const res = await fetch('http://localhost:4000/api/session/register', requestOptions);
            const resp = await res.json();
    
            console.log(resp);
    
            if (resp.status === 'success' && resp.payload && resp.payload.token) {
                setToken(`Bearer ${resp.payload.token}`);
                setUser(resp.payload)
                Swal.fire({ icon: "success", text: resp.message || "Register successful" })
                    .then(() => navigate("/login", { replace: true }));
            } else {
                const errorMessage = resp.message || "Acceso no autorizado";
                Swal.fire({ icon: "error", text: errorMessage });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", text: "Error en el sistema" });
        }
    }

  return (
    <div className='bg-zinc-800 max-w-md p-10 rounded-md mx-auto mt-auto'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("first_name", {required: true})} 
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        placeholder='First Name'/>
        {
            errors.first_name && (<p className='text-red-500'>First name is required</p>)
        }
        <input type="text" {...register("last_name", {required: true})} 
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        placeholder='Last Name'/>
        {
            errors.last_name && (<p className='text-red-500'>Last name is required</p>)
        }
        <input type="date" {...register("date", {required: true})} 
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my2'
        placeholder='Date Name'/>
        {
            errors.date && (<p className='text-red-500'>Date is required</p>)
        }
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
        <select {...register("role", { required: true })} defaultValue="" className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'>
          <option value="" disabled>Select one</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {
            errors.role && (<p className='text-red-500'>Role is required</p>)
        }
        <button type='submit' className='text-white bg-slate-400 py-2 px-4 rounded-md my-2 flex justify-center'>
            Register
        </button>

        <p className="flex gap-x-2 justify-between text-white">
            Already have an account? <Link to={"/login"} className="text-sky-500">Log in</Link>
        </p>
      </form>
    </div>

  )
}

export default RegisterPage