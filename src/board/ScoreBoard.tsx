import { selectWordsByComputer, selectWordsByUser } from '../store/reducer'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../store/hooks.ts'

const zip: (a: Words, b: Words) => Words[] = (a, b) =>
    Array.from(Array(Math.max(a.length, b.length)).keys()).map(i => [
        i < a.length ? a[i] : '',
        i < b.length ? b[i] : ''
    ])

const score = (words: string[]) => words.reduce((total, word) => total + word.length, 0)

const ScoreBoard = () => {
    const { t } = useTranslation()
    const wordsByUser = useAppSelector(selectWordsByUser)
    const wordsByComputer = useAppSelector(selectWordsByComputer)
    const moves = zip(wordsByUser, wordsByComputer)

    return (
        <section
            className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
            aria-labelledby="scoreboard-title"
        >
            <div className="p-5">
                <h2 id="scoreboard-title" className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('scoreboardTitle')}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-indigo-50 p-3 dark:bg-indigo-500/10">
                        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                            {t('scoreboardUser')}
                        </p>
                        <p className="mt-1 text-2xl font-black text-indigo-950 dark:text-indigo-100">
                            {score(wordsByUser)}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-500/10">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                            {t('scoreboardComputer')}
                        </p>
                        <p className="mt-1 text-2xl font-black text-amber-950 dark:text-amber-100">
                            {score(wordsByComputer)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800">
                <table className="w-full table-fixed text-left text-sm">
                    <caption className="sr-only">{t('scoreboardTitle')}</caption>
                    <thead className="bg-slate-50/80 text-xs text-slate-500 dark:bg-slate-950/40 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                {t('scoreboardUser')}
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                {t('scoreboardComputer')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {moves.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-5 py-5 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                    {t('noWordsYet')}
                                </td>
                            </tr>
                        ) : (
                            moves.map(([userWord, computerWord], i) => (
                                <tr key={`move${String(i)}`} className="text-slate-700 dark:text-slate-200">
                                    <td className="break-words px-5 py-3 font-semibold">{userWord}</td>
                                    <td className="break-words px-5 py-3 font-semibold">{computerWord}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default ScoreBoard
