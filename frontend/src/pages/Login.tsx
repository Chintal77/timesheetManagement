import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Please fill all fields');

    // Admin login
    if (email === 'admin@gmail.com' && password === '123456') {
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ email, name: 'Admin' })
      );
      onLogin();
      navigate('/dashboard');
      return;
    }

    // Dummy employee login
    const employees = [
      {
        email: 'gaurav.p@talentBase.com',
        password: 'gaurav123',
        name: 'Gaurav P',
      },
      {
        email: 'sanket.p@talentBase.com',
        password: 'sanket123',
        name: 'Sanket P',
      },
      {
        email: 'biswajit.p@talentBase.com',
        password: 'biswajit123',
        name: 'Biswajit P',
      },
    ];

    const emp = employees.find(
      (e) => e.email === email && e.password === password
    );
    if (emp) {
      localStorage.setItem('loggedInUser', JSON.stringify(emp));
      onLogin();
      navigate('/timesheet');
    } else {
      setError('Invalid email or password ❌');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">
          TalentBase EMS
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
