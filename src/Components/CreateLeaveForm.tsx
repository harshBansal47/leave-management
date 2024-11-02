import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { createLeave } from '../Services/index';

interface LeaveData {
  type: "Annual Leave" | "Casual Leave" | "Sick Leave";
  status: "Pending" | "Approved" | "Rejected";
  dates: string;
  notes: string;
  employeeId?: string;
}

interface Employee {
  id: string;
  name: string;
}

interface CreateLeaveFormProps {
  onLeaveCreate: (leave: LeaveData) => void;
  onClose: () => void;
  employeeList?: Employee[]; 
  isAdmin?: boolean; 
}

const CreateLeaveForm: React.FC<CreateLeaveFormProps> = ({ onLeaveCreate, onClose, employeeList, isAdmin }) => {
  const [employeeId, setEmployeeId] = useState(employeeList ? employeeList[0]?.id : '');
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
      employeeId: isAdmin ? employeeId : undefined,
    };

    try {
      await createLeave(formData);
      onLeaveCreate(formData);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating leave:', error);
    }
  };

  const resetForm = () => {
    setLeaveType('Annual Leave');
    setNotes('');
    setIsSingleDay(true);
    setDateRange({ startDate: new Date(), endDate: new Date(), key: 'selection' });
    if (isAdmin && employeeList) {
      setEmployeeId(employeeList[0]?.id || '');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isAdmin ? 'Apply Leave for Employee' : 'Apply for Leave'}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-6">

          {/* Conditionally show employee dropdown for admin */}
          {isAdmin && employeeList && (
            <div className="space-y-1">
              <label className="block text-gray-700 font-semibold">Select Employee</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              >
                {employeeList.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Leave Type */}
          <div className="space-y-1">
            <label className="block text-gray-700 font-semibold">Leave Type</label>
            <select
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as "Annual Leave" | "Casual Leave" | "Sick Leave")}
              required
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
            </select>
          </div>

          {/* Leave Duration */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Leave Duration</label>
            <div className="flex items-center space-x-6">
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
            <div className="mt-4">
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
                rangeColors={['#2563EB']}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-gray-700 font-semibold">Notes</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Add any relevant notes"
            />
            <p className="text-sm text-gray-500 text-right">{200 - notes.length} characters left</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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