import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef, GridComparatorFn, GridRenderCellParams, GridRowParams, GridSortingInitialState } from '@mui/x-data-grid';
import { ArrowRight, EditCalendar, Edit, DeleteForeverOutlined } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import { CalendarEvent, EventType } from '@/shared/models/CalendarEvents';
import { readableDateTime } from '@/shared/utils/dateHelpers';
import { useDataContext } from '@/hooks/useCustomContext';
import MonkehTag from '@/components/DataDisplay/Tags/MonkehTag';
import { getMonkehSortId } from '@/shared/models/Monkeh';
import { CalendarEventFieldLabels, EventTypeLabels } from '@/shared/locale/events';
import { useLocale } from '@/hooks/useLocale';
import useEventRules from '@/hooks/useEventRules';
import { EventRuleOrder, IConflictingEventsResult } from '@/shared/models/EventRules';
import { styled, SvgIcon } from '@mui/material';
import EventActionsConfirmModal, { IEventActionsConfirmModalProps } from '@/components/Layout/Modals/EventActionsModal';

interface IEventTableProps {
    rows: CalendarEvent[];
}

type SupportedListAction = 'reschedule' | 'update' | 'delete';

interface IEventRuleActionCellProps {
    ButtonIcon: typeof SvgIcon;
    action: SupportedListAction;
    onClick: () => void;
}

const MonkehCell = styled('div')(() => ({ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }));

const defaultGridProps = {
    initialState: {
        pagination: {
            paginationModel: { pageSize: 10 },
        },
        sorting: {
            sortModel: [{ field: 'date', sort: 'asc', }],
        } as GridSortingInitialState,
    },
    pageSizeOptions: [5, 10],
    disableRowSelectionOnClick: true,
} as const;

function EventRuleActionCell({ ButtonIcon, action, onClick }: IEventRuleActionCellProps) {
    const color = action === 'delete' ? 'error' : 'primary';
    return <GridActionsCellItem icon={<ButtonIcon color={color} />} label={action} onClick={onClick} />;
}

const supportedActionsIcons: Record<SupportedListAction, typeof SvgIcon> = Object.freeze({
    reschedule: EditCalendar,
    update: Edit,
    delete: DeleteForeverOutlined,
});

export default function EventTable({ rows }: IEventTableProps) {
    const { monkehMap, loading } = useDataContext();
    const [actionModalProps, setActionModalProps] = useState<IEventActionsConfirmModalProps>();


    const fieldLabels = useLocale<keyof CalendarEvent>(CalendarEventFieldLabels);
    const eventTypeLabels = useLocale<EventType>(EventTypeLabels);

    const getMonkehName = useCallback(({ value: monkehId }: GridRenderCellParams<CalendarEvent, string>) => {
        const { level, name } = monkehMap[monkehId!];
        return <MonkehCell> <MonkehTag level={level} compact /> {name} </MonkehCell>;
    }, [monkehMap]);

    const sortByMonkeh = useCallback<GridComparatorFn<string>>((id1, id2) => {
        const aMonkeh = getMonkehSortId(monkehMap[id1]);
        const bMonkeh = getMonkehSortId(monkehMap[id2]);
        return aMonkeh.localeCompare(bMonkeh);
    }, [monkehMap]);


    const getActions = useCallback(({ row: { id: targetEventId } }: GridRowParams<CalendarEvent>) => {
        const onClose = () => setActionModalProps(undefined);
        return Object.entries(supportedActionsIcons).map(([key, Icon]) => {
            const action = key as SupportedListAction;
            const onClick = () => setActionModalProps({targetEventId,action,onClose});
            return <EventRuleActionCell ButtonIcon={Icon} action={action} onClick={onClick} />;
        });
    }, [setActionModalProps]);

    const columns: GridColDef<CalendarEvent>[] = useMemo(() => [
        { field: 'title', headerName: fieldLabels.title, flex: 2 },
        { field: 'eventType', headerName: fieldLabels.eventType, flex: 1, valueFormatter: value => eventTypeLabels[value] },
        { field: 'monkehId', headerName: fieldLabels.monkehId, flex: 1, renderCell: getMonkehName, sortComparator: sortByMonkeh },
        { field: 'date', headerName: fieldLabels.date, valueGetter: readableDateTime, width: 190 },
        { field: 'actions', type: 'actions', width: 140, getActions },
    ], [eventTypeLabels, fieldLabels, getMonkehName, sortByMonkeh, getActions]);


    return (
        <Box sx={{ height: 400, width: '100%' }}>
            {!!actionModalProps && <EventActionsConfirmModal {...actionModalProps}/>}
            <DataGrid {...{ loading, rows, columns, ...defaultGridProps }} />
        </Box>
    );
}