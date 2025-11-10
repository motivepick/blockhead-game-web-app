import {TEXT_COLOR} from "../const"
import {selectWordsByComputer, selectWordsByUser} from "../store/reducer"
import {useSelector} from "react-redux"
import {useTranslation} from "react-i18next";

const zip: (a: Words, b: Words) => Words[] = (a, b) => Array
    .from(Array(Math.max(a.length, b.length)).keys())
    .map(i => [i < a.length ? a[i] : '', i < b.length ? b[i] : ''])

const score = (words: string[]) => words
    .map(it => it.length)
    .reduce((a, b) => a + b, 0)

const ScoreBoard = () => {
    const { t } = useTranslation()
    const wordsByUser = useSelector(selectWordsByUser)
    const wordsByComputer = useSelector(selectWordsByComputer)

    return (
        <table className="min-w-full">
            <caption className={TEXT_COLOR}>{t('scoreboardTitle')}</caption>
            <thead
                className="border-b  bg-indigo-100 border-indigo-200 dark:bg-slate-700 dark:border-slate-600">
            <tr>
                <th scope="col" className="text-sm font-bold text-gray-900 dark:text-gray-400 px-6 py-4">
                    {t('scoreboardUser')}
                </th>
                <th scope="col" className="text-sm font-bold text-gray-900 dark:text-gray-400 px-6 py-4">
                    {t('scoreboardComputer')}
                </th>
            </tr>
            </thead>
            <tbody>
            {
                zip(wordsByUser, wordsByComputer)
                    .map(([userWord, computerWord], i) => <tr className="border-b  dark:border-slate-600"
                                                              key={`move${i}`}>
                        <td className="text-sm text-gray-900 dark:text-gray-200 font-medium px-6 py-4 whitespace-nowrap">{userWord}</td>
                        <td className="text-sm text-gray-900 dark:text-gray-200 font-medium px-6 py-4 whitespace-nowrap">{computerWord}</td>
                    </tr>)
            }
            </tbody>
            <tfoot>
            <tr>
                <td className="text-sm text-gray-900 dark:text-gray-200 px-6 py-4 whitespace-nowrap">
                    <b>{t('scoreboardScore')}</b> {score(wordsByUser)}</td>
                <td className="text-sm text-gray-900 dark:text-gray-200 px-6 py-4 whitespace-nowrap">
                    <b>{t('scoreboardScore')}</b> {score(wordsByComputer)}</td>
            </tr>
            </tfoot>
        </table>
    )
}

export default ScoreBoard