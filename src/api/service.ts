import instance from './axios.ts'

const makeMove = async ({
    field,
    usedWords,
    difficulty
}: {
    field: Field
    usedWords: Words
    difficulty: string
}): Promise<ComputerMoveResponse> => {
    const difficultyMap: Record<string, string> = {
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard'
    }
    try {
        const response = await instance.post('/move-requests', {
            field: field.map(row => row.join('')),
            usedWords,
            difficulty: difficultyMap[difficulty] || 'Medium'
        })
        return response.data as ComputerMoveResponse
    } catch (error) {
        console.error(error)
        return { cell: [-1, -1], letter: '', path: [], word: '', success: false }
    }
}

const createNewField = async (size = 3): Promise<Field> => {
    try {
        const response = await instance.get(`/field`, { params: { size } })
        const rawField = response.data as string[]
        return rawField.map(row => row.split(''))
    } catch (error) {
        console.error(error)
        return [[]] as Field
    }
}

const api = {makeMove, createNewField}

export default api
