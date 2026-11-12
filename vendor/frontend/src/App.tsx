import React from 'react';
import { ThemeProvider, DemoLearningProvider } from './context';
import { AppRouter } from './router/AppRouter';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DemoLearningProvider>
        <AppRouter />
      </DemoLearningProvider>
    </ThemeProvider>
  );
};

export default App;
