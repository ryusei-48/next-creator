import 'server-only'

const dictionaries = {
  ja: {
    home: () => import('./ja/home.json').then((module) => module.default),
    header: () => import('./ja/header.json').then((module) => module.default),
    sidebar: () => import('./ja/sidebar.json').then((module) => module.default),
  },
  en: {
    home: () => import('./en/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default),
    sidebar: () => import('./en/sidebar.json').then((module) => module.default),
  }
}

export default dictionaries;