import { useEffect, useState } from "react";

export default function useDebounce(
    value: string,
    time: number,
    onDebounce?: () => void,
) {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        const id = setTimeout(() => {
            onDebounce && onDebounce();
            setDebouncedValue(value);
        }, time);

        return () => {
            clearTimeout(id);
        };
    }, [value]);

    return debouncedValue;
}
