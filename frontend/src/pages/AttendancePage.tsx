import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// ---- Interfaces ----
interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  attendance: Record<string, string[]>; // required
}

// ---- Utility to generate dates ----
const generateDates = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// ---- Month dates ----
const juneDates = generateDates(new Date(2025, 5, 1), new Date(2025, 5, 30));
const julyDates = generateDates(new Date(2025, 6, 1), new Date(2025, 6, 31));
const augustDates = generateDates(new Date(2025, 7, 1), new Date(2025, 7, 31));
const septemberDates = generateDates(
  new Date(2025, 8, 1),
  new Date(2025, 8, 30)
);
const octoberDates = generateDates(
  new Date(2025, 9, 1),
  new Date(2025, 9, new Date().getDate())
);

// ---- Base employees ----
const baseEmployees: Omit<Employee, 'attendance'>[] = [
  {
    id: '1',
    name: 'Gaurav P',
    department: 'IT',
    designation: 'Backend Developer',
  },
  { id: '2', name: 'Sanket P', department: 'IT', designation: 'Lead' },
  {
    id: '3',
    name: 'Biswajit P',
    department: 'Design',
    designation: 'Designer',
  },
  {
    id: '4',
    name: 'Nikhil C',
    department: 'Design',
    designation: 'Senior Tester',
  },
  { id: '5', name: 'Rahul G', department: 'Marketing', designation: 'Manager' },
];

// ---- Random attendance generator ----
const generateDummyAttendance = (dates: Date[]): string[] => {
  const statuses = ['P', 'A', 'HL'];
  return dates.map((d) =>
    d.getDay() === 0
      ? 'W'
      : statuses[Math.floor(Math.random() * statuses.length)]
  );
};

// ---- Employees with attendance ----
const employees: Employee[] = baseEmployees.map((emp) => ({
  ...emp,
  attendance: {
    June: generateDummyAttendance(juneDates),
    July: generateDummyAttendance(julyDates),
    August: generateDummyAttendance(augustDates),
    September: generateDummyAttendance(septemberDates),
    October: generateDummyAttendance(octoberDates),
  },
}));

// ---- Export CSV (with working hours) ----
const exportToCSV = (employee: Employee, month: string, dates: Date[]) => {
  let csv = 'Date,Day,Status,Hours\n';
  employee.attendance[month].forEach((status, i) => {
    const date = dates[i];
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
    const hours = status === 'P' ? 8 : status === 'HL' ? 6.3 : 0;
    csv += `${date.toLocaleDateString(
      'en-GB'
    )},${dayName},${status},${hours}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${employee.name}_${month}_Attendance.csv`;
  link.click();
};

// ---- Working hours mapping ----
const statusHours: Record<string, number> = {
  P: 9,
  HL: 6.3,
  A: 0,
  W: 0,
};

// Monthly earned leaves per month
const MONTHLY_EARNED_LEAVES = 2;

export default function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const [selectedMonth, setSelectedMonth] = useState<
    'June' | 'July' | 'August' | 'September' | 'October'
  >('June');

  const monthDates =
    selectedMonth === 'June'
      ? juneDates
      : selectedMonth === 'July'
      ? julyDates
      : selectedMonth === 'August'
      ? augustDates
      : selectedMonth === 'September'
      ? septemberDates
      : octoberDates;

  const employee = employees.find((emp) => emp.id === id);
  if (!employee)
    return <div className="p-6 text-white">Employee not found</div>;

  // ---- Summary calculation ----
  const summary = employee.attendance[selectedMonth].reduce((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ---- Total working hours ----
  const totalHours = employee.attendance[selectedMonth].reduce(
    (sum, status) => sum + (statusHours[status] || 0),
    0
  );

  // ---- Leaves applied ----
  const leavesTaken = summary['HL'] || 0;
  const totalEarnedLeaves = MONTHLY_EARNED_LEAVES - leavesTaken;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Back link */}
      <div className="flex justify-start items-center mb-4">
        <Link
          to={`/employee/${employee.id}`}
          className="text-blue-400 hover:underline"
        >
          ← Back to Employee List
        </Link>
      </div>

      {/* Header & Month Selector */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Attendance of {employee.name}</h1>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedMonth(
                e.target.value as
                  | 'June'
                  | 'July'
                  | 'August'
                  | 'September'
                  | 'October'
              )
            }
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
          >
            <option value="June">June 2025</option>
            <option value="July">July 2025</option>
            <option value="August">August 2025</option>
            <option value="September">September 2025</option>
            <option value="October">October 2025</option>
          </select>
          <button
            onClick={() => exportToCSV(employee, selectedMonth, monthDates)}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-6 mb-4 text-sm font-medium">
        <div>Present: {summary['P'] || 0}</div>
        <div>Absent: {summary['A'] || 0}</div>
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
              ? 'Absent'
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

      {/* Attendance Table */}
      <div className="overflow-auto border border-gray-700 rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 sticky top-0 z-20">
              <th
                colSpan={4}
                className="sticky left-0 bg-gray-800 border border-gray-700 z-20"
              >
                <div className="flex w-[500px]">
                  <div className="w-24 p-2 border-r border-gray-700 font-semibold">
                    Emp ID
                  </div>
                  <div className="w-40 p-2 border-r border-gray-700 font-semibold">
                    Name
                  </div>
                  <div className="w-32 p-2 border-r border-gray-700 font-semibold">
                    Dept
                  </div>
                  <div className="w-64 p-2 font-semibold">Designation</div>
                </div>
              </th>
              {monthDates.map((date, i) => (
                <th
                  key={i}
                  className="p-2 border border-gray-700 text-xs text-center whitespace-nowrap"
                >
                  {date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </th>
              ))}
              <th className="p-2 border border-gray-700 text-center font-semibold sticky right-0 bg-gray-800 z-10">
                Summary
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-gray-800 odd:bg-gray-900 even:bg-gray-800">
              <td
                colSpan={4}
                className="sticky left-0 bg-gray-900 border border-gray-700 z-10"
              >
                <div className="flex w-[500px]">
                  <div className="w-24 p-2 border-r border-gray-700">
                    {employee.id}
                  </div>
                  <div className="w-40 p-2 border-r border-gray-700">
                    {employee.name}
                  </div>
                  <div className="w-32 p-2 border-r border-gray-700">
                    {employee.department}
                  </div>
                  <div className="w-64 p-2">{employee.designation}</div>
                </div>
              </td>

              {employee.attendance[selectedMonth].map((status, i) => {
                const hours = statusHours[status] || 0;
                const color =
                  status === 'P'
                    ? 'bg-green-600'
                    : status === 'A'
                    ? 'bg-red-600'
                    : status === 'HL'
                    ? 'bg-yellow-600'
                    : 'bg-gray-600';
                return (
                  <td
                    key={i}
                    className={`p-2 text-center border border-gray-700 ${color}`}
                    title={`${monthDates[i].toLocaleDateString(
                      'en-GB'
                    )} - ${status} (${hours}h)`}
                  >
                    {status}
                    <div className="text-xs text-gray-100">{hours}h</div>
                  </td>
                );
              })}

              {/* Summary column */}
              <td className="sticky right-0 bg-gray-900 border border-gray-700 text-center font-semibold z-10">
                P:{summary['P'] || 0}, A:{summary['A'] || 0}, HL:
                {summary['HL'] || 0}, W:{summary['W'] || 0}
                <br />
                Total Hours: {totalHours}
                <br />
                Leaves Remaining:{' '}
                {totalEarnedLeaves < 0 ? 0 : totalEarnedLeaves}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
