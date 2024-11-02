import React, { useState, useMemo, Dispatch, SetStateAction } from 'react';

import StatCard from './StatCard';
import Table from './Table';
import { MRT_ColumnDef } from 'material-react-table';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import CreateLeaveForm from './CreateLeaveForm';
import { Line } from 'react-chartjs-2';
import ChartContainer from './ChartBox';
import { ThisWeekLeaves } from './WeeklyLeavesSection';




interface LeaveData {
    username: string;
    type: string;
    status: string;
    dates: string;
    notes: string;
}

interface AdminActivity {
    action: "Approved" | "Rejected";
    username: string;
    type: string;
    dates: string;
    timestamp: string; // When the action was taken
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminLeavePage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveData[]>([
        { username: 'john_doe', type: 'Sick Leave', status: 'Pending', dates: '2024-10-01 to 2024-10-03', notes: 'Fever' },
        { username: 'jane_doe', type: 'Casual Leave', status: 'Pending', dates: '2024-10-15', notes: 'Family Function' },
        { username: 'kevin_vandy', type: 'Annual Leave', status: 'Rejected', dates: '2024-09-20 to 2024-09-22', notes: 'Vacation' },
    ]);

    const [adminActivities, setAdminActivities] = useState<AdminActivity[]>([
        { action: 'Approved', username: 'john_doe', type: 'Sick Leave', dates: '2024-10-01 to 2024-10-03', timestamp: '2024-10-01 09:45' },
        { action: 'Rejected', username: 'jane_doe', type: 'Casual Leave', dates: '2024-10-15', timestamp: '2024-10-14 14:00' },
        { action: 'Approved', username: 'kevin_vandy', type: 'Annual Leave', dates: '2024-09-20 to 2024-09-22', timestamp: '2024-09-19 16:30' },
    ]);

    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState<LeaveData[]>(leaveRequests);
    const employeeOptions = Array.from(new Set(leaveRequests.map((leave) => leave.username)));

    const handleApprove = async (index: number) => {
        const leave = leaveRequests[index];
        try {
            await LeaveService.updateLeaveStatus(leave.id, 'Approved');
            updateLeaveStatus(index, 'Approved');
        } catch (error) {
            console.error('Failed to approve leave:', error);
            // Optionally show a notification to the user
        }
    };

    const handleReject = async (index: number) => {
        const leave = leaveRequests[index];
        try {
            await LeaveService.updateLeaveStatus(leave.id, 'Rejected');
            updateLeaveStatus(index, 'Rejected');
        } catch (error) {
            console.error('Failed to reject leave:', error);
            // Optionally show a notification to the user
        }
    };

    const logAdminActivity = (action: "Approved" | "Rejected", leaveData: LeaveData) => {
        const activity: AdminActivity = {
            action,
            username: leaveData.username,
            type: leaveData.type,
            dates: leaveData.dates,
            timestamp: new Date().toLocaleString(),
        };
        setAdminActivities((prevActivities) => [activity, ...prevActivities]);
    };

    const monthlyLeaveData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Monthly Leave Requests',
                data: [5, 10, 8, 12, 6, 15, 9, 7, 11, 14, 8, 13],
                borderColor: '#007acc',
                backgroundColor: 'rgba(0, 122, 204, 0.2)',
                fill: true,
            },
        ],
    };

    const weeklyLeaveData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Weekly Leave Requests',
                data: [3, 7, 5, 9],
                borderColor: '#c0392b',
                backgroundColor: 'rgba(192, 57, 43, 0.2)',
                fill: true,
            },
        ],
    };

    const columnsRequests: MRT_ColumnDef<LeaveData>[] = useMemo(() => [
        { accessorKey: 'username', header: 'Username' },
        { accessorKey: 'type', header: 'Leave Type' },
        { accessorKey: 'dates', header: 'Dates' },
        {
            accessorKey: 'status', header: 'Status',
            Cell: ({ row }) => (
                <span className={
                    row.original.status === 'Approved' ? 'text-green-600 font-semibold' :
                        row.original.status === 'Rejected' ? 'text-red-600 font-semibold' :
                            'text-yellow-600 font-semibold'
                }>
                    {row.original.status}
                </span>
            )
        },
        {
            accessorKey: 'actions', header: 'Actions',
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <FaCheckCircle className="text-green-500 cursor-pointer hover:text-green-700"
                        onClick={() => handleApprove(row.index)} />
                    <FaTimesCircle className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleReject(row.index)} />
                </div>
            )
        },
    ], [handleApprove, handleReject]);

    return (
        <div className="bg-gray-50 min-h-screen p-6 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <HeaderSection showForm={showForm} setShowForm={setShowForm} />

                {showForm && (
                    <div className="mt-4">
                        <CreateLeaveForm
                            onLeaveCreate={(newLeave: Omit<LeaveData, 'username'>) => setLeaveRequests([...leaveRequests, { ...newLeave, username: 'default_user' }])}
                            onClose={() => setShowForm(false)}
                            isAdmin={true}
                            employeeList={[{ id: 'name', "name": "name" }]}
                        />
                    </div>
                )}

                <TableSection title="Leave Requests" data={leaveRequests} columns={columnsRequests} />

                <AdminActivitiesTable adminActivities={adminActivities} />
                <LeaveTrendsSection monthlyData={monthlyLeaveData} weeklyData={weeklyLeaveData} />
                <ThisWeekLeaves leaveRequests={leaveRequests} />

                <EmployeeInformationSection
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    employeeData={employeeData}
                    employeeOptions={employeeOptions}
                    totalLeavesYear={employeeData.length}
                    totalLeavesMonth={employeeData.length}
                    columnsEmployeeData={columnsRequests}
                />
            </div>
        </div>
    );
};

