import {
    AddLeaveRequest,
    AddLeaveResponse,
    DeleteLeaveResponse,
    ErrorResponse,
    GetLeaveByIdResponse,
    GetLeaveTypesResponse,
    GetLeavesByEmployeeIdResponse,
    GetLeavesResponse,
    UpdateLeaveRequest,
    UpdateLeaveResponse,
    UpdateLeaveStatusRequest
} from '../types/Leave';

import apiClient from './apiClient';

class LeaveService {
    async getLeaveTypes(): Promise<GetLeaveTypesResponse> {
        try {
            const response = await apiClient.get<GetLeaveTypesResponse>('/leaves-type/get');
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to fetch leave types: ${err.message}`);
        }
    }


    async addLeave(requestBody: AddLeaveRequest): Promise<AddLeaveResponse> {
        try {
            const response = await apiClient.post<AddLeaveResponse>('/leaves/add', requestBody);
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to add leave: ${err.message}`);
        }
    }

    async updateLeave(requestBody: UpdateLeaveRequest): Promise<UpdateLeaveResponse> {
        try {
            const response = await apiClient.patch<UpdateLeaveResponse>('/leaves/update', requestBody);
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to update leave: ${err.message}`);
        }
    }


    async updateLeaveStatus(requestBody: UpdateLeaveStatusRequest): Promise<UpdateLeaveResponse> {
        try {
            const response = await apiClient.patch<UpdateLeaveResponse>('/leaves/update-leave-status', requestBody);
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to update leave status: ${err.message}`);
        }
    }


    async deleteLeave(leaveId: number): Promise<DeleteLeaveResponse> {
        try {
            const response = await apiClient.delete<DeleteLeaveResponse>(`/leaves/delete/${leaveId}`);
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to delete leave: ${err.message}`);
        }
    }


    async getAllLeaves(): Promise<GetLeavesResponse> {
        try {
            const response = await apiClient.get<GetLeavesResponse>('/leaves/get');
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to fetch all leaves: ${err.message}`);
        }
    }


    async getLeavesByEmployeeId(employeeId: number): Promise<GetLeavesByEmployeeIdResponse> {
        try {
            const response = await apiClient.get<GetLeavesByEmployeeIdResponse>(`/leaves/get/employee/${employeeId}`);
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to fetch leaves for employee ID ${employeeId}: ${err.message}`);
        }
    }


    async getLeaveById(leaveId: number): Promise<GetLeaveByIdResponse> {
        try {
            const response = await apiClient.get<GetLeaveByIdResponse>(`/leaves/get/leave/${leaveId}`);
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to fetch leave details for leave ID ${leaveId}: ${err.message}`);
        }
    }
}


const leaveServiceInstance = new LeaveService();
export default leaveServiceInstance;
