
export interface EmployeeResponseModel {
    employeeId: number;
    firstName: string;
    lastName: string;
    profile: string;
    personalEmail: string;
    companyEmail: string;
    phone: number;
    shift: string;
    new: boolean;
    joinedDate: string;  
    gender: string;
    age: number;
    jobTitle: string;
    address: string;
    city: string;
    state: string;
    country: string;
}

export interface GetAllEmployeesResponse {
    status: string;              
    message: string;             
    employees: EmployeeResponseModel[]; 
}

export interface ErrorResponse {
    status: string;  
    message: string; 
}
