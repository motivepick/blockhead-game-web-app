import api from './api'

export const makeMove = async ({ field, wordsUsed, difficulty }: { field: Field, wordsUsed: Words, difficulty: string }) => {
    try {
        const response = await api.post('/move-requests', {
            field: field.map(row => row.join('')),
            usedWords: wordsUsed,
            difficulty
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const createNewField = async (size: Number = 3): Promise<Field> => {
    try {
        const response = await api.get(`/field/${size}`)
        const rawField = response.data as string[]
        return rawField.map(row => row.split(''))
    } catch (error) {
        console.error(error)
        return [[]] as Field
    }
}
