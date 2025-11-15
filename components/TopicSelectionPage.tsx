import React from 'react';

interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
}

interface TopicSelectionPageProps {
  onStartLearning: (topicId: string) => void;
}

const TOPICS: Topic[] = [
  {
    id: 'blockchain-fundamentals',
    title: 'Blockchain Fundamentals',
    description: 'Learn the basic concepts of blockchain technology',
    estimatedTime: '5-7 minutes',
    difficulty: 'Beginner',
    icon: '🔗',
  },
  {
    id: 'defi',
    title: 'Decentralized Finance (DeFi)',
    description: 'Explore DeFi protocols and financial applications',
    estimatedTime: '5-7 minutes',
    difficulty: 'Intermediate',
    icon: '🏦',
  },
  {
    id: 'daos',
    title: 'Decentralized Autonomous Organizations (DAOs)',
    description: 'Understanding DAOs and governance systems',
    estimatedTime: '5-7 minutes',
    difficulty: 'Intermediate',
    icon: '🏛️',
  },
  {
    id: 'cryptocurrencies',
    title: 'Cryptocurrencies & Tokenomics',
    description: 'Learn about different cryptocurrencies and token models',
    estimatedTime: '5-7 minutes',
    difficulty: 'Beginner',
    icon: '🪙',
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contracts & Web3 Development',
    description: 'Explore smart contract development and Web3 integration',
    estimatedTime: '5-7 minutes',
    difficulty: 'Advanced',
    icon: '📝',
  },
  {
    id: 'nfts',
    title: 'NFTs & Digital Assets',
    description: 'Understanding NFTs and digital asset ownership',
    estimatedTime: '5-7 minutes',
    difficulty: 'Beginner',
    icon: '🖼️',
  },
  {
    id: 'consensus',
    title: 'Consensus Mechanisms',
    description: 'Learn about different blockchain consensus algorithms',
    estimatedTime: '5-7 minutes',
    difficulty: 'Advanced',
    icon: '🗳️',
  },
  {
    id: 'ethereum-l2',
    title: 'Ethereum & Layer 2 Solutions',
    description: 'Explore Ethereum and Layer 2 scaling solutions',
    estimatedTime: '5-7 minutes',
    difficulty: 'Intermediate',
    icon: '⛽',
  },
];

const TopicCard: React.FC<{ topic: Topic; onSelect: () => void }> = ({ topic, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-start">
          <span className="text-3xl mr-4">{topic.icon}</span>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                topic.difficulty === 'Beginner' 
                  ? 'bg-green-100 text-green-800' 
                  : topic.difficulty === 'Intermediate' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {topic.difficulty}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{topic.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">{topic.estimatedTime}</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
                Learn & Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TopicSelectionPage: React.FC<TopicSelectionPageProps> = ({ onStartLearning }) => {
  return (
    <div className="w-full">
      <div className="text-center mb-12 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Web3 & DeFi Educational IQ Quiz</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select a topic to learn about, complete the learning module, then test your knowledge with a timed IQ quiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onSelect={() => onStartLearning(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};