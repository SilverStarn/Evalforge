import type { Preview } from '@storybook/react';
import '../src/styles.css';
import '../src/i18n/i18n';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
