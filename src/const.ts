const BUTTON_BASE =
    'inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4'

export const ACTIVE_PRIMARY_BUTTON = `${BUTTON_BASE} bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-200 dark:focus-visible:ring-indigo-500/30`
export const ACTIVE_SECONDARY_BUTTON = `${BUTTON_BASE} border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:ring-slate-600/40`
export const ACTIVE_HINT_BUTTON = `${BUTTON_BASE} border border-amber-200 bg-amber-50 text-amber-900 shadow-sm hover:border-amber-300 hover:bg-amber-100 active:bg-amber-200 focus-visible:ring-amber-200 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20 dark:focus-visible:ring-amber-500/30`
export const DISABLED_BUTTON = `${BUTTON_BASE} cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 opacity-70 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-500`
