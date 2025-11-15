import React from 'react';
import { LearningSection } from '@/app/iq-quiz/page';

interface LearningModuleProps {
  selectedTopic: string | null;
  currentSectionIndex: number;
  sectionsRead: boolean[];
  onSectionChange: (index: number) => void;
  onMarkAsRead: (index: number) => void;
  onContinue: () => void;
  learningContent: Record<string, LearningSection[]>; // Added learning content as props
}

export const LearningModule: React.FC<LearningModuleProps> = ({
  selectedTopic,
  currentSectionIndex,
  sectionsRead,
  onSectionChange,
  onMarkAsRead,
  onContinue,
  learningContent
}) => {
  if (!selectedTopic) return <div>No topic selected</div>;

  const sections = learningContent[selectedTopic];
  if (!sections) return <div>Invalid topic selected</div>;
  
  const currentSection = sections[currentSectionIndex];
  
  // Mark section as read when user navigates to it
  React.useEffect(() => {
    onMarkAsRead(currentSectionIndex);
  }, [currentSectionIndex, onMarkAsRead]);
  
  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      onSectionChange(currentSectionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      onSectionChange(currentSectionIndex - 1);
    }
  };
  
  const handleContinue = () => {
    // Check if this is the last section
    if (currentSectionIndex === sections.length - 1) {
      // All sections have been read, allow continuing to quiz
      onContinue();
    } else {
      // Move to next section
      onSectionChange(currentSectionIndex + 1);
    }
  };
  
  const allSectionsRead = sectionsRead.every(read => read);
  
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {currentSection.title}
      </h2>

      <div className="mb-8">
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{currentSection.content}</p>

        {currentSection.keyTerms.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg mb-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Key Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSection.keyTerms.map((term, index) => (
                <div key={index} className="border border-blue-200 rounded-lg p-3 bg-white shadow-sm">
                  <div className="font-medium text-gray-900">{term.term}</div>
                  <div className="text-sm text-gray-600 mt-1">{term.definition}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
            className={`px-5 py-2.5 rounded-lg font-medium ${
              currentSectionIndex === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
            }`}
          >
            Previous
          </button>

          <div className="flex flex-col items-center">
            <span className="text-gray-600 mb-2 font-medium">
              Section {currentSectionIndex + 1} of {sections.length}
            </span>
            <div className="w-64 bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentSectionIndex === sections.length - 1}
            className={`px-5 py-2.5 rounded-lg font-medium ${
              currentSectionIndex === sections.length - 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
            }`}
          >
            Next
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!allSectionsRead}
          className={`px-7 py-3.5 rounded-lg font-bold text-lg ${
            allSectionsRead
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg'
              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
          }`}
        >
          {currentSectionIndex === sections.length - 1
            ? (allSectionsRead ? 'Ready for Quiz' : 'Complete All Sections First')
            : 'Mark as Read'}
        </button>
      </div>
    </div>
  );
};