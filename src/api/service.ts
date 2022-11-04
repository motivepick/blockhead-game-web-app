import api from './api'

export const makeMove = async ({field, usedWords}: { field: Field, usedWords: Words }) => {
    try {
        const response = await api.post('/move-requests', {
            field: field.map(row => row.join('')),
            usedWords
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const createNewField: () => Promise<Field> = async () => {
    try {
        const response = await api.get('/field')
        const rawField = response.data as string[]
        return rawField.map(row => row.split(''))
    } catch (error) {
        console.error(error)
        return [[]] as Field
    }
}
