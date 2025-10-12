import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination state

  const navigate = useNavigate();

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

  // Helper to format date as dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Load entries for current logged-in user
  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedInUser');
    if (!loggedUser) {
      navigate('/login');
    } else {
      const user = JSON.parse(loggedUser);
      setEmployee(user);

      // ✅ Load entries for this user only
      const saved = localStorage.getItem(`timesheet_entries_${user.email}`);
      if (saved) setEntries(JSON.parse(saved));
    }
  }, [navigate]);

  // Add a new entry
  const handleAddEntry = () => {
    if (!date || !task || !hours) return alert('Please fill all fields!');
    if (!employee) return;

    const userKey = `timesheet_entries_${employee.email}`;
    const newEntry = { date, task, hours: Number(hours) };
    const updatedEntries = [...entries, newEntry];

    setEntries(updatedEntries);

    // ✅ Store entries for this specific user
    localStorage.setItem(userKey, JSON.stringify(updatedEntries));

    setDate('');
    setTask('');
    setHours('');
  };

  // Sort logic (by date)
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Pagination logic (3 per page)
  const entriesPerPage = 3;
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = sortedEntries.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Group by month for CSV download
  const getEntriesByMonth = () => {
    const groups: Record<string, TimesheetEntry[]> = {};
    entries.forEach((entry) => {
      const month = new Date(entry.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!groups[month]) groups[month] = [];
      groups[month].push({
        ...entry,
        date: formatDate(entry.date), // ✅ formatted in CSV
      });
    });
    return groups;
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.replace('/');
  };

  const monthlyEntries = getEntriesByMonth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {employee && (
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            👋 Hello, {employee.name}
          </h2>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tickets')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            🎫 Ticket
          </button>
          <button
            onClick={() => navigate('/leaves')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            🌿 Leave
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        🕒 Timesheet Entry
      </h1>

      {/* Entry Form Card */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Date */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Task */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />
              Task Description
            </label>
            <input
              type="text"
              placeholder="Enter your task details..."
              value={task}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTask(e.target.value)
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Hours */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-indigo-500" />
              Time Spent (hrs)
            </label>
            <input
              type="number"
              placeholder="e.g., 4"
              value={hours}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHours(Number(e.target.value))
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAddEntry}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform duration-200"
          >
            ➕ Add Entry
          </button>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            📋 Your Timesheet
          </h2>
          <button
            onClick={toggleSortOrder}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            Sort: {sortOrder === 'asc' ? '⬆️ Asc' : '⬇️ Desc'}
          </button>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
          <table className="min-w-full text-left text-gray-700 dark:text-gray-200">
            <thead className="bg-indigo-100 dark:bg-gray-700 text-indigo-900 dark:text-indigo-300">
              <tr>
                {['Date', 'Task', 'Hours'].map((head) => (
                  <th key={head} className="px-6 py-3 font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <td className="px-6 py-3">{formatDate(entry.date)}</td>
                  <td className="px-6 py-3">{entry.task}</td>
                  <td className="px-6 py-3">{entry.hours}</td>
                </tr>
              ))}
              {currentEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-gray-500 py-4 dark:text-gray-400"
                  >
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Controls */}
        {sortedEntries.length > 0 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white ${
                currentPage === 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              ⬅️ Prev
            </button>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white ${
                currentPage === totalPages
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              Next ➡️
            </button>
          </div>
        )}

        {/* Monthly CSV Download Section */}
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(monthlyEntries).map(([month, data]) => (
            <CSVLink
              key={month}
              data={data}
              filename={`Timesheet_${month}.csv`}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              📅 Download {month} CSV
            </CSVLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimesheetFill;
