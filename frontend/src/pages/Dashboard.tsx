import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Gaurav P',
    email: 'gaurav.p@talentBase.com',
    role: 'Backend Developer',
    phone: '9876543210',
    department: 'IT',
    joiningDate: '2022-01-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sanket P',
    email: 'sanket.p@talentBase.com',
    role: 'Lead',
    phone: '9123456780',
    department: 'IT',
    joiningDate: '2021-08-10',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Biswajit P',
    email: 'bissu.p@talentBase.com',
    role: 'Designer',
    phone: '9988776655',
    department: 'Design',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Nikhil C',
    email: 'nikhi;.c@talentBase.com',
    role: 'Senior Tester',
    phone: '9988776655',
    department: 'Design',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Rahul G',
    email: 'rahul.g@talentBase.com',
    role: 'Manager',
    phone: '9988776655',
    department: 'Marketing',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Rahul A',
    email: 'rahul.a@talentBase.com',
    role: 'Assi. Manager',
    phone: '9988776655',
    department: 'Marketing',
    joiningDate: '2023-03-20',
    status: 'Inactive',
  },
  {
    id: 7,
    name: 'Rahul A',
    email: 'rahul.a@talentBase.com',
    role: 'Assi. Manager',
    phone: '9988776655',
    department: 'Marketing',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Rahul A',
    email: 'rahul.a@talentBase.com',
    role: 'Assi. Manager',
    phone: '9988776655',
    department: 'Marketing',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    id: 9,
    name: 'Rahul A',
    email: 'rahul.a@talentBase.com',
    role: 'Assi. Manager',
    phone: '9988776655',
    department: 'Marketing',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Rahul A',
    email: 'rahul.a@talentBase.com',
    role: 'Assi. Manager',
    phone: '9988776655',
    department: 'Marketing',
    joiningDate: '2023-03-20',
    status: 'Active',
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

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-red-100 text-red-800',
};

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Modal fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [error, setError] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Handle add/edit
  const handleSaveEmployee = () => {
    if (!name || !email || !role || !phone || !department || !joiningDate) {
      setError('Please fill all fields');
      return;
    }

    if (editId !== null) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editId
            ? {
                ...emp,
                name,
                email,
                role,
                phone,
                department,
                joiningDate,
                status,
              }
            : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: employees.length + 1,
        name,
        email,
        role,
        phone,
        department,
        joiningDate,
        status,
      };
      setEmployees([...employees, newEmployee]);
    }

    setName('');
    setEmail('');
    setRole('');
    setPhone('');
    setDepartment('');
    setJoiningDate('');
    setStatus('Active');
    setError('');
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (emp: Employee) => {
    setEditId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setRole(emp.role);
    setPhone(emp.phone);
    setDepartment(emp.department);
    setJoiningDate(emp.joiningDate);
    setStatus(emp.status);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  // Filtered & paginated
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(
        (emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase()) ||
          emp.phone.includes(search)
      )
      .filter((emp) => (filterRole ? emp.role === filterRole : true))
      .filter((emp) => (filterStatus ? emp.status === filterStatus : true));
  }, [employees, search, filterRole, filterStatus]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Metrics
  const metrics = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'Active').length,
    inactive: employees.filter((e) => e.status === 'Inactive').length,
    perDept: employees.reduce<Record<string, number>>((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {}),
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // clear any user data
    window.location.replace('/'); // redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Employee Dashboard
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Add Employee
          </button>
          <CSVLink
            data={employees}
            filename={'employees.csv'}
            className="flex items-center bg-green-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Export CSV
          </CSVLink>
          {/* New Ticket List Button */}
          <Link
            to="/AdminTicketPage"
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            📝 Ticket List
          </Link>
          <Link
            to="/summary"
            className="flex items-center bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Attendance Summary
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-gray-600 dark:text-gray-300">Total Employees</h3>
          <p className="text-2xl font-bold text-white">{metrics.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-gray-600 dark:text-gray-300">Active Employees</h3>
          <p className="text-2xl font-bold text-white">{metrics.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-gray-600 dark:text-gray-300">
            Inactive Employees
          </h3>
          <p className="text-2xl font-bold text-red-500">{metrics.inactive}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-gray-600 dark:text-gray-300">Departments</h3>
          <ul className="text-white">
            {Object.entries(metrics.perDept).map(([dept, count]) => (
              <li key={dept}>
                {dept}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-3 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/3"
        />
        <div className="flex space-x-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Roles</option>
            {Array.from(new Set(employees.map((e) => e.role))).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              {[
                'Name',
                'Email',
                'Role',
                'Phone',
                'Department',
                'Joining Date',
                'Status',
                'Actions',
              ].map((head) => (
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
            {paginatedEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4 flex items-center space-x-3">
                  <UserCircleIcon className="h-6 w-6 text-indigo-500" />
                  <Link
                    to={`/employee/${emp.id}`}
                    className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline"
                  >
                    {emp.name}
                  </Link>
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
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {emp.phone}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {emp.department}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {emp.joiningDate}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      statusColors[emp.status]
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-3 mt-2">
                  <button
                    className="text-indigo-500 hover:text-indigo-700"
                    onClick={() => handleEdit(emp)}
                  >
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

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
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
              {editId !== null ? 'Edit Employee' : 'Add Employee'}
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
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'Active' | 'Inactive')
              }
              className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              onClick={handleSaveEmployee}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl mt-3"
            >
              {editId !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
