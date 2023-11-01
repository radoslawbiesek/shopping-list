'use client';

import { NextUIProvider } from '@nextui-org/react';
import i18next from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/pl/zod.json';

type ProvidersProps = {
  children: React.ReactNode;
};

i18next.init({
  lng: 'pl',
  resources: {
    pl: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

export function Providers({ children }: ProvidersProps) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
