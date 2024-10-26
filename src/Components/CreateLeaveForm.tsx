import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { createLeave } from '../LeaveServices/index'

interface LeaveData {
  type: "Annual Leave" | "Casual Leave" | "Sick Leave";
  status: "Pending" | "Approved" | "Rejected";
  dates: string;
  notes: string;
}


interface CreateLeaveFormProps {
  onLeaveCreate: (leave: LeaveData) => void;
  onClose: () => void;
}

const CreateLeaveForm: React.FC<CreateLeaveFormProps> = ({ onLeaveCreate, onClose }) => {
  const [leaveType, setLeaveType] = useState<"Annual Leave" | "Casual Leave" | "Sick Leave">('Annual Leave');
  const [notes, setNotes] = useState('');
  const [isSingleDay, setIsSingleDay] = useState(true);
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dates = isSingleDay
      ? format(dateRange.startDate, 'yyyy-MM-dd')
      : `${format(dateRange.startDate, 'yyyy-MM-dd')} to ${format(dateRange.endDate, 'yyyy-MM-dd')}`;

    const formData: LeaveData = {
      type: leaveType,
      status: 'Pending',
      dates,
      notes,
    };

    try {
      const data = await createLeave(formData); // Use the imported function
      console.log('Leave created successfully:', data);
      onLeaveCreate(formData); // Pass the new leave data to the parent component
      onClose(); // Close the form after submission
      resetForm(); // Reset the form fields

    } catch (error) {
      console.error('Error creating leave:', error);
      // Optionally display an error message to the user here
    }
  };

  const resetForm = () => {
    setLeaveType('Annual Leave');
    setNotes('');
    setIsSingleDay(true);
    setDateRange({ startDate: new Date(), endDate: new Date(), key: 'selection' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Apply for Leave</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Leave Type:</label>
            <select
              className="border rounded-lg w-full p-2 focus:outline-none focus:border-blue-500"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as "Annual Leave" | "Casual Leave" | "Sick Leave")}
              required
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Leave Duration:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  checked={isSingleDay}
                  onChange={() => setIsSingleDay(true)}
                />
                Single Day
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  checked={!isSingleDay}
                  onChange={() => setIsSingleDay(false)}
                />
                Multiple Days
              </label>
            </div>
            <DateRange
              ranges={[{
                ...dateRange,
                endDate: isSingleDay ? dateRange.startDate : dateRange.endDate,
              }]}
              onChange={(ranges) => {
                const { startDate, endDate } = ranges.selection;
                setDateRange({
                  ...dateRange,
                  startDate,
                  endDate: isSingleDay ? startDate : endDate,
                });
              }}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              direction="horizontal"
              editableDateInputs={true}
              rangeColors={['#3b82f6']}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Notes:</label>
            <textarea
              className="border rounded-lg w-full p-2 focus:outline-none focus:border-blue-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-sm text-gray-500">{200 - notes.length} characters left</p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeaveForm;
