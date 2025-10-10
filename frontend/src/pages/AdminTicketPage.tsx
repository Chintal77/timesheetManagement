import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import {
  CalendarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface Ticket {
  date: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  department: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  expectedResolution: string;
  status: 'Open' | 'In Progress' | 'Closed';
  comments: string;
}

const employees = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams'];

const priorityColors: Record<string, string> = {
  Low: 'bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100',
  Medium:
    'bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100',
  High: 'bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-100',
  Critical: 'bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100',
};

const severityColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100',
  Medium:
    'bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100',
  High: 'bg-orange-100 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
  Critical: 'bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100',
};

const AdminTicketPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tickets');
    if (saved) setTickets(JSON.parse(saved));
  }, []);

  const saveTickets = (updated: Ticket[]) => {
    setTickets(updated);
    localStorage.setItem('tickets', JSON.stringify(updated));
  };

  const handleUpdateTicket = <K extends keyof Ticket>(
    idx: number,
    field: K,
    value: Ticket[K]
  ) => {
    const updatedTickets = [...tickets];
    updatedTickets[idx][field] = value;
    saveTickets(updatedTickets);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-wide">
          🛠️ Admin Ticket Panel
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold transition-all"
        >
          Logout
        </button>
      </div>

      {/* Ticket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.length === 0 && (
          <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8 text-lg font-medium">
            No tickets available.
          </div>
        )}

        {tickets.map((ticket, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300"
          >
            {/* Date + Priority */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 font-medium">
                <CalendarIcon className="w-4 h-4" /> {formatDate(ticket.date)}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                  priorityColors[ticket.priority]
                }`}
              >
                <ExclamationTriangleIcon className="w-3 h-3" />
                {ticket.priority}
              </div>
            </div>

            <h2 className="font-semibold text-xl text-gray-800 dark:text-white truncate">
              {ticket.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
              {ticket.description}
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Dept:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ticket.department}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Category:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ticket.category}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Severity:
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold ${
                  severityColors[ticket.severity]
                }`}
              >
                {ticket.severity}
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assigned To:
              </label>
              <select
                value={ticket.assignedTo}
                onChange={(e) =>
                  handleUpdateTicket(
                    idx,
                    'assignedTo',
                    e.target.value as Ticket['assignedTo']
                  )
                }
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="Unassigned">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>

              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expected Resolution:
              </label>
              <input
                type="date"
                value={ticket.expectedResolution}
                onChange={(e) =>
                  handleUpdateTicket(
                    idx,
                    'expectedResolution',
                    e.target.value as Ticket['expectedResolution']
                  )
                }
                disabled={ticket.assignedTo === 'Unassigned'}
                className={`p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
                  ticket.assignedTo === 'Unassigned'
                    ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed'
                    : ''
                } transition-all`}
              />

              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </label>
              <select
                value={ticket.status}
                onChange={(e) =>
                  handleUpdateTicket(
                    idx,
                    'status',
                    e.target.value as Ticket['status']
                  )
                }
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
              />

              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments:
              </label>
              <input
                type="text"
                value={ticket.comments || ''}
                onChange={(e) =>
                  handleUpdateTicket(
                    idx,
                    'comments',
                    e.target.value as Ticket['comments']
                  )
                }
                placeholder="Add comment..."
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly CSV Download */}

      {/* Monthly CSV Download + Back to Dashboard */}
      <div className="flex flex-wrap justify-between items-center mt-8">
        {/* Back to Dashboard on bottom-left */}
        <Link
          to="/dashboard"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold mb-2"
        >
          ← Back to Dashboard
        </Link>

        {/* CSV download buttons on bottom-right */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(monthlyTickets).map(([month, data]) => (
            <CSVLink
              key={month}
              data={data.map((t) => ({
                ...t,
                date: formatDate(t.date),
                expectedResolution: formatDate(t.expectedResolution),
              }))}
              filename={`Tickets_${month}.csv`}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all"
            >
              📅 Download {month} CSV
            </CSVLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTicketPage;
