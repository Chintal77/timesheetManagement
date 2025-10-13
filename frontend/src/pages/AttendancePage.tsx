import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';

// ---- Constants ----
const LOP_PER_ABSENT_HOUR = 9;
const MONTHLY_EARNED_LEAVES = 2;
const MIN_HOURS_FOR_FULL_DAY = 8.5; // 8 hours 30 minutes

// ---- Base employees ----
interface Employee {
  id: string;
  email: string;
  name: string;
  department: string;
  designation: string;
}

interface TimesheetEntry {
  date: string;
  task: string;
  hours: number;
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
  const timesheetEntries: TimesheetEntry[] = saved ? JSON.parse(saved) : [];

  // ---- Summary calculation ----
  const summary = timesheetEntries.reduce(
    (acc: Record<string, number>, entry) => {
      const day = new Date(entry.date).getDay();

      if (day === 0) {
        acc['W'] = (acc['W'] || 0) + 1; // Weekend
      } else if (entry.hours === 0) {
        acc['A'] = (acc['A'] || 0) + 1; // Absent
      } else if (entry.hours < MIN_HOURS_FOR_FULL_DAY) {
        acc['HL'] = (acc['HL'] || 0) + 1; // Half Leave (less than 8.5 hrs)
      } else {
        acc['P'] = (acc['P'] || 0) + 1; // Present
      }

      return acc;
    },
    {}
  );

  // ---- Totals and deductions ----
  const totalHours = timesheetEntries.reduce((sum, e) => sum + e.hours, 0);
  const lopDays = summary['A'] || 0;
  const lopHours = lopDays * LOP_PER_ABSENT_HOUR;
  const halfLeaves = summary['HL'] || 0;
  const halfLeaveDeduction = halfLeaves * 0.5;
  const totalEarnedLeaves = MONTHLY_EARNED_LEAVES - halfLeaveDeduction;

  // ---- Group by month for CSV ----
  const getEntriesByMonth = () => {
    const groups: Record<string, TimesheetEntry[]> = {};
    timesheetEntries.forEach((entry) => {
      const month = new Date(entry.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!groups[month]) groups[month] = [];
      groups[month].push({
        ...entry,
        date: new Date(entry.date).toLocaleDateString('en-GB'),
      });
    });
    return groups;
  };

  const monthlyEntries = getEntriesByMonth();

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
      <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium">
        <div>Present: {summary['P'] || 0}</div>
        <div>Absent (LOP): {lopDays}</div>
        <div>LOP Hours: {lopHours}</div>
        <div>Half Leave (under 8.5 hrs): {halfLeaves}</div>
        <div>Weekend: {summary['W'] || 0}</div>
        <div>Total Hours: {totalHours}</div>
        <div>Monthly Earned Leaves: {MONTHLY_EARNED_LEAVES}</div>
        <div>
          Leaves Remaining:{' '}
          {totalEarnedLeaves < 0 ? 0 : totalEarnedLeaves.toFixed(1)}
        </div>
      </div>

      {/* ✅ CSV Download Buttons Only */}
      <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-400">
          📥 Download Timesheet CSV
        </h2>

        {timesheetEntries.length === 0 ? (
          <p className="text-gray-400">
            No timesheet data found for this user.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(monthlyEntries).map(([month, data]) => (
              <CSVLink
                key={month}
                data={data}
                filename={`${employee.name}_Timesheet_${month}.csv`}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-md transition-all"
              >
                📅 Download {month} CSV
              </CSVLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
