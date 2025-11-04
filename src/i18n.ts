import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    en: {
        translation: {
            "submitWord": "Submit word (double click)",
            "resetLetter": "Reset letter (Esc)",
            "resetChosenWord": "Reset word (Esc)",
            "errorWordIsAlreadyUsed": "Word is already used",
            "errorNewLetterUnused": "Use new letter",
            "hint": "Hint",
            "difficultyEasy": "Easy",
            "difficultyMedium": "Medium",
            "difficultyHard": "Hard",
            "scoreboardTitle": "Scoreboard",
            "scoreboardUser": "User",
            "scoreboardComputer": "Computer",
            "scoreboardScore": "Score:",
        }
    },
    ru: {
        translation: {
            "submitWord": "Подтвердить слово (двойной клик)",
            "resetLetter": "Сбросить букву (Esc)",
            "resetChosenWord": "Сбросить слово (Esc)",
            "errorWordIsAlreadyUsed": "Слово уже использовано",
            "errorNewLetterUnused": "Используйте новую букву",
            "hint": "Подсказка",
            "difficultyEasy": "Лёгкий",
            "difficultyMedium": "Средний",
            "difficultyHard": "Сложный",
            "scoreboardTitle": "Таблица результатов",
            "scoreboardUser": "Пользователь",
            "scoreboardComputer": "Компьютер",
            "scoreboardScore": "Счёт:",
        }
    }
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
