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

interface Leave {
  fromDate: string;
  toDate: string;
  reportingManager: string;
  resumeDate: string;
  summary: string;
  emergencyNumber: string;
}

const TimesheetFill: React.FC = () => {
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [task, setTask] = useState('');
  const [hours, setHours] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [employee, setEmployee] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [leaveDates, setLeaveDates] = useState<string[]>([]); // ✅ store leave dates

  const navigate = useNavigate();

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Load timesheet entries + leave entries + store leave date list
  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedInUser');
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(loggedUser);
    setEmployee(user);

    const userKey = `timesheet_entries_${user.email}`;
    const savedEntries: TimesheetEntry[] = JSON.parse(
      localStorage.getItem(userKey) || '[]'
    );

    const savedLeaves: Leave[] = JSON.parse(
      localStorage.getItem(`leaves_${user.email}`) || '[]'
    );

    const leaveEntries: TimesheetEntry[] = [];
    const leaveDateList: string[] = [];

    // ✅ Add all leave days to entries + record leave dates for disabling
    savedLeaves.forEach((leave) => {
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      while (from <= to) {
        const formattedDate = from.toISOString().split('T')[0];
        leaveDateList.push(formattedDate);
        if (!savedEntries.some((e) => e.date === formattedDate)) {
          leaveEntries.push({
            date: formattedDate,
            task: `On Leave - ${leave.summary}`,
            hours: 0,
          });
        }
        from.setDate(from.getDate() + 1);
      }
    });

    setLeaveDates(leaveDateList);
    setEntries([...savedEntries, ...leaveEntries]);
  }, [navigate]);

  // ✅ Disable leave dates in date picker
  const isLeaveDate = (checkDate: string) => {
    return leaveDates.includes(checkDate);
  };

  // Add entry manually
  const handleAddEntry = () => {
    if (!date || !task || !hours) return alert('Please fill all fields!');
    if (!employee) return;

    if (isLeaveDate(date)) {
      alert('🚫 This date is marked as On Leave. Cannot add entry.');
      return;
    }

    const userKey = `timesheet_entries_${employee.email}`;
    const newEntry = { date, task, hours: Number(hours) };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem(userKey, JSON.stringify(updatedEntries));

    setDate('');
    setTask('');
    setHours('');
  };

  // Sorting and Pagination
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const entriesPerPage = 3;
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  const currentEntries = sortedEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Group by month for CSV
  const getEntriesByMonth = () => {
    const groups: Record<string, TimesheetEntry[]> = {};
    entries.forEach((entry) => {
      const month = new Date(entry.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!groups[month]) groups[month] = [];
      groups[month].push({ ...entry, date: formatDate(entry.date) });
    });
    return groups;
  };

  const monthlyEntries = getEntriesByMonth();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.replace('/');
  };

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

      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        🕒 Timesheet Entry
      </h1>

      {/* Entry Form */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Date */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLeaveDate(date)} // ✅ disable leave dates
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white ${
                isLeaveDate(date)
                  ? 'bg-red-100 dark:bg-red-800 cursor-not-allowed'
                  : ''
              }`}
            />
          </div>
          {/* Task */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />{' '}
              Task
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Task details..."
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/* Hours */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-indigo-500" /> Hours
            </label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              placeholder="e.g. 4"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

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
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Sort: {sortOrder === 'asc' ? '⬆️ Asc' : '⬇️ Desc'}
          </button>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
          <table className="min-w-full text-left text-gray-700 dark:text-gray-200">
            <thead className="bg-indigo-100 dark:bg-gray-700 text-indigo-900 dark:text-indigo-300">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Task</th>
                <th className="px-6 py-3 font-semibold">Hours</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    entry.task.includes('On Leave')
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : ''
                  }`}
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

        {/* Pagination */}
        {sortedEntries.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white ${
                currentPage === 1
                  ? 'bg-gray-400'
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
                  ? 'bg-gray-400'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              Next ➡️
            </button>
          </div>
        )}

        {/* CSV Downloads */}
        <div className="flex flex-wrap gap-3 justify-center">
          {employee &&
            Object.entries(monthlyEntries).map(([month, data]) => (
              <CSVLink
                key={month}
                data={data}
                filename={`Timesheet_${employee.name}_${month}.csv`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
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
