export const equals = (p: Cell, q: Cell): boolean =>
    p[0] === q[0] && p[1] === q[1]

export const includes = (list: Cell[], cell: Cell): boolean =>
    list.some(([x, y]) => equals([x, y], cell))