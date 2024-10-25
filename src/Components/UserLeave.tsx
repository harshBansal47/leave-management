import React, { useState, useMemo } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Table from './Table';
import { MRT_ColumnDef } from 'material-react-table';

interface LeaveData {
  type: string;
  status: string;
  dates: string;
  notes: string;
}

const UserLeavePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [leaveData, setLeaveData] = useState<LeaveData[]>([
    { type: 'Sick Leave', status: 'Approved', dates: '2024-10-01 to 2024-10-03', notes: 'Fever' },
    { type: 'Casual Leave', status: 'Pending', dates: '2024-10-15', notes: 'Family Function' },
    { type: 'Annual Leave', status: 'Rejected', dates: '2024-09-20 to 2024-09-22', notes: 'Vacation' },
  ]);

  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [notes, setNotes] = useState('');
  const [isSingleDay, setIsSingleDay] = useState(true);
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dates = isSingleDay
      ? format(dateRange.startDate, 'yyyy-MM-dd')
      : `${format(dateRange.startDate, 'yyyy-MM-dd')} to ${format(dateRange.endDate, 'yyyy-MM-dd')}`;
    const formData: LeaveData = {
      type: leaveType,
      status: 'Pending',
      dates,
      notes,
    };
    setLeaveData([...leaveData, formData]);
    setShowForm(false);
    setLeaveType('Annual Leave');
    setDateRange({ startDate: new Date(), endDate: new Date(), key: 'selection' });
    setNotes('');
    setIsSingleDay(true);
  };

  const columns = useMemo<MRT_ColumnDef<LeaveData>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Leave Type',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => (
          <span className={
            row.original.status === 'Approved'
              ? 'text-green-600 font-semibold'
              : row.original.status === 'Rejected'
                ? 'text-red-600 font-semibold'
                : 'text-yellow-600 font-semibold'
          }>
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'dates',
        header: 'Dates',
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
      },
    ],
    []
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
            onClick={() => setShowForm(true)}
          >
            Create Leave
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Apply for Leave</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Leave Type:</label>
                  <select
                    className="border rounded-lg w-full p-2 focus:outline-none focus:border-blue-500"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Leave Duration:</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2"
                        checked={isSingleDay}
                        onChange={() => setIsSingleDay(true)}
                      />
                      Single Day
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2"
                        checked={!isSingleDay}
                        onChange={() => setIsSingleDay(false)}
                      />
                      Multiple Days
                    </label>
                  </div>
                  <DateRange
                    ranges={[{
                      ...dateRange,
                      endDate: isSingleDay ? dateRange.startDate : dateRange.endDate,
                    }]}
                    onChange={(ranges) => {
                      const { startDate, endDate } = ranges.selection;
                      setDateRange({
                        ...dateRange,
                        startDate,
                        endDate: isSingleDay ? startDate : endDate,
                      });
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    direction="horizontal"
                    editableDateInputs={true}
                    rangeColors={['#3b82f6']}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Notes:</label>
                  <textarea
                    className="border rounded-lg w-full p-2 focus:outline-none focus:border-blue-500"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-500">{200 - notes.length} characters left</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition duration-200"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-200"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-4 bg-white rounded-lg p-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
            Applied Leaves
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <div className="mt-2">
              <Table columns={columns} data={leaveData} />
            </div>
          </div>
        </div>


        <div className="my-6 bg-white rounded-lg p-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
            Dashboard
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-md font-medium">Total Leaves (Year)</h3>
                <p className="text-3xl font-bold">25</p>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-md font-medium">Total Leaves (Month)</h3>
                <p className="text-3xl font-bold">5</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2 ">
            Leave History
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-md font-medium text-gray-700 mb-2">
              Year: 2024
            </h3>
            <h4 className="font-semibold text-gray-700 mt-2 mb-4 border-b pb-1">
              October
            </h4>
            <div className="mt-2">
              <Table columns={columns} data={leaveData} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserLeavePage;