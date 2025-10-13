import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [leave, setLeave] = useState<Leave>({
    fromDate: '',
    toDate: '',
    reportingManager: '',
    resumeDate: '',
    summary: '',
    emergencyNumber: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLeave({ ...leave, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedLeaves = JSON.parse(localStorage.getItem('leaves') || '[]');
    storedLeaves.push(leave);
    localStorage.setItem('leaves', JSON.stringify(storedLeaves));
    alert('✅ Leave applied successfully!');
    navigate('/timesheet-fill');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          🏖️ Apply for Leave
        </h2>
        <button
          onClick={() => navigate('/timesheet')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          ← Back to Timesheet
        </button>
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

      {/* Info Footer */}
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        🗓️ Once applied, your leave will appear in the Timesheet & CSV.
      </div>
    </div>
  );
};

export default Leave;
