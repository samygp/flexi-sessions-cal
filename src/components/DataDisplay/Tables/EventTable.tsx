import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef, GridComparatorFn, GridRenderCellParams } from '@mui/x-data-grid';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { CalendarEvent, EventType } from '@/shared/models/CalendarEvents';
import { readableDateTime } from '@/shared/utils/dateHelpers';
import { useMonkehContext } from '@/hooks/useCustomContext';
import MonkehTag from '@/components/DataDisplay/Tags/MonkehTag';
import { getMonkehSortId } from '@/shared/models/Monkeh';
import { CalendarEventFieldLabels, EventTypeLabels } from '@/shared/locale/events';
import { useLocale } from '@/hooks/useLocale';
import useEventRules from '@/hooks/useEventRules';
import { EventRuleOrder } from '@/shared/models/EventRules';
import { SvgIcon } from '@mui/material';

interface IEventTableProps {
    rows: CalendarEvent[];
}

interface IEventRuleActionCellProps {
    ButtonIcon: typeof SvgIcon;
    order: EventRuleOrder;
    onClick: (id: string) => void;
    id: string;
}
function EventRuleActionCell({ButtonIcon, order, onClick, id}: IEventRuleActionCellProps) {
    return <GridActionsCellItem icon={<ButtonIcon color='success'/>} label={order} onClick={() => onClick(id)}/>;
}

export default function EventTable({ rows }: IEventTableProps) {
    const { monkehMap } = useMonkehContext();
    const rules = useEventRules();
    const fieldLabels = useLocale<keyof CalendarEvent>(CalendarEventFieldLabels);
    const eventTypeLabels = useLocale<EventType>(EventTypeLabels);
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
        { field: 'eventType', headerName: fieldLabels.eventType, flex: 1, valueFormatter: value => eventTypeLabels[value]},
        { field: 'title', headerName: fieldLabels.title, flex: 2 },
        { field: 'monkehId', headerName: fieldLabels.monkehId, flex: 1, renderCell: getMonkehName, sortComparator: sortByMonkeh },
        { field: 'date', headerName: fieldLabels.date, valueGetter: readableDateTime, width: 170 },
        {
            field: 'actions', type: 'actions', width: 100, getActions: ({ row: { id } }) => [
                <EventRuleActionCell ButtonIcon={ArrowUpward} order="prev" id={id} onClick={rules.pullEventEarlierCheck}/>,
                <EventRuleActionCell ButtonIcon={ArrowDownward} order="next" id={id} onClick={rules.pushEventLaterCheck}/>,
            ]
        },
    ], [getMonkehName, sortByMonkeh, eventTypeLabels, fieldLabels, rules]);
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
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}