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
  joiningDate: string; // Added joining date for leave calculation
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
    joiningDate: '2022-01-15',
  },
  {
    id: '2',
    name: 'Sanket P',
    email: 'sanket.p@talentBase.com',
    department: 'IT',
    designation: 'Lead',
    joiningDate: '2021-08-10',
  },
  {
    id: '3',
    name: 'Biswajit P',
    email: 'biswajit.p@talentBase.com',
    department: 'Design',
    designation: 'Designer',
    joiningDate: '2023-03-20',
  },
  {
    id: '4',
    name: 'Nikhil C',
    email: 'nikhil.c@talentBase.com',
    department: 'Design',
    designation: 'Senior Tester',
    joiningDate: '2023-03-20',
  },
  {
    id: '5',
    name: 'Rahul G',
    email: 'rahul.g@talentBase.com',
    department: 'Marketing',
    designation: 'Manager',
    joiningDate: '2023-03-20',
  },
];

export default function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const employee = employees.find((e) => e.id === id);

  if (!employee)
    return <div className="p-6 text-white">Employee not found</div>;

  // ---- Timesheet & Leave data from localStorage ----
  const savedEntries: TimesheetEntry[] = JSON.parse(
    localStorage.getItem(`timesheet_entries_${employee.email}`) || '[]'
  );
  const savedLeaves: Leave[] = JSON.parse(
    localStorage.getItem(`leaves_${employee.email}`) || '[]'
  );

  // ---- Include leave entries in timesheet (including Sundays) ----
  const leaveEntries: TimesheetEntry[] = [];
  savedLeaves.forEach((leave) => {
    const from = new Date(leave.fromDate); // const instead of let
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
      from.setDate(from.getDate() + 1); // mutating the Date object is OK
    }
  });

  const allEntries = [...savedEntries, ...leaveEntries];

  // ---- Attendance Summary & Status ----
  let present = 0,
    halfLeave = 0,
    leaveDays = 0,
    absent = 0,
    weekend = 0,
    totalHours = 0;

  const entriesWithStatus: (TimesheetEntry & { status: string })[] = [];

  allEntries.forEach((entry) => {
    const day = new Date(entry.date).getDay();
    totalHours += entry.hours;
    let status = '';

    if (entry.task.includes('On Leave')) {
      leaveDays++;
      status = 'L';
    } else if (entry.hours === 0) {
      absent++;
      status = 'LOP';
    } else if (entry.hours < MIN_HOURS_FOR_FULL_DAY) {
      halfLeave++;
      status = 'HL';
    } else {
      present++;
      status = 'P';
    }

    if (day === 0) weekend++; // just count Sunday

    entriesWithStatus.push({ ...entry, status });
  });

  // ---- Leaves accounting with monthly accrual from next month of joining ----
  const joining = new Date(employee.joiningDate);
  const today = new Date();
  const monthsSinceJoining =
    (today.getFullYear() - joining.getFullYear()) * 12 +
    (today.getMonth() - joining.getMonth() - 1); // accrual from next month
  const availableLeaves = monthsSinceJoining * MONTHLY_EARNED_LEAVES;

  let leavesTaken = leaveDays + halfLeave * 0.5;
  let excessLeaves = 0;

  if (leavesTaken > availableLeaves) {
    excessLeaves = leavesTaken - availableLeaves;
    leavesTaken = availableLeaves;

    // mark excess leave entries as LOP
    let excessCount = excessLeaves;
    for (let i = 0; i < entriesWithStatus.length && excessCount > 0; i++) {
      if (entriesWithStatus[i].status === 'L') {
        entriesWithStatus[i].status = 'LOP';
        excessCount--;
      }
    }
  }

  const lopDays = absent + excessLeaves;
  const lopHours = lopDays * LOP_PER_ABSENT_HOUR;
  const leavesRemaining = availableLeaves - leavesTaken;

  // ---- Group by month for CSV ----
  const getEntriesByMonth = () => {
    const groups: Record<string, typeof entriesWithStatus> = {};
    entriesWithStatus.forEach((entry) => {
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
        <div>Present: {present}</div>
        <div>Absent (LOP): {lopDays}</div>
        <div>LOP Hours: {lopHours}</div>
        <div>Half Leave (under 8.5 hrs): {halfLeave}</div>
        <div>Weekend: {weekend}</div>
        <div>Total Hours: {totalHours}</div>
        <div>Available Leaves: {availableLeaves}</div>
        <div>Leaves Taken (Used): {leavesTaken}</div>
        <div>
          Leaves Remaining:{' '}
          {leavesRemaining < 0 ? 0 : leavesRemaining.toFixed(1)}
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
