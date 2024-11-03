import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import { useMemo } from 'react';
import { getMonthDate } from '@shared/utils/dateHelpers';
import { IMonkeh } from '@shared/models/Monkeh';

interface IMonkehTableProps {
    rows: IMonkeh[];
}

export default function MonkehTable({ rows }: IMonkehTableProps) {

    const columns: GridColDef<IMonkeh>[] = useMemo(() => [
        { field: 'id', headerName: 'ID', hideable: true },
        { field: 'level', headerName: 'R', width: 10, valueGetter: ({ row: { level } }) => `R${level}` },
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'birthday', headerName: 'Date', valueGetter: getMonthDate, width: 170 },
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