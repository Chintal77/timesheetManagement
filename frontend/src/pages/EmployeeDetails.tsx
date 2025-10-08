import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ---- Interfaces ----
interface Project {
  name: string;
  duration: string;
}

interface Leave {
  total: number;
  markedOff: number;
  leavesTaken: number;
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
  leaves: Leave;
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
    leaves: { total: 18, markedOff: 5, leavesTaken: 5 },
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
    leaves: { total: 12, markedOff: 2, leavesTaken: 5 },
    complaints: { raisedAgainst: [], raisedBy: [] },
    salary: { fixed: 800000, variable: 200000 },
    appraisalDueDate: '2024-09-15',
    rating: 4.8,
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
    projects: [{ name: 'UI Redesign', duration: '2023 - Present' }],
    leaves: { total: 5, markedOff: 1, leavesTaken: 5 },
    complaints: { raisedAgainst: [], raisedBy: [] },
    salary: { fixed: 400000, variable: 50000 },
    appraisalDueDate: '2025-01-10',
    rating: 4.0,
  },
  {
    id: 4,
    name: 'Nikhil C',
    email: 'nikhil.c@talentBase.com',
    role: 'Senior Tester',
    phone: '9988776655',
    department: 'Design',
    joiningDate: '2023-03-20',
    status: 'Active',
    projects: [{ name: 'Automation Framework', duration: '2023 - Present' }],
    leaves: { total: 8, markedOff: 3, leavesTaken: 5 },
    complaints: { raisedAgainst: [], raisedBy: [] },
    salary: { fixed: 500000, variable: 70000 },
    appraisalDueDate: '2024-11-20',
    rating: 3.9,
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
    projects: [{ name: 'Campaign Analytics', duration: '2023 - Present' }],
    leaves: { total: 10, markedOff: 4, leavesTaken: 5 },
    complaints: { raisedAgainst: [], raisedBy: [] },
    salary: { fixed: 900000, variable: 150000 },
    appraisalDueDate: '2024-10-05',
    rating: 4.7,
  },
];

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const emp = mockEmployees.find((e) => e.id === Number(id));
    setEmployee(emp || null);
  }, [id]);

  if (!employee) {
    return (
      <div className="p-6 text-center text-red-500">Employee not found.</div>
    );
  }

  const leavesLeft = employee.leaves.total - employee.leaves.leavesTaken;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <Link to="/dashboard" className="text-blue-400 hover:underline">
          ← Back to Dashboard
        </Link>
        <Link
          to={`/attendance/${employee.id}`}
          className="text-blue-400 hover:underline"
        >
          Attendance Data →
        </Link>
      </div>

      <h1 className="text-3xl font-bold my-4">
        {employee.name} - {employee.role}
      </h1>

      {/* Personal Info */}
      <div className="bg-gray-800 border rounded-xl shadow p-6 mb-6">
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
      <div className="bg-gray-800 border rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Project History</h2>
        <ul className="list-disc ml-6">
          {employee.projects.map((proj, idx) => (
            <li key={idx}>
              {proj.name} ({proj.duration})
            </li>
          ))}
        </ul>
      </div>

      {/* Leaves */}
      <div className="bg-gray-800 border rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Leaves</h2>
        <p>
          <b>Total Leaves Allocated:</b> {employee.leaves.total}
        </p>
        <p>
          <b>Leaves Taken:</b> {employee.leaves.leavesTaken}
        </p>
        <p>
          <b>Marked Off:</b> {employee.leaves.markedOff}
        </p>
        <p>
          <b>Leaves Left:</b> {leavesLeft}
        </p>
      </div>

      {/* Complaints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border rounded-xl shadow p-6">
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
        <div className="bg-gray-800 border rounded-xl shadow p-6">
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
