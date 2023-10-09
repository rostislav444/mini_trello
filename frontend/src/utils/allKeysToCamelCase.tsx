export const allKeysToCamelCase = (obj: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
        const newKey = key.replace(/([-_][a-z])/gi, ($1) => {
            return $1.toUpperCase().replace('_', '');
        });
        newObj[newKey] = obj[key];
    });
    return newObj;
}