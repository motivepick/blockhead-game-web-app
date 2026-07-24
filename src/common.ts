export const equals = (p: Cell, q: Cell): boolean => p[0] === q[0] && p[1] === q[1]

export const includes = (list: Cell[], cell: Cell): boolean => list.some(([x, y]) => equals([x, y], cell))

export const isFieldOfSize = (field: unknown, size: number): field is Field =>
    Array.isArray(field) &&
    field.length === size &&
    field.every(
        row =>
            Array.isArray(row) &&
            row.length === size &&
            row.every(cell => typeof cell === 'string' && cell.length === 1)
    )
