import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizQuestion, LearningTopic } from '@/app/iq-quiz/page';

interface QuizContextType {
  questions: QuizQuestion[];
  learningContent: LearningTopic[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // This would contain our quiz questions and learning content
  const [questions] = useState<QuizQuestion[]>([]);
  const [learningContent] = useState<LearningTopic[]>([]);

  return (
    <QuizContext.Provider value={{ questions, learningContent }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};