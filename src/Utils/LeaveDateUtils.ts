// src/utils/leaveDateUtils.ts

import { differenceInDays, parseISO } from 'date-fns';

/**
 * Calculates the number of leave days between fromDate and toDate.
 * Includes both fromDate and toDate in the calculation.
 *
 * @param fromDate - The start date of the leave (string in YYYY-MM-DD format)
 * @param toDate - The end date of the leave (string in YYYY-MM-DD format)
 * @returns The number of days of leave, including the start and end dates
 */
export function calculateLeaveDays(fromDate: string, toDate: string): number {
    const start = parseISO(fromDate);
    const end = parseISO(toDate);

    // Adding 1 to include the end date in the calculation
    return differenceInDays(end, start) + 1;
}
