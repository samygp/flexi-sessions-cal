import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { readableDateTime } from '../../shared/utils/dateHelpers';
import { CalendarEvent } from '../../shared/models/CalendarEvents';
import { Delete, Edit } from '@mui/icons-material';

const columns: GridColDef<CalendarEvent>[] = [
    { field: 'id', headerName: 'ID', hideable: true },
    { field: 'eventType', headerName: 'Type', width: 100 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'userEmail', headerName: 'Email', flex: 1 },
    { field: 'userName', headerName: 'Assigned to', flex: 1 },
    { field: 'date', headerName: 'Date', valueGetter: readableDateTime, width: 170 },
    {
        field: 'actions', type: 'actions', width: 80, getActions: ({row: { id }}) => [
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
];

interface IEventTableProps {
    rows: CalendarEvent[];
}

export default function EventTable({ rows }: IEventTableProps) {
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