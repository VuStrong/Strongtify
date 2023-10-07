export class MapperService {
    public static mapBool(value) {
        switch (value) {
            case "true":
                return true;
            case "false":
                return false;
            case undefined:
                return undefined;
            default:
                return value;
        }
    }

    /**
     * convert value to array.
     * @param value - value to convert
     * @param convert - a callback function to convert each element in array to specific type
     */
    public static mapArray(
        value: any | any[],
        convert: (item: string) => any = (item) => item,
    ) {
        if (Array.isArray(value)) {
            return value.map((item) => convert(item));
        }

        // if value is single, convert to array
        if (value) {
            // split value into array if contain ','
            if (value.includes(","))
                return value.split(",").map((item) => convert(item.trim()));

            return [convert(value)];
        }

        if (value === null) {
            return null;
        }

        return undefined;
    }
}
