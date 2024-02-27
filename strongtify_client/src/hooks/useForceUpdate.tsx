"use client"

import { useCallback, useState } from "react";

const useForceUpdate = () => {
    const [, setState] = useState(true)
    const forceUpdate = useCallback(() => {
        setState(s => !s)
    }, [])
  
    return forceUpdate;
}

export default useForceUpdate;