import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { getMonthDate } from '@/shared/utils/dateHelpers';
import { IMonkeh } from '@/shared/models/Monkeh';
import { useMonkehContext } from '@/hooks/useCustomContext';
import { MonkehCell } from './CellRenders/MonkehCell';
import { useLocale } from '@/hooks/useLocale';
import { MonkehFieldLabels } from '@/shared/locale/monkeh';
import { styled } from '@mui/material';
import moment from 'moment';

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    '& .current-month': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    }
}));

const currMonth = moment().month();

export default function MonkehTable() {
    const {monkehMap, loading} = useMonkehContext();
    const monkehLabels = useLocale(MonkehFieldLabels);

    const columns: GridColDef<GridValidRowModel & IMonkeh>[] = useMemo(() => [
        { field: 'name', headerName: monkehLabels.name, flex: 1, renderCell: ({row}) => <MonkehCell {...row}/> },
        { field: 'birthday', headerName: monkehLabels.birthday, valueGetter: getMonthDate, width: 170 },
        { field: 'cake', headerName: monkehLabels.cake, flex: 2, },
    ], [monkehLabels]);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <StyledDataGrid
                rows={Object.values(monkehMap)}
                loading={loading}
                columns={columns as any}
                getRowClassName={({row}) => row.birthday.month() === currMonth ? 'current-month' : ''}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                    sorting: {
                        sortModel: [
                            {
                                field: 'birthday',
                                sort: 'asc',
                            },
                        ],
                    }
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}