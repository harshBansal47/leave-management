import React, { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

interface TableProps<T extends object> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
}

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useMaterialReactTable({
    columns: memoizedColumns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default Table;