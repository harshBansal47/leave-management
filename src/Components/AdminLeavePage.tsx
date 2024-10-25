import React, { useState, useMemo, useEffect } from 'react';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import Table from './Table';
import { MRT_ColumnDef } from 'material-react-table';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface LeaveData {
    username: string;
    type: string;
    status: string;
    dates: string;
    notes: string;
}

const AdminLeavePage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveData[]>([
        { username: 'john_doe', type: 'Sick Leave', status: 'Pending', dates: '2024-10-01 to 2024-10-03', notes: 'Fever' },
        { username: 'jane_doe', type: 'Casual Leave', status: 'Pending', dates: '2024-10-15', notes: 'Family Function' },
        { username: 'kevin_vandy', type: 'Annual Leave', status: 'Rejected', dates: '2024-09-20 to 2024-09-22', notes: 'Vacation' },
    ]);

    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState<LeaveData[]>([]);
    const [employeesOnLeaveToday, setEmployeesOnLeaveToday] = useState<LeaveData[]>([]);

    useEffect(() => {
        if (selectedEmployee) {
            const employeeLeaves = leaveRequests.filter((leave) => leave.username === selectedEmployee);
            setEmployeeData(employeeLeaves);
        } else {
            setEmployeeData([]);
        }
    }, [selectedEmployee, leaveRequests]);

    const handleApprove = (index: number) => {
        const updatedRequests = [...leaveRequests];
        updatedRequests[index].status = 'Approved';
        setLeaveRequests(updatedRequests);
    };

    const handleReject = (index: number) => {
        const updatedRequests = [...leaveRequests];
        updatedRequests[index].status = 'Rejected';
        setLeaveRequests(updatedRequests);
    };

    const columnsRequests = useMemo<MRT_ColumnDef<LeaveData>[]>(() => [
        {
            accessorKey: 'username',
            header: 'Username',
            cellStyle: { color: '#3b82f6' },
        },
        {
            accessorKey: 'type',
            header: 'Leave Type',
        },
        {
            accessorKey: 'dates',
            header: 'Dates',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ row }) => (
                <span
                    className={
                        row.original.status === 'Approved'
                            ? 'text-green-600 font-semibold'
                            : row.original.status === 'Rejected'
                                ? 'text-red-600 font-semibold'
                                : 'text-yellow-600 font-semibold'
                    }
                >
                    {row.original.status}
                </span>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <FaCheckCircle
                        className="text-green-500 cursor-pointer hover:text-green-700 transition duration-200"
                        onClick={() => handleApprove(row.index)}
                    />
                    <FaTimesCircle
                        className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200"
                        onClick={() => handleReject(row.index)}
                    />
                </div>
            ),
        },
    ], [handleApprove, handleReject]);

    const employeeOptions = Array.from(new Set(leaveRequests.map((leave) => leave.username)));

    const totalLeavesYear = useMemo(() => {
        return employeeData.filter((leave) => leave.status === 'Approved' && isSameYear(parseISO(leave.dates.split(' to ')[0]), new Date())).length;
    }, [employeeData]);

    const totalLeavesMonth = useMemo(() => {
        return employeeData.filter((leave) => leave.status === 'Approved' && isSameMonth(parseISO(leave.dates.split(' to ')[0]), new Date())).length;
    }, [employeeData]);

    const columnsEmployeeData = useMemo<MRT_ColumnDef<LeaveData>[]>(() => [
        {
            accessorKey: 'type',
            header: 'Leave Type',
        },
        {
            accessorKey: 'status',
            header: 'Status',
        },
        {
            accessorKey: 'dates',
            header: 'Dates',
        },
        {
            accessorKey: 'notes',
            header: 'Notes',
        },
    ], []);

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800   pb-2">
                    Admin Portal : Leave Management
                </h1>

                <div className="mb-6 mt-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
                        Leave Requests
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <Table<LeaveData> columns={columnsRequests} data={leaveRequests} />
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
                        Employees on Leave Today
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        {/* Implement a table or list showing the list of employees on leave today */}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
                        Employee Information
                    </h2>
                    <div className=" rounded-lg">
                        <select
                            className="border rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 bg-gray-50"
                            value={selectedEmployee || ''}
                            onChange={(e) => setSelectedEmployee(e.target.value || null)}
                        >
                            <option value="">Select an Employee</option>
                            {employeeOptions.map((username) => (
                                <option key={username} value={username}>
                                    {username}
                                </option>
                            ))}
                        </select>

                        {selectedEmployee && employeeData.length > 0 && (
                            <div className="mt-4 bg-white rounded-lg p-2 shadow-inner bg-gray-50">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
                                    Leave Details for {selectedEmployee}
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg ">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow">
                                            <h3 className="text-md font-medium">Total Leaves (Year)</h3>
                                            <p className="text-3xl font-bold">{totalLeavesYear}</p>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg shadow">
                                            <h3 className="text-md font-medium">Total Leaves (Month)</h3>
                                            <p className="text-3xl font-bold">{totalLeavesMonth}</p>
                                        </div>
                                    </div>
                                    <div className=" rounded-lg">
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
                                                <Table columns={columnsEmployeeData} data={employeeData} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLeavePage;
