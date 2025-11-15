import React from 'react';

interface ScoringExplanationProps {
  score: number;
  selectedTopic: string | null;
  onClose: () => void;
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

export const ScoringExplanation: React.FC<ScoringExplanationProps> = ({
  score,
  selectedTopic,
  onClose
}) => {
  const topicTitle = getTopicTitle(selectedTopic);
  
  // Calculate IQ score
  const iqScore = 100 + (score * 10) - 10;
  
  // Calculate percentile
  let percentile = 0;
  if (iqScore <= 90) percentile = 25;
  else if (iqScore <= 100) percentile = 50;
  else if (iqScore <= 120) percentile = 91;
  else if (iqScore <= 140) percentile = 99;
  else percentile = 100;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">How Your Score Was Calculated</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            >
              &times;
            </button>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-bold text-lg mb-2 text-blue-800">Raw Score</h3>
              <p className="text-gray-700">You answered <span className="font-bold text-gray-900">{score}</span> out of 10 questions correctly on <span className="font-bold text-gray-900">{topicTitle}</span>.</p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-gray-800">IQ Score Formula</h3>
              <p className="text-gray-700">IQ = 100 + (Number of Correct Answers × 10) - 10</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-200">
              <h3 className="font-bold text-lg mb-2 text-amber-800">Your Calculation</h3>
              <p className="text-gray-700">IQ = 100 + (<span className="font-bold text-gray-900">{score}</span> × 10) - 10</p>
              <p className="text-gray-700">IQ = 100 + {score * 10} - 10</p>
              <p className="text-2xl font-bold mt-3 text-gray-900">IQ = {iqScore}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
              <h3 className="font-bold text-lg mb-2 text-green-800">What Your Score Means</h3>
              <p className="text-gray-700">Percentile: <span className="font-bold text-gray-900">{percentile}th</span> percentile</p>
              <p className="text-gray-700">Interpretation: Based on your score of <span className="font-bold text-gray-900">{iqScore}</span></p>
              <p className="text-gray-700">Description: This indicates your understanding of {topicTitle} concepts relative to other users.</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-200">
              <h3 className="font-bold text-lg mb-2 text-purple-800">Important Notes</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>This is an educational assessment tool for learning Web3 concepts</li>
                <li>It is NOT a professional psychological IQ test</li>
                <li>Score is based on your performance on this specific learning module</li>
                <li>Try other topics to build comprehensive Web3 knowledge</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};