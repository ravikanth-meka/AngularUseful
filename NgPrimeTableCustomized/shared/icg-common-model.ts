export class Data {
    constructor(public id: string, public label: string) { }
}

export class Element {
    constructor(public id: string, public label: string, public type: string, public defaultValue: any, public multiSelect = false) { }
}

export class Utils {
    public static objectToMap(object: Object): Map<string, any> {
        const map = new Map<string, any>();
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                map.set(key, object[key]);
            }
        }
        return map;
    }

    public static mapToObj(strMap: Map<string, any>): Object {
        const obj = Object.create(null);
        strMap.forEach((value: any, key: string) => {
            obj[key] = value;
        });
        return obj;
    }
}
