import type { FC, PropsWithChildren } from 'react'

/**
 * This wrapper is needed to change the background.
 */
const Background: FC<PropsWithChildren> = ({ children }) => (
    <div className="app-background min-h-screen overflow-x-hidden">{children}</div>
)

export default Background
