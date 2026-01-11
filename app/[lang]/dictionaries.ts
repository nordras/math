import 'server-only';

const dictionaries = {
  'en-US': () =>
    import('./dictionaries/en-US.json').then((module) => module.default),
  'pt-BR': () =>
    import('./dictionaries/pt-BR.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
