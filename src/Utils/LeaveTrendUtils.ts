// src/utils/leaveTrendsUtils.ts

import { AddLeaveRequest, AddLeaveResponse, GetLeavesByEmployeeIdResponse, LeaveRecord } from '../types/Leave';
import { format, getMonth, getWeekOfMonth } from 'date-fns';

// Generate monthly data for leave requests
export function generateMonthlyLeaveData(leaves: LeaveRecord[]) {
    const monthlyCounts = Array(12).fill(0); // Initialize counts for each month (Jan to Dec)

    leaves.forEach(leave => {
        const month = getMonth(new Date(leave.fromDate)); // Get month as an index (0 = Jan, 11 = Dec)
        monthlyCounts[month] += 1;
    });

    return {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Monthly Leave Requests',
                data: monthlyCounts,
                borderColor: '#007acc',
                backgroundColor: 'rgba(0, 122, 204, 0.2)',
                fill: true,
            },
        ],
    };
}

// Generate weekly data for leave requests
export function generateWeeklyLeaveData(leaves: LeaveRecord[]) {
    const weeklyCounts = Array(4).fill(0); // Initialize counts for each week (assuming 4 weeks in a month)

    leaves.forEach(leave => {
        const week = getWeekOfMonth(new Date(leave.fromDate)) - 1; // Get week index (0 = Week 1, 3 = Week 4)
        if (week >= 0 && week < 4) { // Ensure valid week index
            weeklyCounts[week] += 1;
        }
    });

    return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Weekly Leave Requests',
                data: weeklyCounts,
                borderColor: '#c0392b',
                backgroundColor: 'rgba(192, 57, 43, 0.2)',
                fill: true,
            },
        ],
    };
}

export {}