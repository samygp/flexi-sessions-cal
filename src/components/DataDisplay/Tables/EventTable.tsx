import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef, GridComparatorFn, GridRenderCellParams } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { CalendarEvent } from '@shared/models/CalendarEvents';
import { readableDateTime } from '@shared/utils/dateHelpers';
import { useMonkehContext } from '@hooks/useCustomContext';
import MonkehTag from '@components/DataDisplay/Tags/MonkehTag';
import { getMonkehSortId } from '@shared/models/Monkeh';
import { EventTypeLabels } from '@shared/locale/events';

interface IEventTableProps {
    rows: CalendarEvent[];
}

export default function EventTable({ rows }: IEventTableProps) {
    const { monkehMap } = useMonkehContext();
    const getMonkehName = useCallback(({value: monkehId}: GridRenderCellParams<CalendarEvent, string>) => {
        const {level, name} = monkehMap[monkehId!];
        return (
            <div style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center'}}>
                <MonkehTag level={level} compact/>{name}
            </div>
        );
    }, [monkehMap]);

    const sortByMonkeh = useCallback<GridComparatorFn<string>>((id1, id2) => {
        const aMonkeh = getMonkehSortId(monkehMap[id1]);
        const bMonkeh = getMonkehSortId(monkehMap[id2]);
        return aMonkeh.localeCompare(bMonkeh);
    }, [monkehMap]);

    const columns: GridColDef<CalendarEvent>[] = useMemo(() => [
        // { field: 'id', headerName: 'ID', hideable: true },
        { field: 'eventType', headerName: 'Type', width: 100, valueFormatter: value => EventTypeLabels[value]},
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'monkehId', headerName: 'Monkeh', flex: 1, renderCell: getMonkehName, sortComparator: sortByMonkeh },
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
    ], [getMonkehName, sortByMonkeh]);
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