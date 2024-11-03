import { ErrorResponse, GetAllEmployeesResponse } from "../types/Employee";

import apiClient from "./apiClient";

class EmployeeService {
    async getAllEmployees(): Promise<GetAllEmployeesResponse> {
        try {
            const response = await apiClient.get<GetAllEmployeesResponse>('/employee/get-all');
            return response.data;
        } catch (error) {
            const err = error as ErrorResponse;
            throw new Error(`Failed to fetch employees: ${err.message}`);
        }
    }
}

const employeeServiceInstance = new EmployeeService();
export default employeeServiceInstance;