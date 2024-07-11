import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";
import background from './assets/Foodie.jpg';

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
      setErrorMessage('');
    } catch (error) {
      console.error('Error logging in or registering:', error);
      setErrorMessage('Invalid username or password. Please try again.');
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <h1 className="text-5xl font-bold text-center mb-6">EasyCook</h1>
        {errorMessage && (
          <div className="text-red-500 text-center mb-2">
            {errorMessage}
          </div>
        )}
        <input
          value={username}
          onChange={ev => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={ev => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === 'register' && (
            <div>
              Already a member?
              <button
                type="button"
                className="ml-1 text-blue-500 underline"
                onClick={() => {
                  setIsLoginOrRegister('login');
                  setErrorMessage('');
                }}
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
              Don't have an account?
              <button
                type="button"
                className="ml-1 text-blue-500 underline"
                onClick={() => {
                  setIsLoginOrRegister('register');
                  setErrorMessage('');
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
