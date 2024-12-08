import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef, GridComparatorFn, GridRenderCellParams, GridRowParams, GridSortingInitialState } from '@mui/x-data-grid';
import { EditCalendar, Edit, DeleteForeverOutlined } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import { CalendarEvent, EventType } from '@/shared/models/CalendarEvents';
import { readableDateTime } from '@/shared/utils/dateHelpers';
import { useDataContext } from '@/hooks/useCustomContext';
import { getMonkehSortId } from '@/shared/models/Monkeh';
import { CalendarEventFieldLabels, EventTypeLabels } from '@/shared/locale/events';
import { useLocale } from '@/hooks/useLocale';
import { SvgIcon } from '@mui/material';
import EventActionsConfirmModal, { IEventActionsConfirmModalProps } from '@/components/Layout/Modals/EventActionsModal';
import { MonkehCell } from '@/components/DataDisplay/Tables/CellRenders/MonkehCell';

interface IEventTableProps {
    rows: CalendarEvent[];
}

type SupportedListAction = 'reschedule' | 'update' | 'delete';

interface IActionCellProps {
    ButtonIcon: typeof SvgIcon;
    action: SupportedListAction;
    onClick: () => void;
}

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

function ActionCell({ ButtonIcon, action, onClick }: IActionCellProps) {
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

    const clearActionModalProps = useCallback(() => setActionModalProps(undefined), [setActionModalProps]);

    const fieldLabels = useLocale<keyof CalendarEvent>(CalendarEventFieldLabels);
    const eventTypeLabels = useLocale<EventType>(EventTypeLabels);

    const MonkehInfoCell = useCallback(({ value: monkehIds }: GridRenderCellParams<CalendarEvent, string[]>) => {
        return (<Box display={"flex"}>
            {(monkehIds ?? []).map(monkehId => <MonkehCell key={monkehId} {...monkehMap[monkehId!]} />)}
        </Box>);
    }, [monkehMap]);

    const EventTitleCell = useCallback(({ row }: GridRenderCellParams<CalendarEvent, string>) => {
        const { title, id: targetEventId } = row;
        const action = 'update';
        const ButtonIcon = supportedActionsIcons[action];
        const onClick = () => setActionModalProps({ targetEventId, action, onClose: clearActionModalProps });
        return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ActionCell {...{ButtonIcon,action}} onClick={onClick} />
            {title}
        </Box>;
    }, [setActionModalProps, clearActionModalProps]);

    const sortByMonkeh = useCallback<GridComparatorFn<string>>((id1, id2) => {
        const aMonkeh = getMonkehSortId(monkehMap[id1]);
        const bMonkeh = getMonkehSortId(monkehMap[id2]);
        return aMonkeh.localeCompare(bMonkeh);
    }, [monkehMap]);


    const getActions = useCallback(({ row: { id: targetEventId } }: GridRowParams<CalendarEvent>) => {
        const actions: SupportedListAction[] = ['reschedule', 'delete'];
        return actions.map(action => {
            const onClick = () => setActionModalProps({ targetEventId, action, onClose: clearActionModalProps });
            const Icon = supportedActionsIcons[action];
            return <ActionCell ButtonIcon={Icon} action={action} onClick={onClick} />;
        });
    }, [setActionModalProps, clearActionModalProps]);

    const columns: GridColDef<CalendarEvent>[] = useMemo(() => [
        { field: 'title', headerName: fieldLabels.title, flex: 1, renderCell: EventTitleCell },
        { field: 'eventType', headerName: fieldLabels.eventType, flex: 0.5, valueFormatter: value => eventTypeLabels[value] },
        { field: 'monkehIds', headerName: fieldLabels.monkehIds, flex: 1, renderCell: MonkehInfoCell, sortComparator: sortByMonkeh },
        { field: 'date', headerName: fieldLabels.date, valueGetter: readableDateTime, width: 190 },
        { field: 'actions', type: 'actions', width: 140, getActions },
    ], [eventTypeLabels, fieldLabels, MonkehInfoCell, sortByMonkeh, getActions, EventTitleCell]);


    return (
        <Box sx={{ height: 400, width: '100%' }}>
            {!!actionModalProps && <EventActionsConfirmModal {...actionModalProps} />}
            <DataGrid {...{ loading, rows, columns, ...defaultGridProps }} />
        </Box>
    );
}