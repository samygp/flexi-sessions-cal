
export enum PathName {
    calendar = 'calendar',
    app = 'app',
    monkeh = 'monkeh',
    eventRules = 'event-rules',
    login = 'login',
    birthdays = 'birthdays'
};

// Relates a path with a parent path
export const PathTrace: Record<PathName, PathName | ''> = {
    [PathName.calendar]: PathName.app,
    [PathName.app]: '',
    [PathName.monkeh]: PathName.app,
    [PathName.birthdays]: PathName.monkeh,
    [PathName.login]: '',
    [PathName.eventRules]: PathName.app
} as const;

const getPathParent = (path: PathName) => {
    return PathTrace[path];
};

export const getPath = (path: PathName, relativeTo?: PathName) => {
    const tracedPath: PathName[] = [];
    let p: PathName | '' = path;
    while (p && p !== relativeTo) {
        tracedPath.unshift(p);
        p = getPathParent(p);
    }
    return `/${tracedPath.join('/')}`;
}