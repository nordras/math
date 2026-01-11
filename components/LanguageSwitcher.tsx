'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
  ];

  const currentLang = pathname.split('/')[1];

  const switchLanguage = (newLang: string) => {
    if (!pathname) return;
    
    const segments = pathname.split('/');
    segments[1] = newLang;
    router.push(segments.join('/'));
  };

  return (
    <div className="dropdown dropdown-end">
      <button type="button" tabIndex={0} className="btn btn-ghost btn-circle">
        <span className="text-2xl">
          {languages.find(lang => lang.code === currentLang)?.flag || '🌐'}
        </span>
      </button>
      <ul className="menu dropdown-content z-1 p-2 shadow-lg bg-base-100 rounded-box w-52 mt-3 border border-base-300">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              type="button"
              onClick={() => switchLanguage(lang.code)}
              className={`flex items-center gap-3 ${
                currentLang === lang.code ? 'active' : ''
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
