// src/react-date-range.d.ts
declare module 'react-date-range' {
    import { Component } from 'react';
  
    export interface Range {
      startDate: Date;
      endDate: Date;
      key: string;
    }
  
    export interface DateRangeProps {
      ranges: Range[];
      onChange: (ranges: { selection: Range }) => void;
      showSelectionPreview?: boolean;
      moveRangeOnFirstSelection?: boolean;
      months?: number;
      direction?: 'vertical' | 'horizontal';
      minDate?: Date;
      maxDate?: Date;
      editableDateInputs?: boolean;
      rangeColors?: string[];
    }
  
    export class DateRange extends Component<DateRangeProps> {}
    export class DateRangePicker extends Component<DateRangeProps> {}
  }
  