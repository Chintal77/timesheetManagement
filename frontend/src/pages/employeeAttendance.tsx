import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Constants
const OFFICE_START_HOUR = 9;
const OFFICE_END_HOUR = 18;
const MONTHLY_EARNED_LEAVES = 2;
const MIN_HOURS_FOR_FULL_DAY = 8.5;

// Employee & Timesheet interfaces
interface Employee {
  id: string;
  email: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
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

// Sample employees
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

const AttendanceSummary: React.FC = () => {
  const summary = employees.map((emp) => {
    const savedEntries: TimesheetEntry[] = JSON.parse(
      localStorage.getItem(`timesheet_entries_${emp.email}`) || '[]'
    );
    const savedLeaves: Leave[] = JSON.parse(
      localStorage.getItem(`leaves_${emp.email}`) || '[]'
    );

    // Convert leaves into timesheet entries
    const leaveEntries: TimesheetEntry[] = [];
    savedLeaves.forEach((leave) => {
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      while (from <= to) {
        const dateStr = from.toISOString().split('T')[0];
        if (!savedEntries.some((e) => e.date === dateStr)) {
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

    let present = 0,
      halfLeave = 0,
      leaveDays = 0,
      absent = 0;
    const dayWise: { date: string; status: string; hours: number }[] = [];

    allEntries.forEach((entry) => {
      let status = '';
      const hoursWithinOffice = Math.min(
        entry.hours,
        OFFICE_END_HOUR - OFFICE_START_HOUR
      );

      if (entry.task.includes('On Leave')) {
        status = 'Leave';
        leaveDays++;
      } else if (hoursWithinOffice === 0) {
        status = 'Absent';
        absent++;
      } else if (hoursWithinOffice < MIN_HOURS_FOR_FULL_DAY) {
        status = 'Half Day';
        halfLeave++;
      } else {
        status = 'Present';
        present++;
      }

      dayWise.push({ date: entry.date, status, hours: entry.hours });
    });

    const leavesTaken = leaveDays + halfLeave * 0.5;
    const totalAbsent =
      absent + Math.max(0, leavesTaken - MONTHLY_EARNED_LEAVES * 12);
    const totalDays = allEntries.length;

    return {
      id: emp.id,
      name: emp.name,
      totalDays,
      presentDays: present,
      absentDays: totalAbsent,
      leavesTaken,
      dayWise,
    };
  });

  // Function to map status to color
  const statusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return '#4ade80'; // green
      case 'Half Day':
        return '#facc15'; // yellow
      case 'Absent':
        return '#f87171'; // red
      case 'Leave':
        return '#60a5fa'; // blue
      default:
        return '#9ca3af'; // gray
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Attendance Summary
        </h1>
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Summary Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg mb-8">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              {['Name', 'Total Days', 'Present', 'Absent', 'Leaves Taken'].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-gray-600 dark:text-gray-300 uppercase"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {summary.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                  {record.name}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                  {record.totalDays}
                </td>
                <td className="px-6 py-4 text-green-500 font-semibold">
                  {record.presentDays}
                </td>
                <td className="px-6 py-4 text-red-500 font-semibold">
                  {record.absentDays}
                </td>
                <td className="px-6 py-4 text-yellow-400 font-semibold">
                  {record.leavesTaken}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Day-wise Chart */}
      {summary.map((emp) => (
        <div key={emp.id} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            {emp.name} - Day-wise Attendance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={emp.dayWise}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" name="Hours Worked">
                {emp.dayWise.map((day, index) => (
                  <Cell key={index} fill={statusColor(day.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default AttendanceSummary;
