import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ---- Constants ----
const MONTHLY_EARNED_LEAVES = 2;

// ---- Interfaces ----
interface Project {
  name: string;
  duration: string;
}

interface Leave {
  fromDate: string;
  toDate: string;
  summary?: string;
}

interface ComplaintAgainst {
  by: string;
  issue: string;
  date: string;
}

interface ComplaintBy {
  against: string;
  issue: string;
  date: string;
}

interface Complaints {
  raisedAgainst: ComplaintAgainst[];
  raisedBy: ComplaintBy[];
}

interface Salary {
  fixed: number;
  variable: number;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  joiningDate: string;
  status: string;
  projects: Project[];
  complaints: Complaints;
  salary: Salary;
  appraisalDueDate: string;
  rating: number;
}

// ---- Mock Data ----
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Gaurav P',
    email: 'gaurav.p@talentBase.com',
    role: 'Backend Developer',
    phone: '9876543210',
    department: 'IT',
    joiningDate: '2022-01-15',
    status: 'Active',
    projects: [
      { name: 'E-Commerce API', duration: 'Jan 2022 - Jun 2022' },
      { name: 'Payment Gateway', duration: 'Jul 2022 - Dec 2022' },
      { name: 'HR System', duration: 'Jan 2023 - Present' },
    ],
    complaints: {
      raisedAgainst: [
        { by: 'Manager', issue: 'Missed deadline', date: '2023-03-10' },
      ],
      raisedBy: [
        { against: 'Team Lead', issue: 'Unfair review', date: '2023-06-15' },
      ],
    },
    salary: { fixed: 600000, variable: 100000 },
    appraisalDueDate: '2024-12-01',
    rating: 4.5,
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
    projects: [{ name: 'Cloud Migration', duration: '2021 - Present' }],
    complaints: { raisedAgainst: [], raisedBy: [] },
    salary: { fixed: 800000, variable: 200000 },
    appraisalDueDate: '2024-09-15',
    rating: 4.8,
  },
  // Add more employees if needed
];

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaveSummary, setLeaveSummary] = useState({
    availableLeaves: 0,
    leavesTaken: 0,
    leavesRemaining: 0,
  });
  const [leaveHistory, setLeaveHistory] = useState<Leave[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const emp = mockEmployees.find((e) => e.id === Number(id));
    setEmployee(emp || null);

    if (emp) {
      const savedLeaves: Leave[] = JSON.parse(
        localStorage.getItem(`leaves_${emp.email}`) || '[]'
      );
      setLeaveHistory(savedLeaves);

      const joining = new Date(emp.joiningDate);
      const today = new Date();
      const monthsSinceJoining =
        (today.getFullYear() - joining.getFullYear()) * 12 +
        (today.getMonth() - joining.getMonth() - 1);

      const availableLeaves = monthsSinceJoining * MONTHLY_EARNED_LEAVES;

      // Count total leave days
      let leaveDays = 0;
      savedLeaves.forEach((leave) => {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);
        while (from <= to) {
          leaveDays++;
          from.setDate(from.getDate() + 1);
        }
      });

      setLeaveSummary({
        availableLeaves,
        leavesTaken: leaveDays,
        leavesRemaining: Math.max(0, availableLeaves - leaveDays),
      });
    }
  }, [id]);

  if (!employee) {
    return (
      <div className="p-6 text-center text-red-500">Employee not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      {/* Back Links */}
      <div className="flex justify-between mb-4">
        <Link to="/dashboard" className="text-blue-400 hover:underline">
          ← Back
        </Link>
        <Link
          to={`/attendance/${employee.id}`}
          className="text-blue-400 hover:underline"
        >
          Attendance →
        </Link>
      </div>

      <h1 className="text-3xl font-bold my-4">
        {employee.name} - {employee.role}
      </h1>

      {/* Personal Info */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Employee Information</h2>
        <p>
          <b>Email:</b> {employee.email}
        </p>
        <p>
          <b>Phone:</b> {employee.phone}
        </p>
        <p>
          <b>Department:</b> {employee.department}
        </p>
        <p>
          <b>Joining Date:</b> {employee.joiningDate}
        </p>
        <p>
          <b>Status:</b> {employee.status}
        </p>
        <p>
          <b>Fixed Salary:</b> ₹{employee.salary.fixed.toLocaleString()}
        </p>
        <p>
          <b>Variable Salary:</b> ₹{employee.salary.variable.toLocaleString()}
        </p>
        <p>
          <b>Appraisal Due Date:</b> {employee.appraisalDueDate}
        </p>
        <p>
          <b>Rating:</b> ⭐ {employee.rating}
        </p>
      </div>

      {/* Project History */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Project History</h2>
        <ul className="list-disc ml-6">
          {employee.projects.map((proj, idx) => (
            <li key={idx}>
              {proj.name} ({proj.duration})
            </li>
          ))}
        </ul>
      </div>

      {/* Leaves Summary */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Leaves Summary</h2>
        <p>
          <b>Available Leaves:</b> {leaveSummary.availableLeaves}
        </p>
        <p>
          <b>Leaves Taken:</b> {leaveSummary.leavesTaken}
        </p>
        <p>
          <b>Leaves Remaining:</b> {leaveSummary.leavesRemaining}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
        >
          📝 View Leave History
        </button>
      </div>

      {/* Leave History Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Leave History</h2>
            {leaveHistory.length === 0 ? (
              <p>No leaves applied yet.</p>
            ) : (
              <table className="min-w-full border border-gray-700 text-sm text-white">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-2 border">From</th>
                    <th className="p-2 border">To</th>
                    <th className="p-2 border">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((l, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
                    >
                      <td className="p-2 border text-center">{l.fromDate}</td>
                      <td className="p-2 border text-center">{l.toDate}</td>
                      <td className="p-2 border text-center">
                        {l.summary || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Complaints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">
            Complaints Raised Against
          </h2>
          {employee.complaints.raisedAgainst.length === 0 ? (
            <p>No complaints.</p>
          ) : (
            <ul className="list-disc ml-6">
              {employee.complaints.raisedAgainst.map((c, i) => (
                <li key={i}>
                  {c.issue} (by {c.by}, {c.date})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Complaints Raised By</h2>
          {employee.complaints.raisedBy.length === 0 ? (
            <p>No complaints.</p>
          ) : (
            <ul className="list-disc ml-6">
              {employee.complaints.raisedBy.map((c, i) => (
                <li key={i}>
                  {c.issue} (against {c.against}, {c.date})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
