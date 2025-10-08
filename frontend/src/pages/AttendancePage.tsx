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
  const statuses = ['P', 'A', 'L'];
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

// ---- AttendancePage component ----
export default function AttendancePage() {
  const { id } = useParams<{ id: string }>(); // Get employee ID from URL
  const [selectedMonth, setSelectedMonth] = useState<
    'June' | 'July' | 'August' | 'September' | 'October'
  >('October');

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

  // Filter employee by ID
  const employee = employees.find((emp) => emp.id === id);

  if (!employee)
    return <div className="p-6 text-white">Employee not found</div>;

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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attendance of {employee.name}</h1>
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
      </div>

      {/* Attendance Table */}
      <div className="overflow-auto border border-gray-700 rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800">
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
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-gray-800">
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

              {employee.attendance[selectedMonth].map((status, i) => (
                <td
                  key={i}
                  className={`p-2 text-center border border-gray-700 ${
                    status === 'P'
                      ? 'bg-green-600'
                      : status === 'A'
                      ? 'bg-red-600'
                      : status === 'L'
                      ? 'bg-yellow-600'
                      : 'bg-gray-600'
                  }`}
                >
                  {status}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
