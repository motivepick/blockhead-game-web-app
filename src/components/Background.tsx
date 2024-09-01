import {FC, PropsWithChildren} from "react";

/**
 * This wrapper is needed to change the background.
 */
const Background: FC<PropsWithChildren> = ({children}) =>
    <div className="min-h-screen bg-white dark:bg-gray-800">
        {children}
    </div>

export default Background
