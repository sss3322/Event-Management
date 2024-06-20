import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function loginAdmin(ev) {
    ev.preventDefault();

    try {
      const response = await axios.post('/adminlogin', {
        email,
        password
      });
      
      if (response.status === 200) {
        alert('Login Successful');
        setRedirect(true);
      } else {
        alert('Login Failed');
      }
    } catch (error) {
      alert('Login Failed');
      console.error('Error logging in admin:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/dashboard'} />;
  }

  return (
    <div className="flex w-full h-full lg:-ml-24 px-10 py-10 justify-between place-items-center mt-12">
      <div className="hidden lg:flex flex-col right-box ">
        <div className="flex flex-col gap-3">
         
          
        </div>
        
      </div>
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle ">
        <form className="flex flex-col w-auto items-center" onSubmit={loginAdmin}>
          <h1 className="px-3 font-extrabold mb-5 text-primarydark text-2xl">Admin Sign In</h1>

          <div className="input">
            
            <input type="email" placeholder="Email" className="input-et" value={email} onChange={ev => setEmail(ev.target.value)}/>
          </div>

          <div className="input">
           
            <input type="password" placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)}/>
          </div>

          <div className="w-full py-4">
            <button type="submit" className="primary w-full"> Sign In </button>
          </div>

          <div className="container2">
            <div className="w-full h-full p-1">
              <Link to={'/adminregister'}>
                <button type="submit" className="text-black cursor-pointer rounded w-full h-full font-bold"> Sign Up </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
