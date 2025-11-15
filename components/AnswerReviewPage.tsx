import React from 'react';
import { QuizQuestion } from '@/app/iq-quiz/page';

interface AnswerReviewPageProps {
  selectedTopic: string | null;
  userAnswers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  onReturnToResults: () => void;
  quizQuestions: QuizQuestion[]; // Add quiz questions as props
}

// Get questions for a specific topic from the main page
const getQuestionsByTopic = (topicId: string, allQuestions: QuizQuestion[]): QuizQuestion[] => {
  return allQuestions.filter(q => q.topicId === topicId);
};

export const AnswerReviewPage: React.FC<AnswerReviewPageProps> = ({
  selectedTopic,
  userAnswers,
  onReturnToResults,
  quizQuestions // Receive quiz questions as props
}) => {
  if (!selectedTopic) return <div>No topic selected</div>;

  const questions = getQuestionsByTopic(selectedTopic, quizQuestions);
  if (!questions || questions.length === 0) return <div>No questions available for this topic</div>;
  
  // Calculate correct answers
  const correctAnswers = questions.reduce((count, question) => {
    const userAnswer = userAnswers.find(a => a.questionId === question.id);
    return count + (userAnswer && userAnswer.selectedOptionId === question.correctOptionId ? 1 : 0);
  }, 0);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Answer Review</h1>
        <button
          onClick={onReturnToResults}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow transition-all"
        >
          Back to Results
        </button>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {questions.length} Questions • {correctAnswers} Correct
          </h2>
          <div className="text-lg font-bold bg-gradient-to-r from-blue-100 to-indigo-100 py-2 px-4 rounded-lg">
            Score: {correctAnswers}/{questions.length}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = userAnswers.find(a => a.questionId === question.id);
          const isCorrect = userAnswer && userAnswer.selectedOptionId === question.correctOptionId;

          // Get the selected option text
          const selectedOption = userAnswer
            ? question.options.find(opt => opt.id === userAnswer.selectedOptionId)
            : null;

          // Get the correct option text
          const correctOption = question.options.find(opt => opt.id === question.correctOptionId);

          return (
            <div key={question.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="mr-4 mb-3 sm:mb-0">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-base font-bold ${
                    isCorrect ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h3>
                  <div>
                    <div className="mb-3">
                      <span className="font-medium text-gray-700">Your Answer: </span>
                      <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {selectedOption ? selectedOption.text : 'No answer selected'}
                      </span>
                      {!isCorrect && selectedOption && <span className="ml-2 text-red-600 font-bold text-lg">✗</span>}
                      {isCorrect && <span className="ml-2 text-green-600 font-bold text-lg">✓</span>}
                    </div>

                    {!isCorrect && (
                      <div className="mb-3">
                        <span className="font-medium text-gray-700">Correct Answer: </span>
                        <span className="text-green-600 font-medium">
                          {correctOption ? correctOption.text : 'N/A'}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Explanation:
                      </p>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onReturnToResults}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all"
        >
          Back to Results
        </button>
      </div>
    </div>
  );
};