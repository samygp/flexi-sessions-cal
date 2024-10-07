import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { readableDateTime } from '../../shared/utils/dateHelpers';
import { CalendarEvent } from '../../shared/models/CalendarEvents';

// const columns: GridColDef<(typeof rows)[number]>[] = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'firstName',
//     headerName: 'First name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'lastName',
//     headerName: 'Last name',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 110,
//     editable: true,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];


const columns: GridColDef<CalendarEvent>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date', width: 150, valueGetter: readableDateTime },
    { field: 'title', headerName: 'Title', },
    { field: 'eventType', headerName: 'Type', },
    { field: 'userEmail', headerName: 'Email', },
    { field: 'userName', headerName: 'Name', },
];

interface IEventTableProps {
    rows: CalendarEvent[];
}

export default function EventTable({rows}: IEventTableProps) {
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