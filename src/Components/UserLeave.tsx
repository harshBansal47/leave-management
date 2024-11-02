import React, { useState, useMemo, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Table from './Table';
import { MRT_ColumnDef } from 'material-react-table';
import CreateLeaveForm from './CreateLeaveForm';
import { fetchLeaveData, EmployeeLeaveSummary, LeaveType } from '../Services';

const UserLeavePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [leaveData, setLeaveData] = useState<LeaveType[]>([]);
  const [leaveSummary, setLeaveSummary] = useState<EmployeeLeaveSummary | null>(null);

  // Fetch data on component load
  useEffect(() => {
    const loadLeaveData = async () => {
      const employeeId = 'emp123'; // Placeholder; replace with actual employee ID
      const data = await fetchLeaveData(employeeId);
      if (data) {
        setLeaveData(data.allLeaves); // Populate table with leave data
        setLeaveSummary(data); // Populate dashboard summary
      }
    };
    loadLeaveData();
  }, []);

  const handleLeaveCreate = (newLeave: LeaveType) => {
    setLeaveData([...leaveData, newLeave]);
  };

  const columns = useMemo<MRT_ColumnDef<LeaveType>[]>(() => [
    { accessorKey: 'type', header: 'Leave Type' },
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
    { accessorKey: 'dates', header: 'Dates' },
    { accessorKey: 'notes', header: 'Notes' },
  ], []);

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
          <CreateLeaveForm
            onLeaveCreate={handleLeaveCreate}
            onClose={() => setShowForm(false)}
          />
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
                <p className="text-3xl font-bold">{leaveSummary?.totalLeavesInFiscalYear || 0}</p>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg shadow">
                <h3 className="text-md font-medium">Total Leaves (Month)</h3>
                <p className="text-3xl font-bold">{leaveSummary?.totalLeavesInMonth || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
            Leave History
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
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
