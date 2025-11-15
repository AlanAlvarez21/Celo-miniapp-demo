import React, { useEffect, useState } from 'react';
import { QuizQuestion } from '@/app/iq-quiz/page';

interface QuizPageProps {
  selectedTopic: string | null;
  currentQuestionIndex: number;
  timeRemaining: number;
  userAnswers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onGoToQuestion: (index: number) => void;
  onSubmit: () => void;
  quizQuestions: QuizQuestion[]; // Add quiz questions as props
}

// Get questions for a specific topic from the main page
const getQuestionsByTopic = (topicId: string, allQuestions: QuizQuestion[]): QuizQuestion[] => {
  return allQuestions.filter(q => q.topicId === topicId);
};

export const QuizPage: React.FC<QuizPageProps> = ({
  selectedTopic,
  currentQuestionIndex,
  timeRemaining,
  userAnswers,
  onSelectAnswer,
  onGoToQuestion,
  onSubmit,
  quizQuestions // Receive quiz questions as props
}) => {
  if (!selectedTopic) return <div>No topic selected</div>;

  const questions = getQuestionsByTopic(selectedTopic, quizQuestions);
  if (!questions || questions.length === 0) return <div>No questions available for this topic</div>;
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Time warning thresholds
  const isTimeWarning = timeRemaining <= 60;
  const isTimeCritical = timeRemaining <= 10;
  
  // Get user's answer for this question
  const userAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
  
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="text-lg font-semibold text-gray-700">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className={`text-xl font-bold px-4 py-2.5 rounded-lg ${
          isTimeCritical
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
            : isTimeWarning
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
        }`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">{currentQuestion.question}</h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option) => {
            const isSelected = userAnswer?.selectedOptionId === option.id;
            let optionClass = "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md";

            // If answer is submitted, show correct/incorrect styling
            if (userAnswer) {
              if (option.id === currentQuestion.correctOptionId) {
                optionClass += " border-green-500 bg-green-50"; // Correct answer
              } else if (isSelected && option.id !== currentQuestion.correctOptionId) {
                optionClass += " border-red-500 bg-red-50"; // Selected wrong answer
              } else if (isSelected) {
                optionClass += " border-blue-500 bg-blue-50"; // Selected answer
              } else {
                optionClass += " border-gray-300"; // Default
              }
            } else if (isSelected) {
              optionClass += " border-blue-500 bg-blue-50"; // User's selection
            } else {
              optionClass += " border-gray-300 hover:border-blue-400"; // Default
            }

            return (
              <div
                key={option.id}
                className={optionClass}
                onClick={() => onSelectAnswer(currentQuestion.id, option.id)}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                    isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                  }`}>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className="text-gray-700">{option.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-3">
          <button
            onClick={() => currentQuestionIndex > 0 && onGoToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-300 hover:to-gray-400 transition-all"
          >
            Previous
          </button>

          <button
            onClick={() => currentQuestionIndex < questions.length - 1 && onGoToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-300 hover:to-gray-400 transition-all"
          >
            Next
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md"
          >
            Submit Quiz
          </button>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Question Navigation</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((_, idx) => {
            const isAnswered = userAnswers.some(a =>
              a.questionId === questions[idx].id && a.selectedOptionId
            );

            return (
              <button
                key={idx}
                onClick={() => onGoToQuestion(idx)}
                className={`p-2 rounded-lg border font-medium ${
                  currentQuestionIndex === idx
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : isAnswered
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};