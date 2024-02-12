/**
 * @hidden
 */
export const classNames = (...args: any[]): string | undefined => {
    const result: any = {};

    const addLeafKeys = (arg: any) => typeof arg === 'object' ? Object
        .keys(arg)
        .forEach(key => {
            result[key] = arg[key];
        }) : result[arg] = true;;

    const addKeys = (list: any) => list
        .filter((arg: any) => arg !== true && !!arg)
        .map((arg: any) =>
            Array.isArray(arg) ?
                addKeys(arg) :
                addLeafKeys(arg));

    addKeys(args);

    return Object
        .keys(result)
        .map((key) => (result[key] && key) || null)
        .filter(el => el !== null)
        .join(' ') || undefined;
};

export function combineClassNames(...classNames: (string | undefined)[]) {
    return classNames.filter(x => !!x).join(' ');
}
