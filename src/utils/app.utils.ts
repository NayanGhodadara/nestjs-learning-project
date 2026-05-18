import { randomBytes } from "crypto";
import moment from "moment";

export const generateUniqueId = (prefix: string) => {
    return `${prefix}${randomBytes(4).toString('hex')}${moment().unix()}`;
};

export const dateToTimestamp = (date: Date | number) => {
    if (!date) return null;
    return moment.utc(date).valueOf();
};

const ignoredKeys = [
    'id',
    'uid',
    'pid',
    'cid',
    'aid',
    'did',
    'chatId',
    'oid',
    'pmid',
    'rid',
    'token',
    'email',
    'password'
];
export const convertToUppercase = (data: any, key?: string): any => {
    if (key && ignoredKeys.includes(key)) {
        return data;
    }

    if (typeof data === 'string') {
        return data.toUpperCase();
    }

    if (Array.isArray(data)) {
        return data.map(item =>
            convertToUppercase(item)
        );
    }

    if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach(key => {
            data[key] = convertToUppercase(data[key], key);
        });

    }

    return data;
}