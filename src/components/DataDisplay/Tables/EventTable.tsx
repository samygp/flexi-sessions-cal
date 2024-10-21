import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import { useMemo } from 'react';
import { CalendarEvent } from '../../../shared/models/CalendarEvents';
import { readableDateTime } from '../../../shared/utils/dateHelpers';

interface IEventTableProps {
    rows: CalendarEvent[];
}

export default function EventTable({ rows }: IEventTableProps) {

    const columns: GridColDef<CalendarEvent>[] = useMemo(() => [
        { field: 'id', headerName: 'ID', hideable: true },
        { field: 'eventType', headerName: 'Type', width: 100 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'monkehId', headerName: 'Monkeh', flex: 1, valueGetter: ({ row: { monkehId } }) => monkehId },
        { field: 'date', headerName: 'Date', valueGetter: readableDateTime, width: 170 },
        {
            field: 'actions', type: 'actions', width: 80, getActions: ({ row: { id } }) => [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => console.log(id)}
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={() => console.log(id)}
                />,
            ]
        },
    ], []);
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}