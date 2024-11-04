import { AddLeaveRequest, LeaveRecord as LeaveData, LeaveRecord, LeaveStatus } from '../types/Leave';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { generateMonthlyLeaveData, generateWeeklyLeaveData } from '../Utils/LeaveTrendUtils';

import ChartContainer from './ChartBox';
import CreateLeaveForm from './CreateLeaveForm';
import { EmployeeResponseModel as Employee } from '../types/Employee';
import { MRT_ColumnDef } from 'material-react-table';
import StatCard from './StatCard';
import Table from './Table';
import { ThisWeekLeaves } from './WeeklyLeavesSection';
import employeeServiceInstance from '../Api/employeeService';
import leaveServiceInstance  from '../Api/leaveService';

interface AdminActivity {
    action: "Approved" | "Rejected";
    username: string;
    type: string;
    dates: string;
    timestamp: string;
}

const AdminLeavePage: React.FC = () => {
    const [employeeOptions, setEmployeeOptions] = useState<Employee[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRecord[]>([]);
    const [adminActivities, setAdminActivities] = useState<AdminActivity[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null); // Corrected type
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null); // Track selected employee ID
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<LeaveRecord[]|null >(); // Corrected type

    // Fetch all employees and set options for dropdown
    useEffect(() => {
        const fetchEmployees = async () => {
            const result = await employeeServiceInstance.getAllEmployees();
            if (result.status === 'success') {
                setEmployeeOptions(result.employees);
                setEmployeeData(result.employees);
            } else {
                console.error(result.message);
            }
        };
        fetchEmployees();
    }, []);

    // Wrap handleApprove in useCallback to prevent it from changing on every render
    const handleApprove = useCallback(async (index: number) => {
        const leave = leaveRequests[index];
        try {
            await leaveServiceInstance.updateLeaveStatus({
                leaveId: leave.leaveId,
                status: 'Approved' as LeaveStatus,
                approvedBy: 'Admin',
                adminId: 1 // Replace with actual admin ID if needed
            });
            // updateLeaveStatus(index, 'Approved');
        } catch (error) {
            console.error('Failed to approve leave:', error);
        }
    }, [leaveRequests]);

    // Wrap handleReject in useCallback to prevent it from changing on every render
    const handleReject = useCallback(async (index: number) => {
        const leave = leaveRequests[index];
        try {
            await leaveServiceInstance.updateLeaveStatus({
                leaveId: leave.leaveId,
                status: 'Rejected' as LeaveStatus,
                approvedBy: 'Admin',
                adminId: 1 // Replace with actual admin ID if needed
            });
            // updateLeaveStatus(index, 'Rejected');
        } catch (error) {
            console.error('Failed to reject leave:', error);
        }
    }, [leaveRequests]);

    const columnsRequests: MRT_ColumnDef<LeaveData>[] = useMemo(() => [
        { accessorKey: 'employeeId', header: 'Employee ID' },
        { accessorKey: 'leaveType', header: 'Leave Type' },
        { accessorKey: 'fromDate', header: 'From Date' },
        { accessorKey: 'toDate', header: 'To Date' },
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

    // Fetch the details of the selected employee
    useEffect(() => {
        if (selectedEmployeeId !== null) {
            const fetchEmployeeDetails = async () => {
                const result = await leaveServiceInstance.getLeavesByEmployeeId(selectedEmployeeId);
                if (result.status === 'success') {
                    setSelectedEmployeeDetails(result.leaves);
                } else {
                    console.error(result.message);
                }
            };
            fetchEmployeeDetails();
        }
    }, [selectedEmployeeId]);

    // Handle employee selection change
    const handleEmployeeSelect = (employeeName: string) => {
        const selectedEmployee = employeeOptions.find(
            (emp) => `${emp.firstName} ${emp.lastName}` === employeeName
        );
        if (selectedEmployee) {
            setSelectedEmployeeId(selectedEmployee.employeeId);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <HeaderSection showForm={showForm} setShowForm={setShowForm} />

                {showForm && (
                    <div className="mt-4">
                        <CreateLeaveForm
                            onLeaveCreate={(newLeave: AddLeaveRequest) => {
                                const leaveWithUsername = { ...newLeave, username: 'default_user' };
                                setLeaveRequests([...leaveRequests, leaveWithUsername]);
                            }}
                            onClose={() => setShowForm(false)}
                            isAdmin={true}
                            employeeList={employeeOptions}
                            // employeeList={employeeOptions.map((emp) => ({ id: emp.employeeId, name: `${emp.firstName} ${emp.lastName}` }))}
                        />
                    </div>
                )}

                <TableSection title="Leave Requests" data={leaveRequests} columns={columnsRequests} />
                <AdminActivitiesTable adminActivities={adminActivities} />
                <LeaveTrendsSection monthlyData={generateMonthlyLeaveData(selectedEmployeeDetails)} weeklyData={generateWeeklyLeaveData(selectedEmployeeDetails)} />
                <ThisWeekLeaves leaveRequests={leaveRequests} />

                <EmployeeInformationSection
                    selectedEmployee={selectedEmployeeId}
                    setSelectedEmployee={handleEmployeeSelect}
                    employeeData={selectedEmployeeDetails ?? []} // Corrected to avoid undefined
                    employeeOptions={employeeOptions.map(emp => `${emp.firstName} ${emp.lastName}`)}
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
const TableSection: React.FC<{ title: string; data: any; columns: MRT_ColumnDef<LeaveData>[]; }> = ({ title, data, columns }) => (
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
