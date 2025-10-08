import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimesheetEntry {
  date: string;
  task: string;
  hours: number;
}

const TimesheetFill: React.FC = () => {
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [task, setTask] = useState('');
  const [hours, setHours] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  // Load logged-in employee
  const [employee, setEmployee] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedInUser');
    if (!loggedUser) {
      navigate('/login');
    } else {
      setEmployee(JSON.parse(loggedUser));
    }
  }, [navigate]);

  const handleAddEntry = () => {
    if (!date || !task || !hours) return alert('Fill all fields');
    setEntries([...entries, { date, task, hours: Number(hours) }]);
    setDate('');
    setTask('');
    setHours('');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Timesheet Fill
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
      {employee && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Logged in as: <span className="font-semibold">{employee.name}</span> (
          {employee.email})
        </p>
      )}

      <div className="mb-6 space-y-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Task description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <input
          type="number"
          placeholder="Hours spent"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="p-2 border rounded w-full md:w-1/6"
        />
        <button
          onClick={handleAddEntry}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Add Entry
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
        Your Timesheet
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead>
          <tr>
            {['Date', 'Task', 'Hours'].map((head) => (
              <th
                key={head}
                className="px-4 py-2 text-left text-gray-600 dark:text-gray-300"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {entry.date}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {entry.task}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {entry.hours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetFill;
