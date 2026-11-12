import { useContext } from 'react';
import { DemoLearningContext, type DemoLearningContextType } from './demoLearningTypes';

export const useDemoLearning = (): DemoLearningContextType => {
  const context = useContext(DemoLearningContext);
  if (!context) {
    throw new Error('useDemoLearning must be used within a DemoLearningProvider');
  }
  return context;
};
