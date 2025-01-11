import React, { useRef,useContext } from 'react';
import axiosInstance from '../config/axiosInstance';
import { Link ,useNavigate} from 'react-router-dom';
import { UserContext } from '../context/User.context.jsx';


function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate=useNavigate();
  const  {user,setUser}=useContext(UserContext)
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/login', {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log(response.data.user.email)
      setUser(response.data.user);
      navigate('/');
 
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              className="w-full mt-1 p-2 border border-gray-700 rounded-md bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              className="w-full mt-1 p-2 border border-gray-700 rounded-md bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Submit
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          New here?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
