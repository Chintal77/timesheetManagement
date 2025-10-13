import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';

// ---- Constants ----
const LOP_PER_ABSENT_HOUR = 9;
const MONTHLY_EARNED_LEAVES = 2;
const MIN_HOURS_FOR_FULL_DAY = 8.5; // 8 hours 30 minutes

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

interface Leave {
  fromDate: string;
  toDate: string;
  summary: string;
}

// ---- Base employees ----
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
  const savedEntries = JSON.parse(
    localStorage.getItem(`timesheet_entries_${employee.email}`) || '[]'
  );
  const savedLeaves: Leave[] = JSON.parse(
    localStorage.getItem('leaves') || '[]'
  );

  // ---- Include leave entries in timesheet ----
  const leaveEntries: TimesheetEntry[] = [];
  savedLeaves.forEach((leave) => {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    while (from <= to) {
      const dateStr = from.toISOString().split('T')[0];
      if (!savedEntries.some((e: TimesheetEntry) => e.date === dateStr)) {
        leaveEntries.push({
          date: dateStr,
          task: `On Leave - ${leave.summary}`,
          hours: 0,
        });
      }
      from.setDate(from.getDate() + 1);
    }
  });

  const allEntries = [...savedEntries, ...leaveEntries];

  // ---- Summary calculation ----
  const summary = allEntries.reduce((acc: Record<string, number>, entry) => {
    const day = new Date(entry.date).getDay();
    if (day === 0) acc['W'] = (acc['W'] || 0) + 1; // Weekend
    else if (entry.hours === 0) acc['A'] = (acc['A'] || 0) + 1; // Absent
    else if (entry.hours < MIN_HOURS_FOR_FULL_DAY)
      acc['HL'] = (acc['HL'] || 0) + 1; // Half Leave
    else acc['P'] = (acc['P'] || 0) + 1; // Present
    return acc;
  }, {});

  const totalHours = allEntries.reduce((sum, e) => sum + e.hours, 0);
  const lopDays = summary['A'] || 0;
  const lopHours = lopDays * LOP_PER_ABSENT_HOUR;
  const halfLeaves = summary['HL'] || 0;
  const halfLeaveDeduction = halfLeaves * 0.5;
  const leavesTakenCount = lopDays + halfLeaveDeduction;
  const leavesLeft = MONTHLY_EARNED_LEAVES - leavesTakenCount;

  // ---- STORE LEAVES TAKEN IN LOCALSTORAGE ----

  localStorage.setItem(
    `leavesTaken_${employee.email}`,
    JSON.stringify(leavesTakenCount)
  );

  // ---- Group by month for CSV ----
  const getEntriesByMonth = () => {
    const groups: Record<string, TimesheetEntry[]> = {};
    allEntries.forEach((entry) => {
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
      <div className="flex justify-start items-center mb-4">
        <Link
          to={`/employee/${employee.id}`}
          className="text-blue-400 hover:underline"
        >
          ← Back to Employee
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Attendance of {employee.name}</h1>

      <div className="flex flex-wrap gap-6 mb-4 text-sm font-medium">
        <div>Present: {summary['P'] || 0}</div>
        <div>Absent (LOP): {lopDays}</div>
        <div>LOP Hours: {lopHours}</div>
        <div>Half Leave (under 8.5 hrs): {halfLeaves}</div>
        <div>Weekend: {summary['W'] || 0}</div>
        <div>Total Hours: {totalHours}</div>
        <div>Monthly Earned Leaves: {MONTHLY_EARNED_LEAVES}</div>
        <div>Leaves Taken: {leavesTakenCount}</div>
        <div>
          Leaves Remaining: {leavesLeft < 0 ? 0 : leavesLeft.toFixed(1)}
        </div>
      </div>

      <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-400">
          📥 Download Timesheet CSV
        </h2>
        {allEntries.length === 0 ? (
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
