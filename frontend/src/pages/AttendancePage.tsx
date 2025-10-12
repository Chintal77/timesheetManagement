import React from 'react';
import { Link, useParams } from 'react-router-dom';

// ---- Constants ----
const LOP_PER_ABSENT_HOUR = 9;
const MONTHLY_EARNED_LEAVES = 2;

// ---- Base employees ----
interface Employee {
  id: string;
  email: string;
  name: string;
  department: string;
  designation: string;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'Gaurav P',
    email: 'gaurav.p@talentBase.com',
    department: 'IT',
    designation: 'Backend Developer',
  },
  {
    id: '2',
    name: 'Sanket P',
    email: 'sanket.p@talentBase.com',
    department: 'IT',
    designation: 'Lead',
  },
  {
    id: '3',
    name: 'Biswajit P',
    email: 'biswajit.p@talentBase.com',
    department: 'Design',
    designation: 'Designer',
  },
  {
    id: '4',
    name: 'Nikhil C',
    email: 'nikhil.c@talentBase.com',
    department: 'Design',
    designation: 'Senior Tester',
  },
  {
    id: '5',
    name: 'Rahul G',
    email: 'rahul.g@talentBase.com',
    department: 'Marketing',
    designation: 'Manager',
  },
];

export default function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const employee = employees.find((e) => e.id === id);

  if (!employee)
    return <div className="p-6 text-white">Employee not found</div>;

  // ---- Timesheet entries from localStorage ----
  const saved = localStorage.getItem(`timesheet_entries_${employee.email}`);
  const timesheetEntries: { date: string; task: string; hours: number }[] =
    saved ? JSON.parse(saved) : [];

  // ---- Summary calculation ----
  const summary = timesheetEntries.reduce(
    (acc: Record<string, number>, entry) => {
      const day = new Date(entry.date).getDay();
      if (entry.hours === 0 && day !== 0)
        acc['A'] = (acc['A'] || 0) + 1; // Absent
      else if (entry.hours > 0 && entry.hours < 9)
        acc['HL'] = (acc['HL'] || 0) + 1; // Half Leave
      else if (entry.hours >= 9) acc['P'] = (acc['P'] || 0) + 1; // Present
      else if (day === 0) acc['W'] = (acc['W'] || 0) + 1; // Weekend
      return acc;
    },
    {}
  );

  const totalHours = timesheetEntries.reduce((sum, e) => sum + e.hours, 0);
  const lopDays = summary['A'] || 0;
  const lopHours = lopDays * LOP_PER_ABSENT_HOUR;
  const leavesTaken = summary['HL'] || 0;
  const totalEarnedLeaves = MONTHLY_EARNED_LEAVES - leavesTaken;

  const handleDownloadCSV = () => {
    const header = 'Date,Task,Hours\n';
    const rows = timesheetEntries
      .map(
        (e) =>
          `${new Date(e.date).toLocaleDateString('en-GB')},${e.task},${e.hours}`
      )
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${employee.name}_Timesheet.csv`;
    link.click();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Back link */}
      <div className="flex justify-start items-center mb-4">
        <Link
          to={`/employee/${employee.id}`}
          className="text-blue-400 hover:underline"
        >
          ← Back to Employee
        </Link>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Attendance of {employee.name}</h1>
      </div>

      {/* Summary */}
      <div className="flex gap-6 mb-4 text-sm font-medium">
        <div>Present: {summary['P'] || 0}</div>
        <div>Absent (LOP): {lopDays}</div>
        <div>LOP Hours: {lopHours}</div>
        <div>Half Leave: {summary['HL'] || 0}</div>
        <div>Weekend: {summary['W'] || 0}</div>
        <div>Total Hours: {totalHours}</div>
        <div>Monthly Earned Leaves: {MONTHLY_EARNED_LEAVES}</div>
        <div>
          Leaves Remaining: {totalEarnedLeaves < 0 ? 0 : totalEarnedLeaves}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-2 text-sm">
        {['P', 'A', 'HL', 'W'].map((s) => {
          const color =
            s === 'P'
              ? 'green-600'
              : s === 'A'
              ? 'red-600'
              : s === 'HL'
              ? 'yellow-600'
              : 'gray-600';
          const label =
            s === 'P'
              ? 'Present'
              : s === 'A'
              ? 'Absent (LOP)'
              : s === 'HL'
              ? 'Half Leave'
              : 'Weekend';
          return (
            <div key={s} className="flex items-center gap-1">
              <span className={`w-4 h-4 inline-block bg-${color}`}></span>
              {s}: {label}
            </div>
          );
        })}
      </div>

      {/* Timesheet Table */}
      <div className="mt-10 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3 text-green-400">
          🕒 Timesheet Entries (from TimesheetFill)
        </h2>

        {timesheetEntries.length === 0 ? (
          <p className="text-gray-400">
            No timesheet data found for this user.
          </p>
        ) : (
          <div>
            <div className="overflow-x-auto border border-gray-700 rounded-lg mb-4">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-700 text-gray-200">
                  <tr>
                    <th className="p-2 border border-gray-600 text-left">
                      Date
                    </th>
                    <th className="p-2 border border-gray-600 text-left">
                      Task
                    </th>
                    <th className="p-2 border border-gray-600 text-left">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timesheetEntries.map((entry, idx) => (
                    <tr
                      key={idx}
                      className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition"
                    >
                      <td className="p-2 border border-gray-700">
                        {new Date(entry.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="p-2 border border-gray-700">
                        {entry.task}
                      </td>
                      <td className="p-2 border border-gray-700">
                        {entry.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              📄 Export Timesheet CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
