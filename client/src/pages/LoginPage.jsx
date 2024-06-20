import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(UserContext);

  //! Fetch users from the server --------------------------------------------------------------
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass');
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass);
    }
  }, []);

  async function loginUser(ev) {
    ev.preventDefault();

    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      alert('Login success');

      if (rememberMe) {
        // If the user checked, store their email in localStorage.
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedpass', password);
      } else {
        // If the user didn't check, remove their email from localStorage.
        localStorage.removeItem('rememberedEmail');
      }

      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="flex w-full h-full lg:ml-24 px-10 py-10 justify-between place-items-center mt-20">
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle">
        <form className="flex flex-col w-auto items-center" onSubmit={loginUser}>
          <h1 className="px-3 font-extrabold mb-5 text-primarydark text-2xl">Sign In</h1>

          <div className="input">
            <input
              type="email"
              placeholder="Email"
              className="input-et"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          <div className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-et"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <div
              type="button"
              className=""
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </div>
          </div>

          <div className="flex w-full h-full mt-4 justify-between px-1">
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
              />
              Remember Me
            </div>
            <div>
              <Link to={'/forgotpassword'}>Forgot Password ?</Link>
            </div>
          </div>

          <div className="w-full py-4">
            <button type="submit" className="primary w-full">
              Sign in
            </button>
          </div>

          <div className="container2">
            <div className="w-full h-full p-1">
              <Link to={'/login'}>
                <button type="submit" className="text-white cursor-pointer rounded w-full h-full bg-primary font-bold">
                  Sign In
                </button>
              </Link>
            </div>
            <div className="w-full h-full p-1">
              <Link to={'/register'}>
                <button type="submit" className="text-black cursor-pointer rounded w-full h-full font-bold">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          <Link to={'/'} className="">
            <button className="secondary">Back</button>
          </Link>
        </form>
      </div>

      <div className="hidden lg:flex flex-col right-box">
        <div className="flex flex-col -ml-96 gap-3"></div>
      </div>
    </div>
  );
}
