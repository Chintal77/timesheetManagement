import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface Leave {
  fromDate: string;
  toDate: string;
  reportingManager: string;
  resumeDate: string;
  summary: string;
  emergencyNumber: string;
}

const Leave: React.FC = () => {
  const [leave, setLeave] = useState<Leave>({
    fromDate: '',
    toDate: '',
    reportingManager: '',
    resumeDate: '',
    summary: '',
    emergencyNumber: '',
  });

  const [leavesList, setLeavesList] = useState<Leave[]>([]);

  // ✅ Load applied leaves for current user
  useEffect(() => {
    const loggedInEmail =
      localStorage.getItem('currentUserEmail') || 'gaurav.p@talentBase.com';
    const storedLeaves = JSON.parse(
      localStorage.getItem(`leaves_${loggedInEmail}`) || '[]'
    );
    setLeavesList(storedLeaves);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLeave({ ...leave, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Identify logged-in employee (fallback to Gaurav if not set)
    const loggedInEmail =
      localStorage.getItem('currentUserEmail') || 'gaurav.p@talentBase.com';

    // ✅ Fetch & store leaves per user
    const storedLeaves = JSON.parse(
      localStorage.getItem(`leaves_${loggedInEmail}`) || '[]'
    );
    storedLeaves.push(leave);
    localStorage.setItem(
      `leaves_${loggedInEmail}`,
      JSON.stringify(storedLeaves)
    );

    setLeavesList(storedLeaves);

    alert('✅ Leave applied successfully!');
    // ❌ No navigation to timesheet
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          🏖️ Apply for Leave
        </h2>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From and To Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
                <CalendarIcon className="h-5 w-5 text-indigo-500" />
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={leave.fromDate}
                onChange={handleChange}
                required
                className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
                <CalendarIcon className="h-5 w-5 text-indigo-500" />
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={leave.toDate}
                onChange={handleChange}
                required
                className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Reporting Manager */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <UserCircleIcon className="h-5 w-5 text-indigo-500" />
              Reporting Manager
            </label>
            <input
              type="text"
              name="reportingManager"
              value={leave.reportingManager}
              onChange={handleChange}
              placeholder="Enter your reporting manager"
              required
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Resume Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
              Date of Resuming
            </label>
            <input
              type="date"
              name="resumeDate"
              value={leave.resumeDate}
              onChange={handleChange}
              required
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Reason / Summary */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />
              Reason / Summary
            </label>
            <textarea
              name="summary"
              value={leave.summary}
              onChange={handleChange}
              placeholder="Enter your reason for leave"
              required
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white h-24 resize-none"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-1">
              <PhoneIcon className="h-5 w-5 text-indigo-500" />
              Emergency Contact
            </label>
            <input
              type="tel"
              name="emergencyNumber"
              value={leave.emergencyNumber}
              onChange={handleChange}
              placeholder="Enter 10-digit number"
              pattern="[0-9]{10}"
              required
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform duration-200"
            >
              ✅ Apply Leave
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Leave Summary Table */}
      {leavesList.length > 0 && (
        <div className="max-w-5xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            🗓️ Summary of Leaves Applied
          </h3>
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-indigo-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 border">From</th>
                <th className="p-3 border">To</th>
                <th className="p-3 border">Resume Date</th>
                <th className="p-3 border">Manager</th>
                <th className="p-3 border">Reason</th>
                <th className="p-3 border">Emergency Contact</th>
              </tr>
            </thead>
            <tbody>
              {leavesList.map((l, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : 'bg-white dark:bg-gray-900'
                  }`}
                >
                  <td className="p-3 border text-center">{l.fromDate}</td>
                  <td className="p-3 border text-center">{l.toDate}</td>
                  <td className="p-3 border text-center">{l.resumeDate}</td>
                  <td className="p-3 border text-center">
                    {l.reportingManager}
                  </td>
                  <td className="p-3 border text-center">{l.summary}</td>
                  <td className="p-3 border text-center">
                    {l.emergencyNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        🗓️ Your applied leaves are displayed above and also saved locally.
      </div>

      {/* Info Footer */}
      <div className="mt-8 flex justify-between items-center text-gray-600 dark:text-gray-400">
        <a
          href="/timesheet"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          ← Go to Timesheet
        </a>
      </div>
    </div>
  );
};

export default Leave;
