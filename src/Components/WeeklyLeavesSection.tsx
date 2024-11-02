import { parseISO, isSameWeek, format, startOfWeek, addDays, addWeeks } from 'date-fns';
import { useState } from 'react';

interface LeaveData {
    username: string;
    type: string;
    status: string;
    dates: string;
    notes: string;
}


export const ThisWeekLeaves: React.FC<{ leaveRequests: LeaveData[] }> = ({ leaveRequests }) => {
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const currentWeekStart = startOfWeek(addWeeks(new Date(), currentWeekOffset), { weekStartsOn: 1 });

    const getLeaveDaysForEmployee = (dates: string) => {
        const [startDate, endDate] = dates.split(' to ').map(date => parseISO(date));
        const leaveDays: { day: number, dateStr: string }[] = [];

        for (let day = 0; day <= 6; day++) {
            const currentDay = addDays(currentWeekStart, day);
            if (currentDay >= startDate && currentDay <= endDate && day >= 0 && day < 6) {
                leaveDays.push({
                    day,
                    dateStr: format(currentDay, 'dd MMM'),
                });
            }
        }
        return leaveDays;
    };

    const dayLeaveCount = Array(6).fill(0);

    const employeeLeaveData = leaveRequests.map(leave => {
        const leaveDays = getLeaveDaysForEmployee(leave.dates);
        leaveDays.forEach(day => {
            dayLeaveCount[day.day] += 1;
        });
        return { username: leave.username, leaveDays };
    });

    const handlePreviousWeek = () => setCurrentWeekOffset(currentWeekOffset - 1);
    const handleNextWeek = () => setCurrentWeekOffset(currentWeekOffset + 1);

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-400 pb-2">This Week's Leaves</h2>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    <button 
                        onClick={handlePreviousWeek} 
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded-full shadow hover:bg-blue-700 transition"
                    >
                        &larr; Previous Week
                    </button>
                    <span className="text-lg sm:text-xl font-semibold text-gray-700 text-center">
                        {`Week of ${format(currentWeekStart, 'dd MMM yyyy')}`}
                    </span>
                    <button 
                        onClick={handleNextWeek} 
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded-full shadow hover:bg-blue-700 transition"
                    >
                        Next Week &rarr;
                    </button>
                </div>
                <div className="overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="p-2 sm:p-3 border-b border-gray-200 text-gray-600 font-semibold">Employee</th>
                                {Array.from({ length: 6 }, (_, index) => (
                                    <th key={index} className="p-2 sm:p-3 border-b border-gray-200 text-center text-gray-600 font-semibold">
                                        <div>{format(addDays(currentWeekStart, index), 'EEE')}</div>
                                        <div className="text-xs text-gray-500">({format(addDays(currentWeekStart, index), 'dd MMM')})</div>
                                        <div className="text-xs text-blue-600">{dayLeaveCount[index]} on leave</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employeeLeaveData.map((employee, rowIndex) => (
                                <tr key={employee.username} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <td className="p-2 sm:p-3 border-b border-gray-200 font-semibold text-gray-700">{employee.username}</td>
                                    {Array.from({ length: 6 }, (_, dayIndex) => {
                                        const leaveDay = employee.leaveDays.find(ld => ld.day === dayIndex);
                                        return (
                                            <td key={dayIndex} className="p-2 sm:p-3 border-b border-gray-200 text-center">
                                                {leaveDay ? (
                                                    <span className="inline-block p-1 sm:p-2 rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                        {leaveDay.dateStr}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block p-1 sm:p-2 rounded-full text-gray-400">•</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
