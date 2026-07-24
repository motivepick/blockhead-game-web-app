import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    en: {
        translation: {
            appKicker: 'A word game',
            appTitle: 'Blockhead',
            appSubtitle: 'Add one letter, then connect neighboring letters to build a word.',
            boardTitle: 'Game board',
            yourTurn: 'Your turn',
            computerThinking: 'Computer is thinking...',
            startingNewGame: 'Starting a new game...',
            findingHint: 'Finding a hint...',
            gameUnavailable: 'Could not start the game',
            hintingStatus: 'Showing a hint',
            submitWord: 'Submit word',
            resetLetter: 'Remove letter',
            resetChosenWord: 'Clear selection',
            errorWordIsAlreadyUsed: 'Word is already used',
            errorNewLetterUnused: 'Use new letter',
            hint: 'Hint',
            difficultyLabel: 'Difficulty',
            fieldSizeLabel: 'Board size',
            difficultyEasy: 'Easy',
            difficultyMedium: 'Medium',
            difficultyHard: 'Hard',
            settingsTitle: 'Game settings',
            newGame: 'New game',
            confirmNewGame: 'Start a new game? Your current progress will be lost.',
            scoreboardTitle: 'Scoreboard',
            scoreboardUser: 'User',
            scoreboardComputer: 'Computer',
            scoreboardScore: 'Score:',
            noWordsYet: 'Played words will appear here.',
            howToPlayTitle: 'How to play',
            howToPlayStep1: 'Place one letter next to an existing letter.',
            howToPlayStep2: 'Select neighboring letters to spell a word.',
            howToPlayStep3: 'Submit it and let the computer answer.',
            keyboardHelp: 'Press Esc or Backspace to undo your current choice.',
            loadingBoard: 'Preparing the board...'
        }
    },
    ru: {
        translation: {
            appKicker: 'Игра в слова',
            appTitle: 'Балда',
            appSubtitle: 'Добавьте одну букву, затем соедините соседние буквы в слово.',
            boardTitle: 'Игровое поле',
            yourTurn: 'Ваш ход',
            computerThinking: 'Компьютер думает...',
            startingNewGame: 'Начинаем новую игру...',
            findingHint: 'Ищем подсказку...',
            gameUnavailable: 'Не удалось начать игру',
            hintingStatus: 'Показываем подсказку',
            submitWord: 'Подтвердить слово',
            resetLetter: 'Убрать букву',
            resetChosenWord: 'Очистить выбор',
            errorWordIsAlreadyUsed: 'Слово уже использовано',
            errorNewLetterUnused: 'Используйте новую букву',
            hint: 'Подсказка',
            difficultyLabel: 'Сложность',
            fieldSizeLabel: 'Размер поля',
            difficultyEasy: 'Лёгкий',
            difficultyMedium: 'Средний',
            difficultyHard: 'Сложный',
            settingsTitle: 'Настройки игры',
            newGame: 'Новая игра',
            confirmNewGame: 'Начать новую игру? Текущий прогресс будет потерян.',
            scoreboardTitle: 'Таблица результатов',
            scoreboardUser: 'Пользователь',
            scoreboardComputer: 'Компьютер',
            scoreboardScore: 'Счёт:',
            noWordsYet: 'Сыгранные слова появятся здесь.',
            howToPlayTitle: 'Как играть',
            howToPlayStep1: 'Поставьте одну букву рядом с уже заполненной клеткой.',
            howToPlayStep2: 'Выберите соседние буквы, чтобы составить слово.',
            howToPlayStep3: 'Подтвердите слово и дождитесь ответа компьютера.',
            keyboardHelp: 'Esc или Backspace отменяет текущий выбор.',
            loadingBoard: 'Готовим поле...'
        }
    }
}

void i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })

export default i18n
