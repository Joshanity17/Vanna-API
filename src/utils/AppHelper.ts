

export class AppHelper {

    public static addQuotes(data: string, addComma?: boolean): string {
        data = '\'' + data + '\'';
        return (addComma) ? data + ', ' : data;
    }

    public static clone(obj: any): any {
        let copy: any;
        if (null == obj || 'object' !== typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) { copy[attr] = this.clone(obj[attr]); }
            }
            return copy;
        }

        throw new Error('Unable to copy object! Its type isn\'t supported.');
    }
}