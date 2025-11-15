import React from 'react';

interface ResultsPageProps {
  iqScore: number;
  score: number;
  percentile: number;
  selectedTopic: string | null;
  onRetake: () => void;
  onReview: () => void;
  onReturnToTopics: () => void;
}

// Get topic title from ID
const getTopicTitle = (topicId: string | null): string => {
  if (!topicId) return 'Unknown Topic';
  
  const topics: Record<string, string> = {
    'blockchain-fundamentals': 'Blockchain Fundamentals',
    'defi': 'Decentralized Finance (DeFi)',
    'daos': 'Decentralized Autonomous Organizations (DAOs)',
    'cryptocurrencies': 'Cryptocurrencies & Tokenomics',
    'smart-contracts': 'Smart Contracts & Web3 Development',
    'nfts': 'NFTs & Digital Assets',
    'consensus': 'Consensus Mechanisms',
    'ethereum-l2': 'Ethereum & Layer 2 Solutions'
  };
  
  return topics[topicId] || 'Unknown Topic';
};

// Get mastery level based on score
const getMasteryLevel = (correctAnswers: number): string => {
  if (correctAnswers <= 3) return 'Beginner';
  if (correctAnswers <= 6) return 'Intermediate';
  if (correctAnswers <= 9) return 'Advanced';
  return 'Expert';
};

// Get personalized encouragement message
const getEncouragementMessage = (iqScore: number): string => {
  if (iqScore >= 170) return 'Outstanding! You\'re a true Web3 expert!';
  if (iqScore >= 150) return 'Excellent job! Your knowledge is impressive!';
  if (iqScore >= 130) return 'Great work! You have a solid understanding!';
  if (iqScore >= 110) return 'Good effort! Keep learning to improve!';
  return 'Nice try! Keep studying and you\'ll get better!';
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  iqScore,
  score,
  percentile,
  selectedTopic,
  onRetake,
  onReview,
  onReturnToTopics
}) => {
  const topicTitle = getTopicTitle(selectedTopic);
  const masteryLevel = getMasteryLevel(score);
  const encouragementMessage = getEncouragementMessage(iqScore);
  
  // Determine badge color based on score
  let badgeColor = '';
  if (score >= 7) badgeColor = 'bg-green-100 text-green-800 border-green-300';
  else if (score >= 4) badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  else badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
  
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Quiz Results</h1>
        <p className="text-gray-600 mb-8">Your performance summary</p>

        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-1 mb-8 border border-gray-200">
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-[14px] p-8">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">{topicTitle}</h2>
              <p className="text-gray-600">Your Web3 Mastery Score</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-2">
                {iqScore}
              </div>
              <div className="text-lg text-gray-600 mb-6">IQ Score</div>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="text-center bg-white rounded-xl p-4 shadow-sm min-w-[120px] border border-gray-100">
                  <div className="text-2xl font-bold text-gray-800">{score}/10</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>

                <div className="text-center bg-white rounded-xl p-4 shadow-sm min-w-[120px] border border-gray-100">
                  <div className="text-2xl font-bold text-gray-800">{percentile}th</div>
                  <div className="text-sm text-gray-600">Percentile</div>
                </div>

                <div className="text-center bg-white rounded-xl p-4 shadow-sm min-w-[120px] border border-gray-100">
                  <div className={`text-xl font-bold px-4 py-1 rounded-full ${badgeColor}`}>
                    {masteryLevel}
                  </div>
                  <div className="text-sm text-gray-600">Mastery Level</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6 w-full max-w-md">
                <p className="text-lg font-medium text-blue-800">{encouragementMessage}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={onReview}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Review Answers
          </button>

          <button
            onClick={onRetake}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Retake This Quiz
          </button>

          <button
            onClick={onReturnToTopics}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Try Another Topic
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">About Your Score</h3>
        <p className="text-gray-700 mb-3">
          Your IQ score is calculated using the formula: IQ = 100 + (Correct Answers × 10) - 10
        </p>
        <p className="text-gray-700">
          This is an educational assessment specific to your knowledge of {topicTitle}.
          Continue exploring other topics to build a comprehensive understanding of Web3 technologies.
        </p>
      </div>
    </div>
  );
};