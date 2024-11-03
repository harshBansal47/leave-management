
export type LeaveType = "Annual Leave" | "Casual Leave" | "Sick Leave";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveTypeResponse {
    leaveTypeId: number;
    leaveType: LeaveType;
    description: string;
}

export interface GetLeaveTypesResponse {
    status: string;
    message: string;
    leaveTypes: LeaveTypeResponse[];
}

export interface AddLeaveRequest {
    leaveType: LeaveType;
    description: string;
    employeeId: number;
    fromDate: string; 
    toDate: string;   
    status: LeaveStatus;
    approvedBy?: string;
    adminId: number;
}

export interface AddLeaveResponse {
    status: string;
    message: string;
    leaveId: number;
}

export interface UpdateLeaveRequest {
    leaveId: number;
    leaveType?: LeaveType;
    description?: string;
    fromDate?: string;
    toDate?: string;
    status?: LeaveStatus;
    approvedBy?: string;
    adminId?: number;
}

export interface UpdateLeaveStatusRequest {
    leaveId: number;
    status: LeaveStatus;
    approvedBy: string;
    adminId: number;
}


export interface UpdateLeaveResponse {
    status: string;
    message: string;
    leaveId: number;
}


export interface DeleteLeaveResponse {
    status: string;
    message: string;
    leaveId: number;
}


export interface LeaveRecord {
    leaveId: number;
    leaveType: LeaveType;
    description: string;
    employeeId: number;
    fromDate: string;  
    toDate: string;    
    status: LeaveStatus;
    approvedBy?: string;
    adminId: number;
}


export interface GetLeavesResponse {
    status: string;
    message: string;
    leaves: LeaveRecord[];
}


export interface GetLeavesByEmployeeIdResponse {
    status: string;
    message: string;
    leaves: LeaveRecord[];
}


export interface GetLeaveByIdResponse {
    status: string;
    message: string;
    leave: LeaveRecord;
}


export interface ErrorResponse {
    status: string;
    message: string;
}


// export interface AddSalarySlipRequest {
//     employeeId: number;
//     month: string;
//     year: number;
//     amount: number;
// }


// export interface AddSalarySlipResponse {
//     status: string;
//     message: string;
//     slipId: number;
// }
