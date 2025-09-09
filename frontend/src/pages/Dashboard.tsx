import React, { useState } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Gaurav P',
    email: 'gaurav.p@talentBase.com',
    role: 'Backend Developer',
  },
  { id: 2, name: 'Sanket P', email: 'sanket.p@talentBase.com', role: 'Lead' },
  {
    id: 3,
    name: 'Biswajit P',
    email: 'bissu.p@talentBase.com',
    role: 'Designer',
  },
  {
    id: 4,
    name: 'Nikhil C',
    email: 'nikhil.c@talentBase.com',
    role: 'Senior Tester',
  },
  {
    id: 5,
    name: 'Rajesh K',
    email: 'rajesh.k@talentBase.com',
    role: 'Jr. Tester',
  },
  {
    id: 6,
    name: 'Maruti B',
    email: 'maruti.b@talentBase.com',
    role: 'Trainee',
  },
  { id: 7, name: 'Vijay C', email: 'vijay.c@talentBase.com', role: 'Manager' },
  {
    id: 8,
    name: 'Manoj S',
    email: 'manoj.s@talentBase.com',
    role: 'Assi. Manager',
  },
  {
    id: 9,
    name: 'Gaurav M',
    email: 'gaurav.m@talentBase.com',
    role: 'Scrum Master',
  },
];

const roleColors: Record<string, string> = {
  'Backend Developer': 'bg-blue-100 text-blue-800',
  Lead: 'bg-green-100 text-green-800',
  Designer: 'bg-pink-100 text-pink-800',
  'Senior Tester': 'bg-yellow-100 text-yellow-800',
  'Jr. Tester': 'bg-yellow-50 text-yellow-700',
  Trainee: 'bg-gray-100 text-gray-800',
  Manager: 'bg-purple-100 text-purple-800',
  'Assi. Manager': 'bg-purple-50 text-purple-700',
  'Scrum Master': 'bg-indigo-100 text-indigo-800',
};

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleAddEmployee = () => {
    if (!name || !email || !role) {
      setError('Please fill all fields');
      return;
    }

    const newEmployee: Employee = {
      id: employees.length + 1,
      name,
      email,
      role,
    };

    setEmployees([...employees, newEmployee]);
    setName('');
    setEmail('');
    setRole('');
    setError('');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Employee Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Employee
        </button>
      </div>

      {/* Table view */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              {['Name', 'Email', 'Role', 'Actions'].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-gray-600 dark:text-gray-300 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4 flex items-center space-x-3">
                  <UserCircleIcon className="h-6 w-6 text-indigo-500" />
                  <span className="text-gray-800 dark:text-white">
                    {emp.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {emp.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      roleColors[emp.role]
                    }`}
                  >
                    {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-3 mt-2">
                  <button className="text-indigo-500 hover:text-indigo-700">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex flex-col space-y-2 hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-8 w-8 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {emp.name}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{emp.email}</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                roleColors[emp.role]
              }`}
            >
              {emp.role}
            </span>
            <div className="flex justify-center space-x-3 mt-2">
              <button className="text-indigo-500 hover:text-indigo-700">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(emp.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Add Employee
            </h2>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleAddEmployee}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl mt-3"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
