import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  DocumentPlusIcon,
} from '@heroicons/react/24/outline';

interface Ticket {
  date: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string; // now fixed by admin
  department: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  expectedResolution: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

const TicketPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<
    'Low' | 'Medium' | 'High' | 'Critical'
  >('Low');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<
    'Low' | 'Medium' | 'High' | 'Critical'
  >('Low');
  const [expectedResolution, setExpectedResolution] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();
  const [employee, setEmployee] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3; // limit 3 tickets per page

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedInUser');
    if (!loggedUser) navigate('/login');
    else setEmployee(JSON.parse(loggedUser));
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('tickets');
    if (saved) setTickets(JSON.parse(saved));
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddTicket = () => {
    if (!title || !description || !department || !category || !date) {
      return alert('Please fill all mandatory fields!');
    }
    const newTicket: Ticket = {
      title,
      description,
      priority,
      department,
      category,
      severity,
      date,
      expectedResolution,
      assignedTo: 'Unassigned', // only admin can assign
      status: 'Open', // default status
    };
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    setTitle('');
    setDescription('');
    setPriority('Low');
    setDepartment('');
    setCategory('');
    setSeverity('Low');
    setExpectedResolution('');
    setDate('');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.replace('/');
  };

  const getTicketsByMonth = () => {
    const groups: Record<string, Ticket[]> = {};
    tickets.forEach((ticket) => {
      const month = new Date(ticket.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!groups[month]) groups[month] = [];
      groups[month].push(ticket);
    });
    return groups;
  };

  const monthlyTickets = getTicketsByMonth();

  // Pagination logic
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        {employee && (
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            👋 Hello, {employee.name}
          </h2>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          🚪 Logout
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        🎫 Generate Ticket
      </h1>

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" /> Date
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

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5 text-indigo-500" />{' '}
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as Ticket['priority'])
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            >
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />{' '}
              Title
            </label>
            <input
              type="text"
              placeholder="Ticket title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />{' '}
              Department
            </label>
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDepartment(e.target.value)
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <DocumentPlusIcon className="h-5 w-5 text-indigo-500" /> Category
            </label>
            <input
              type="text"
              placeholder="Bug / Feature / Request"
              value={category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCategory(e.target.value)
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5 text-indigo-500" />{' '}
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value as Ticket['severity'])
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white"
            >
              {['Low', 'Medium', 'High', 'Critical'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />{' '}
              Description
            </label>
            <textarea
              placeholder="Enter detailed description..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:text-white h-28 resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-2 font-medium flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" /> Expected
              Resolution
            </label>
            <input
              type="date"
              value={expectedResolution}
              disabled
              placeholder="Will be set by admin"
              className="p-3 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAddTicket}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform duration-200"
          >
            ➕ Add Ticket
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          📋 Tickets
        </h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
          <table className="min-w-full text-left text-gray-700 dark:text-gray-200">
            <thead className="bg-indigo-100 dark:bg-gray-700 text-indigo-900 dark:text-indigo-300">
              <tr>
                {[
                  'Date',
                  'Title',
                  'Description',
                  'Priority',
                  'Department',
                  'Category',
                  'Severity',
                  'Expected Resolution',
                  'Assigned To',
                  'Status',
                ].map((head) => (
                  <th key={head} className="px-6 py-3 font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <td className="px-6 py-3">{formatDate(ticket.date)}</td>
                  <td className="px-6 py-3">{ticket.title}</td>
                  <td className="px-6 py-3">{ticket.description}</td>
                  <td className="px-6 py-3">{ticket.priority}</td>
                  <td className="px-6 py-3">{ticket.department}</td>
                  <td className="px-6 py-3">{ticket.category}</td>
                  <td className="px-6 py-3">{ticket.severity}</td>
                  <td className="px-6 py-3">
                    {formatDate(ticket.expectedResolution)}
                  </td>
                  <td className="px-6 py-3">{ticket.assignedTo}</td>
                  <td className="px-6 py-3">{ticket.status}</td>
                </tr>
              ))}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center text-gray-500 py-4 dark:text-gray-400"
                  >
                    No tickets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Monthly CSV Download */}

        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(monthlyTickets).map(([month, data]) => (
            <CSVLink
              key={month}
              data={data.map((t) => ({
                ...t,
                date: formatDate(t.date),
                expectedResolution: formatDate(t.expectedResolution),
              }))}
              filename={`Tickets_${month}.csv`}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              📅 Download {month} CSV
            </CSVLink>
          ))}
        </div>

        {/* Pagination Controls */}
        {tickets.length > ticketsPerPage && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Go to Timesheet Link */}
        <div className="w-full max-w-5xl flex justify-start">
          <button
            onClick={() => navigate('/timesheet')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-lg transition-all ml-2"
          >
            ← Go to Timesheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
