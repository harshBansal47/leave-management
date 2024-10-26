import axios from 'axios';

interface LeaveType {
  type: "Annual Leave" | "Casual Leave" | "Sick Leave";
  status: "Pending" | "Approved" | "Rejected";
  dates: string; 
  notes: string;
}

interface EmployeeLeaveSummary {
  totalLeavesInMonth: number;
  totalLeavesInFiscalYear: number;
  allLeaves: LeaveType[];
  latestLeave: LeaveType | null;
}


const fetchLeaveData = async (emp_id: string): Promise<EmployeeLeaveSummary | null> => {
  try {
    // Get today's date
    const currentDate = new Date();

    // Calculate the date 12 months ago for fetching
    const pastYearDate = new Date();
    pastYearDate.setFullYear(currentDate.getFullYear() - 1);

    // Format dates for the last year
    const currentDateString = currentDate.toISOString().split('T')[0];
    const pastYearDateString = pastYearDate.toISOString().split('T')[0];

    // API request to fetch the data for the past year
    const response = await axios.get<LeaveType[]>(`/api/leaves`, {
      params: {
        emp_id,
        startDate: pastYearDateString,
        endDate: currentDateString
      }
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const allLeaves = response.data;

      // Calculate total leaves for the current month
      const totalLeavesInMonth = allLeaves.filter(leave => {
        const leaveDate = new Date(leave.dates);
        return (
          leaveDate.getFullYear() === currentDate.getFullYear() &&
          leaveDate.getMonth() === currentDate.getMonth()
        );
      }).length;

      // Calculate total leaves in the fiscal year
      let fiscalYearStart: Date;
      let fiscalYearEnd: Date;

      if (currentDate.getMonth() >= 3) { // If current month is April (3) or later
        // Fiscal year is from April to current month of the same year
        fiscalYearStart = new Date(currentDate.getFullYear(), 3, 1); // April 1 of the current year
        fiscalYearEnd = currentDate; // Current date
      } else {
        // Fiscal year is from April of the previous year to March of the current year
        fiscalYearStart = new Date(currentDate.getFullYear() - 1, 3, 1); // April 1 of last year
        fiscalYearEnd = new Date(currentDate.getFullYear(), 2, 31); // March 31 of this year
      }

      const totalLeavesInFiscalYear = allLeaves.filter(leave => {
        const leaveDate = new Date(leave.dates);
        return leaveDate >= fiscalYearStart && leaveDate <= fiscalYearEnd;
      }).length;

      // Get the latest leave (most recent date)
      const latestLeave = allLeaves.reduce((latest, leave) => {
        return new Date(leave.dates) > new Date(latest.dates) ? leave : latest;
      }, allLeaves[0]);

      // Construct the EmployeeLeaveSummary object
      const employeeSummary: EmployeeLeaveSummary = {
        totalLeavesInMonth,
        totalLeavesInFiscalYear,
        allLeaves,
        latestLeave
      };

      return employeeSummary;
    } else {
      console.error('No valid leave data found or data is empty');
      return null;
    }
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    return null;
  }
};


 const createLeave = async (leaveData: LeaveType): Promise<any> => {
    const response = await fetch('/api/leaves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leaveData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create leave');
    }
  
    return await response.json(); 
  };


  export{
    createLeave,
    fetchLeaveData,
  }