export default AdminLeavePage;

// Header Section
const HeaderSection: React.FC<{ showForm: boolean; setShowForm: Dispatch<SetStateAction<boolean>>; }> = ({ showForm, setShowForm }) => (
    <div className='mb-6 flex justify-between items-center'>
        <h1 className="text-2xl font-bold text-gray-800">Admin Portal: Leave Management</h1>
        <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => setShowForm(!showForm)}
        >
            {showForm ? 'Close Form' : 'Create Leave'}
        </button>
    </div>
);

// Table Section
const TableSection: React.FC<{ title: string; data: LeaveData[]; columns: MRT_ColumnDef<LeaveData>[]; }> = ({ title, data, columns }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">{title}</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <Table columns={columns} data={data} />
        </div>
    </div>
);

// Admin Activities Table
const AdminActivitiesTable: React.FC<{ adminActivities: AdminActivity[]; }> = ({ adminActivities }) => {
    const columnsAdminActivities: MRT_ColumnDef<AdminActivity>[] = useMemo(() => [
        { accessorKey: 'action', header: 'Action Taken' },
        { accessorKey: 'username', header: 'Username' },
        { accessorKey: 'type', header: 'Leave Type' },
        { accessorKey: 'dates', header: 'Dates' },
        { accessorKey: 'timestamp', header: 'Timestamp' },
    ], []);

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">Admin Activities</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <Table columns={columnsAdminActivities} data={adminActivities} />
            </div>
        </div>
    );
};

// Leave Trends Section
const LeaveTrendsSection: React.FC<{ monthlyData: any; weeklyData: any; }> = ({ monthlyData, weeklyData }) => (

    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">Leave Trends</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-between">
            <ChartContainer title="Monthly Leave Requests" data={monthlyData} />
            <ChartContainer title="Weekly Leave Requests" data={weeklyData} />
        </div>
    </div>
);


// Employee Information Section
const EmployeeInformationSection: React.FC<{
    selectedEmployee: string | null;
    setSelectedEmployee: Dispatch<SetStateAction<string | null>>;
    employeeData: LeaveData[];
    employeeOptions: string[];
    totalLeavesYear: number;
    totalLeavesMonth: number;
    columnsEmployeeData: MRT_ColumnDef<LeaveData>[];
}> = ({
    selectedEmployee,
    setSelectedEmployee,
    employeeData,
    employeeOptions,
    totalLeavesYear,
    totalLeavesMonth,
    columnsEmployeeData
}) => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">Employee Information</h2>
            <select
                className="border rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 bg-gray-50"
                value={selectedEmployee || ''}
                onChange={(e) => setSelectedEmployee(e.target.value || null)}
            >
                <option value="">Select an Employee</option>
                {employeeOptions.map((username) => (
                    <option key={username} value={username}>{username}</option>
                ))}
            </select>

            {selectedEmployee && employeeData.length > 0 && (
                <div className="mt-4 bg-white rounded-lg p-4 shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Details for {selectedEmployee}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <StatCard label="Total Leaves (Year)" value={totalLeavesYear} bgClass="bg-blue-600" />
                        <StatCard label="Total Leaves (Month)" value={totalLeavesMonth} bgClass="bg-green-600" />
                    </div>
                    <Table columns={columnsEmployeeData} data={employeeData} />
                </div>
            )}
        </div>
    );
