'use client';

import React, { useState, useEffect } from 'react';
import { TopicSelectionPage } from '@/components/TopicSelectionPage';
import { LearningModule } from '@/components/LearningModule';
import { QuizPage } from '@/components/QuizPage';
import { ResultsPage } from '@/components/ResultsPage';
import { AnswerReviewPage } from '@/components/AnswerReviewPage';
import { ScoringExplanation } from '@/components/ScoringExplanation';

// Define types based on the specification
export interface LearningTopic {
  id: string;
  title: string;
  sections: LearningSection[];
}

export interface LearningSection {
  id: string;
  title: string;
  content: string;
  keyTerms: {
    term: string;
    definition: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  questionNumber: number;
  question: string;
  options: {
    id: string;
    label: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type AppPhase = 'topic-selection' | 'learning' | 'pre-quiz' | 'quiz' | 'results' | 'review';

export interface AppState {
  currentPhase: AppPhase;
  selectedTopic: string | null;
  currentSectionIndex: number;
  sectionsRead: boolean[];
  quizStarted: boolean;
  currentQuestionIndex: number;
  userAnswers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  timeRemaining: number;
  quizCompleted: boolean;
  score: number;
  iqScore: number;
  percentile: number;
}

// Learning content for all 8 topics with 5 sections each
const LEARNING_CONTENT: Record<string, LearningSection[]> = {
  'blockchain-fundamentals': [
    {
      id: '1',
      title: 'What is Blockchain?',
      content: 'Blockchain is a decentralized, distributed ledger technology that records transactions across many computers in such a way that the registered transactions cannot be altered retroactively. This technology is the backbone of cryptocurrencies like Bitcoin and Ethereum.',
      keyTerms: [
        { term: 'Block', definition: 'A collection of transactions that are bundled together and added to the blockchain.' },
        { term: 'Hash', definition: 'A cryptographic function that converts an input into a fixed-size alphanumeric string.' },
        { term: 'Decentralization', definition: 'The distribution of control across a network rather than being held by a single entity.' }
      ]
    },
    {
      id: '2',
      title: 'How Blocks & Chains Work',
      content: 'Each block contains a number of transactions, and every time a new block is added to the blockchain, it contains a reference (hash) to the previous block. This creates an unbreakable chain of blocks, which is why this technology is called "blockchain." Miners compete to validate transactions and add them to the blockchain.',
      keyTerms: [
        { term: 'Mining', definition: 'The process of adding transaction records to the public ledger of past transactions (blockchain).' },
        { term: 'Consensus', definition: 'A method for achieving agreement on a single data value among distributed processes or systems.' },
        { term: 'Cryptography', definition: 'The practice and study of techniques for secure communication in the presence of adversarial behavior.' }
      ]
    },
    {
      id: '3',
      title: 'Smart Contracts Intro',
      content: 'Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They run on the blockchain and automatically execute when predetermined conditions are met. Smart contracts eliminate the need for intermediaries and can be used for various applications beyond simple transactions.',
      keyTerms: [
        { term: 'Smart Contract', definition: 'Self-executing contracts with terms directly written into code.' },
        { term: 'Ethereum', definition: 'A decentralized platform that enables smart contracts and decentralized applications.' },
        { term: 'Triggers', definition: 'Predefined conditions that cause smart contracts to execute.' }
      ]
    },
    {
      id: '4',
      title: 'Transactions & Networks',
      content: 'Blockchain transactions involve the transfer of value between wallets and are recorded on the blockchain. Each transaction is verified by network nodes through cryptography. Network nodes are computers that participate in the blockchain network by validating and relaying transactions. Gas fees are payments made by users to compensate for the computing energy required to process and validate transactions.',
      keyTerms: [
        { term: 'Transaction', definition: 'A transfer of value between blockchain wallets.' },
        { term: 'Gas Fees', definition: 'Payment made by users to compensate for computing energy required to process transactions.' },
        { term: 'Network Nodes', definition: 'Computers that participate in the blockchain network by validating and relaying transactions.' }
      ]
    },
    {
      id: '5',
      title: 'Key Takeaways & Quiz Prep',
      content: 'Blockchain technology provides a secure, transparent, and decentralized way to record transactions. It eliminates the need for intermediaries in many processes and has applications beyond cryptocurrency. Key concepts to remember include the structure of blocks, the chain relationship, and the importance of consensus mechanisms.',
      keyTerms: [
        { term: 'Immutability', definition: 'The property of blockchain data that prevents it from being changed once recorded.' },
        { term: 'Transparency', definition: 'The visibility of all transactions on the blockchain to all participants.' },
        { term: 'Trustless System', definition: 'A system that does not require trust between parties to operate.' }
      ]
    }
  ],
  'defi': [
    {
      id: '1',
      title: 'What is DeFi?',
      content: 'Decentralized Finance (DeFi) refers to financial services that operate without traditional banks or financial institutions. Instead, smart contracts on blockchains automatically execute transactions. DeFi aims to recreate traditional financial systems like lending, borrowing, and trading in a decentralized way.',
      keyTerms: [
        { term: 'DeFi', definition: 'Decentralized Finance - financial services built on blockchain technology without intermediaries.' },
        { term: 'DEX', definition: 'Decentralized Exchange - a platform for trading cryptocurrencies without an intermediary.' },
        { term: 'Yield Farming', definition: 'The practice of staking or lending crypto assets to generate high returns.' }
      ]
    },
    {
      id: '2',
      title: 'Core DeFi Components',
      content: 'DeFi consists of multiple components including decentralized exchanges (DEXs), lending protocols, yield farming platforms, and stablecoins. DEXs like Uniswap allow users to trade directly from their wallets. Lending protocols like Aave and Compound allow users to lend and borrow crypto assets. Yield farming involves providing liquidity to DeFi protocols in exchange for rewards.',
      keyTerms: [
        { term: 'Lending Protocols', definition: 'Platforms that allow users to lend and borrow cryptocurrency.' },
        { term: 'Stablecoins', definition: 'Cryptocurrencies designed to maintain a stable value, often pegged to a traditional currency.' },
        { term: 'Liquidity Pools', definition: 'Smart contracts that hold reserves of tokens to facilitate trading.' }
      ]
    },
    {
      id: '3',
      title: 'Risks & Rewards',
      content: 'DeFi offers high potential returns but also significant risks. Benefits include high yields, access to financial services, and transparency. However, DeFi protocols are vulnerable to smart contract bugs, price volatility, and regulatory uncertainty. Common risks include rug pulls (where developers abandon a project and steal investor funds) and impermanent loss (loss of value due to price volatility in liquidity pools).',
      keyTerms: [
        { term: 'Rug Pull', definition: 'A scam where developers abandon a project and steal investor funds.' },
        { term: 'Impermanent Loss', definition: 'The loss of value due to price volatility in liquidity pools.' },
        { term: 'Smart Contract Risks', definition: 'Risks associated with vulnerabilities in the code of smart contracts.' }
      ]
    },
    {
      id: '4',
      title: 'Real-World DeFi Ecosystem',
      content: 'Major DeFi protocols include Aave for lending and borrowing, Uniswap for decentralized trading, Compound for money markets, and Curve for stablecoin swaps. These protocols handle billions in value and represent the core infrastructure of the DeFi ecosystem. Governance tokens like UNI and COMP allow token holders to vote on protocol changes.',
      keyTerms: [
        { term: 'Aave', definition: 'A decentralized lending and borrowing protocol.' },
        { term: 'Uniswap', definition: 'A popular decentralized exchange protocol.' },
        { term: 'Governance Tokens', definition: 'Tokens that give holders voting rights in protocol decisions.' }
      ]
    },
    {
      id: '5',
      title: 'Key Takeaways & Quiz Prep',
      content: 'DeFi represents a paradigm shift in finance by removing intermediaries and creating trust through code. Key concepts include DEXs, lending protocols, yield farming, and the associated risks. Understanding these components will help prepare for the quiz questions on DeFi protocols and their functions.',
      keyTerms: [
        { term: 'Financial Inclusion', definition: 'The delivery of financial services to underserved populations.' },
        { term: 'Permissionless Access', definition: 'The ability to access financial services without requiring approval from intermediaries.' },
        { term: 'Composability', definition: 'The ability for DeFi protocols to interoperate and build upon each other.' }
      ]
    }
  ],
  'daos': [
    {
      id: '1',
      title: 'What is a DAO?',
      content: 'A DAO (Decentralized Autonomous Organization) is an organization governed by rules encoded in smart contracts rather than traditional management structures. No single authority controls a DAO; instead, decisions are made through member voting using governance tokens. DAOs operate transparently on the blockchain and execute decisions automatically through code.',
      keyTerms: [
        { term: 'DAO', definition: 'Decentralized Autonomous Organization - an organization governed by smart contracts.' },
        { term: 'Governance Tokens', definition: 'Tokens that represent voting rights in DAO decisions.' },
        { term: 'On-chain Governance', definition: 'Decision-making processes that happen transparently on the blockchain.' }
      ]
    },
    {
      id: '2',
      title: 'How DAOs Work',
      content: 'DAO members hold governance tokens that grant voting power proportional to their holdings. Proposals for changes or actions are submitted, discussed, and voted on-chain. When a proposal passes a predetermined threshold, the smart contract automatically executes the decision. This creates a transparent, democratic system without traditional management hierarchies.',
      keyTerms: [
        { term: 'Proposals', definition: 'Suggestions for changes or actions in a DAO that members vote on.' },
        { term: 'Quorum', definition: 'The minimum number of votes required for a proposal to be valid.' },
        { term: 'Vesting', definition: 'The process of gradually gaining access to governance tokens over time.' }
      ]
    },
    {
      id: '3',
      title: 'Real DAO Examples',
      content: 'MakerDAO governs the DAI stablecoin protocol and is one of the oldest and most successful DAOs. Uniswap DAO controls protocol upgrades for the Uniswap exchange. ConstitutionDAO raised over $45 million in crypto to bid on a rare copy of the U.S. Constitution. Other notable DAOs include Aave Grants DAO, which funds ecosystem development, and PleasrDAO, which acquires NFTs for members.',
      keyTerms: [
        { term: 'MakerDAO', definition: 'The DAO governing the DAI stablecoin protocol.' },
        { term: 'ConstitutionDAO', definition: 'A DAO that raised $47M to purchase a U.S. Constitution.' },
        { term: 'Treasury', definition: 'The collective funds managed by a DAO for various purposes.' }
      ]
    },
    {
      id: '4',
      title: 'DAO Governance Models',
      content: 'DAOs use various governance models including token-weighted voting, quadratic voting, and delegated governance. Token-weighted voting gives more influence to those holding more tokens. Quadratic voting allows members to express the intensity of their preferences. Delegated governance lets token holders delegate their voting power to others.',
      keyTerms: [
        { term: 'Token-weighted Voting', definition: 'A system where voting power is proportional to token holdings.' },
        { term: 'Quadratic Voting', definition: 'A system that allows expressing intensity of preferences.' },
        { term: 'Delegated Governance', definition: 'System where token holders delegate voting rights to representatives.' }
      ]
    },
    {
      id: '5',
      title: 'Challenges & Future of DAOs',
      content: 'DAOs face challenges including legal recognition, regulatory compliance, and scaling coordination. Key issues include voter apathy, governance token concentration, and the complexity of making effective decisions. However, DAOs represent the future of organizational governance and continue to evolve to address these challenges.',
      keyTerms: [
        { term: 'Voter Apathy', definition: 'Low participation in DAO governance processes.' },
        { term: 'Legal Recognition', definition: 'The challenge of how DAOs are recognized under existing legal frameworks.' },
        { term: 'Coordination Problems', definition: 'Difficulties in making effective decisions in decentralized organizations.' }
      ]
    }
  ],
  'cryptocurrencies': [
    {
      id: '1',
      title: 'Introduction to Cryptocurrencies',
      content: 'Cryptocurrencies are digital or virtual currencies that use cryptography for security. They operate on decentralized networks based on blockchain technology. Bitcoin, launched in 2009, was the first cryptocurrency and remains the most well-known. Cryptocurrencies provide an alternative to traditional fiat currencies issued by governments.',
      keyTerms: [
        { term: 'Cryptocurrency', definition: 'A digital or virtual currency secured by cryptography.' },
        { term: 'Bitcoin', definition: 'The first and most well-known cryptocurrency.' },
        { term: 'Cryptography', definition: 'The practice of securing communication and data in the presence of adversaries.' }
      ]
    },
    {
      id: '2',
      title: 'Different Types of Cryptocurrencies',
      content: 'Cryptocurrencies can be categorized into various types: payment cryptocurrencies (like Bitcoin), utility tokens (like Ethereum), stablecoins (like Tether), and security tokens. Each type serves different functions within the crypto ecosystem. Altcoins refer to all cryptocurrencies other than Bitcoin.',
      keyTerms: [
        { term: 'Altcoins', definition: 'All cryptocurrencies other than Bitcoin.' },
        { term: 'Utility Tokens', definition: 'Tokens that provide access to a product or service.' },
        { term: 'Stablecoins', definition: 'Cryptocurrencies pegged to a stable asset like the US dollar.' }
      ]
    },
    {
      id: '3',
      title: 'Tokenomics Explained',
      content: 'Tokenomics refers to the economic model of a cryptocurrency. It includes factors like total supply, distribution, inflation rate, and use cases. Effective tokenomics can incentivize network participation and maintain price stability. Token emission schedules determine how new tokens are introduced into circulation.',
      keyTerms: [
        { term: 'Tokenomics', definition: 'The economic model of a cryptocurrency.' },
        { term: 'Total Supply', definition: 'The maximum number of tokens that will ever exist.' },
        { term: 'Token Emission', definition: 'The process of introducing new tokens into circulation.' }
      ]
    },
    {
      id: '4',
      title: 'Market Dynamics',
      content: 'Cryptocurrency markets are highly volatile and influenced by factors like market sentiment, regulatory news, technological developments, and macroeconomic conditions. Market capitalization is calculated by multiplying the current price by the total circulating supply. Liquidity measures how easily tokens can be bought or sold without affecting the price.',
      keyTerms: [
        { term: 'Market Cap', definition: 'Price multiplied by circulating supply.' },
        { term: 'Liquidity', definition: 'How easily an asset can be bought or sold without affecting price.' },
        { term: 'Volatility', definition: 'The degree of variation in trading prices over time.' }
      ]
    },
    {
      id: '5',
      title: 'Key Takeaways & Quiz Prep',
      content: 'Cryptocurrencies represent a fundamental shift in how we think about money and value transfer. Understanding tokenomics is crucial for evaluating the long-term viability of different cryptocurrencies. Key considerations include utility, adoption, and the economic model behind each token.',
      keyTerms: [
        { term: 'Store of Value', definition: 'An asset that maintains its value over time.' },
        { term: 'Medium of Exchange', definition: 'An intermediary used to facilitate transactions.' },
        { term: 'Network Effects', definition: 'The phenomenon where a product becomes more valuable as more people use it.' }
      ]
    }
  ],
  'smart-contracts': [
    {
      id: '1',
      title: 'Smart Contract Basics',
      content: 'Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries. Smart contracts run on blockchain networks, making them immutable and transparent.',
      keyTerms: [
        { term: 'Smart Contract', definition: 'Self-executing contracts with terms written into code.' },
        { term: 'Self-executing', definition: 'Automatically executes when conditions are met.' },
        { term: 'Conditions', definition: 'Predetermined requirements for contract execution.' }
      ]
    },
    {
      id: '2',
      title: 'Web3 Development Concepts',
      content: 'Web3 development involves creating decentralized applications (dApps) that run on blockchain networks. Unlike traditional web2 applications, dApps are decentralized, transparent, and user-controlled. Developers use languages like Solidity for Ethereum to write smart contracts.',
      keyTerms: [
        { term: 'dApp', definition: 'Decentralized Application running on a blockchain.' },
        { term: 'Solidity', definition: 'Programming language for writing smart contracts on Ethereum.' },
        { term: 'Decentralized', definition: 'Operating without a central authority.' }
      ]
    },
    {
      id: '3',
      title: 'Common Smart Contract Patterns',
      content: 'Smart contracts commonly implement patterns like ownership (defining who can modify the contract), access control (determining who can use functions), and upgradability (allowing contract improvements). Oracles provide external data to smart contracts since they are isolated from the internet.',
      keyTerms: [
        { term: 'Ownership', definition: 'Determining who can modify the contract.' },
        { term: 'Oracle', definition: 'A service that provides external data to smart contracts.' },
        { term: 'Access Control', definition: 'Determining who can use specific functions.' }
      ]
    },
    {
      id: '4',
      title: 'Security Considerations',
      content: 'Smart contract security is critical since deployed contracts are immutable. Common vulnerabilities include reentrancy attacks, integer overflow/underflow, and gas optimization issues. Best practices include formal verification, code auditing, and following established security patterns.',
      keyTerms: [
        { term: 'Reentrancy Attack', definition: 'Exploiting a contract to make multiple external calls.' },
        { term: 'Formal Verification', definition: 'Mathematical method to prove code correctness.' },
        { term: 'Code Auditing', definition: 'Systematic review of smart contract code for vulnerabilities.' }
      ]
    },
    {
      id: '5',
      title: 'Real-World Applications',
      content: 'Smart contracts power various applications including DeFi protocols, NFTs, supply chain management, and voting systems. They enable programmable money and automated business logic that executes without intermediaries. As Web3 adoption grows, smart contracts will power an increasing range of applications.',
      keyTerms: [
        { term: 'Programmable Money', definition: 'Money that can be automatically controlled through code.' },
        { term: 'Supply Chain', definition: 'Tracking products from creation to delivery.' },
        { term: 'Automated Business Logic', definition: 'Business rules that execute without manual intervention.' }
      ]
    }
  ],
  'nfts': [
    {
      id: '1',
      title: 'What are NFTs?',
      content: 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items or content on a blockchain. Unlike cryptocurrencies, each NFT is unique and cannot be exchanged on a one-to-one basis. NFTs can represent art, music, videos, virtual real estate, and other digital assets.',
      keyTerms: [
        { term: 'NFT', definition: 'Non-Fungible Token - a unique digital asset representing ownership.' },
        { term: 'Fungible', definition: 'Interchangeable items of the same type.' },
        { term: 'Unique', definition: 'Each token has distinct properties.' }
      ]
    },
    {
      id: '2',
      title: 'NFT Standards',
      content: 'Most NFTs are built using standards like ERC-721 and ERC-1155 on Ethereum. ERC-721 is for unique tokens, while ERC-1155 allows for both unique and fungible tokens in the same contract. These standards ensure interoperability across different platforms and exchanges.',
      keyTerms: [
        { term: 'ERC-721', definition: 'The standard for unique NFTs on Ethereum.' },
        { term: 'ERC-1155', definition: 'A standard supporting both unique and fungible tokens.' },
        { term: 'Interoperability', definition: 'The ability to work across different platforms.' }
      ]
    },
    {
      id: '3',
      title: 'NFT Use Cases',
      content: 'NFTs have diverse applications including digital art, gaming items, collectibles, virtual real estate, and identity verification. They enable creators to monetize their work directly and provide verifiable proof of ownership. NFTs are also used in gaming to represent unique items and characters.',
      keyTerms: [
        { term: 'Digital Art', definition: 'Art created and sold as NFTs.' },
        { term: 'Gaming Items', definition: 'Virtual items in games represented as NFTs.' },
        { term: 'Verifiable Ownership', definition: 'Proof of ownership recorded on the blockchain.' }
      ]
    },
    {
      id: '4',
      title: 'Marketplaces and Ecosystem',
      content: 'Popular NFT marketplaces include OpenSea, Rarible, and Foundation. These platforms allow creators to mint and sell NFTs, and buyers to purchase them. The NFT ecosystem includes artists, collectors, developers, and platforms working together to create value.',
      keyTerms: [
        { term: 'OpenSea', definition: 'The largest NFT marketplace.' },
        { term: 'Minting', definition: 'Creating NFTs on the blockchain.' },
        { term: 'Marketplace', definition: 'Platform for buying and selling NFTs.' }
      ]
    },
    {
      id: '5',
      title: 'Future of NFTs',
      content: 'NFTs continue to evolve beyond digital art into areas like real estate, ticketing, education credentials, and intellectual property. The technology is being explored for use in verifying authenticity and provenance of physical items as well. As adoption grows, NFTs may become integral to digital identity and ownership.',
      keyTerms: [
        { term: 'Provenance', definition: 'The history of ownership of an item.' },
        { term: 'Digital Identity', definition: 'Representation of identity in digital form.' },
        { term: 'Intellectual Property', definition: 'Creations of the mind that can be owned.' }
      ]
    }
  ],
  'consensus': [
    {
      id: '1',
      title: 'Introduction to Consensus Mechanisms',
      content: 'Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the state of the ledger. They are essential for maintaining the integrity and security of the blockchain. The most common mechanisms are Proof of Work (PoW) and Proof of Stake (PoS).',
      keyTerms: [
        { term: 'Consensus Mechanism', definition: 'Protocol ensuring agreement on ledger state.' },
        { term: 'Node', definition: 'A computer participating in the blockchain network.' },
        { term: 'Ledger', definition: 'A record of all transactions in the blockchain.' }
      ]
    },
    {
      id: '2',
      title: 'Proof of Work (PoW)',
      content: 'PoW requires miners to solve complex mathematical problems to validate transactions and add new blocks to the blockchain. Miners compete to solve the problem, and the first to do so gets the right to add the next block and earn rewards. Bitcoin uses PoW consensus.',
      keyTerms: [
        { term: 'Miner', definition: 'A participant who validates transactions in PoW.' },
        { term: 'Hash Rate', definition: 'The computing power used in mining.' },
        { term: 'Difficulty Adjustment', definition: 'Adjusting the problem complexity based on network power.' }
      ]
    },
    {
      id: '3',
      title: 'Proof of Stake (PoS)',
      content: 'PoS selects validators based on the number of tokens they hold and are willing to "stake" as collateral. Validators are chosen randomly with higher stakes having better chances. PoS is more energy-efficient than PoW and is used by Ethereum 2.0.',
      keyTerms: [
        { term: 'Validator', definition: 'A participant who validates transactions in PoS.' },
        { term: 'Staking', definition: 'Locking tokens as collateral to participate in validation.' },
        { term: 'Slashing', definition: 'Penalty for validator misbehavior.' }
      ]
    },
    {
      id: '4',
      title: 'Other Consensus Mechanisms',
      content: 'Other mechanisms include Delegated Proof of Stake (DPoS), where token holders vote for delegates to validate transactions; Proof of Authority (PoA), where validators are known and approved entities; and Practical Byzantine Fault Tolerance (pBFT), which ensures consensus even if some nodes are compromised.',
      keyTerms: [
        { term: 'DPoS', definition: 'Delegated Proof of Stake.' },
        { term: 'PoA', definition: 'Proof of Authority.' },
        { term: 'pBFT', definition: 'Practical Byzantine Fault Tolerance.' }
      ]
    },
    {
      id: '5',
      title: 'Choosing the Right Consensus',
      content: 'Different consensus mechanisms offer trade-offs in terms of security, scalability, and energy efficiency. PoW provides strong security but consumes more energy, while PoS offers efficiency with potential security trade-offs. The choice depends on the specific needs of the blockchain.',
      keyTerms: [
        { term: 'Security', definition: 'Resistance to attacks and fraud.' },
        { term: 'Scalability', definition: 'Ability to handle many transactions quickly.' },
        { term: 'Energy Efficiency', definition: 'Lower power consumption.' }
      ]
    }
  ],
  'ethereum-l2': [
    {
      id: '1',
      title: 'Ethereum Basics',
      content: 'Ethereum is a decentralized blockchain platform that enables smart contracts and decentralized applications (dApps). It is the second-largest cryptocurrency by market cap after Bitcoin. Ethereum introduced programmable blockchain functionality, allowing developers to build and deploy smart contracts and dApps.',
      keyTerms: [
        { term: 'Ethereum', definition: 'A blockchain platform enabling smart contracts and dApps.' },
        { term: 'Smart Contracts', definition: 'Self-executing contracts with terms written in code.' },
        { term: 'dApps', definition: 'Decentralized Applications running on blockchain.' }
      ]
    },
    {
      id: '2',
      title: 'Scalability Challenges',
      content: 'Ethereum faces scalability issues with high gas fees and slow transaction speeds during network congestion. The network can only process about 15 transactions per second, significantly less than traditional payment systems. This has led to the development of Layer 2 solutions to improve scalability.',
      keyTerms: [
        { term: 'Gas Fees', definition: 'Fees paid by users to execute transactions on Ethereum.' },
        { term: 'Network Congestion', definition: 'High demand causing slow transaction processing.' },
        { term: 'Throughput', definition: 'Number of transactions processed per second.' }
      ]
    },
    {
      id: '3',
      title: 'Layer 2 Solutions Overview',
      content: 'Layer 2 (L2) solutions are protocols built on top of Ethereum to improve scalability and reduce costs. They handle transactions off the main Ethereum chain and periodically submit batched results back to Layer 1. Popular L2 solutions include Optimistic Rollups, ZK-Rollups, and sidechains.',
      keyTerms: [
        { term: 'Layer 2', definition: 'Solutions built on top of Ethereum to improve scalability.' },
        { term: 'Rollups', definition: 'Technology that bundles transactions off-chain.' },
        { term: 'Sidechains', definition: 'Independent blockchains connected to Ethereum.' }
      ]
    },
    {
      id: '4',
      title: 'Types of L2 Solutions',
      content: 'Optimistic Rollups assume transactions are valid and only run computation in case of fraud challenges. ZK-Rollups use zero-knowledge proofs to validate batches of transactions before submitting to Layer 1. Sidechains like Polygon operate as separate blockchains with their own consensus mechanisms but connected to Ethereum.',
      keyTerms: [
        { term: 'Optimistic Rollups', definition: 'Rollups that assume validity with fraud proofs.' },
        { term: 'ZK-Rollups', definition: 'Rollups using zero-knowledge proofs for validation.' },
        { term: 'Polygon', definition: 'Popular sidechain solution for Ethereum.' }
      ]
    },
    {
      id: '5',
      title: 'Future of Ethereum Scaling',
      content: 'Ethereum 2.0, also known as the Merge, transitioned from Proof of Work to Proof of Stake to improve scalability and sustainability. The future includes sharding, which will further increase capacity by splitting the network into multiple chains. L2 solutions will continue to complement these improvements.',
      keyTerms: [
        { term: 'Ethereum 2.0', definition: 'Upgrade to Ethereum focusing on PoS and scalability.' },
        { term: 'The Merge', definition: 'Transition from PoW to PoS consensus.' },
        { term: 'Sharding', definition: 'Splitting the network into multiple chains to increase capacity.' }
      ]
    }
  ]
};

// Quiz questions for all 8 topics (10 per topic)
const QUIZ_QUESTIONS: QuizQuestion[] = [
  // DeFi Questions
  {
    id: 'defi-1',
    topicId: 'defi',
    questionNumber: 1,
    question: 'What does DEX stand for?',
    options: [
      { id: 'a', label: 'A', text: 'Decentralized Exchange' },
      { id: 'b', label: 'B', text: 'Digital Exchange' },
      { id: 'c', label: 'C', text: 'Direct Exchange' },
      { id: 'd', label: 'D', text: 'Distributed Exchange' }
    ],
    correctOptionId: 'a',
    explanation: 'DEX stands for Decentralized Exchange. These platforms facilitate trading of cryptocurrencies without a central authority, allowing users to trade directly from their wallets.',
    difficulty: 'Easy'
  },
  {
    id: 'defi-2',
    topicId: 'defi',
    questionNumber: 2,
    question: 'Which protocol is known for lending and borrowing?',
    options: [
      { id: 'a', label: 'A', text: 'Aave' },
      { id: 'b', label: 'B', text: 'Uniswap' },
      { id: 'c', label: 'C', text: 'OpenSea' },
      { id: 'd', label: 'D', text: 'Chainlink' }
    ],
    correctOptionId: 'a',
    explanation: 'Aave is a well-known DeFi protocol specializing in lending and borrowing of cryptocurrencies. It allows users to earn interest on deposits and borrow assets.',
    difficulty: 'Easy'
  },
  {
    id: 'defi-3',
    topicId: 'defi',
    questionNumber: 3,
    question: 'What is slippage in DeFi?',
    options: [
      { id: 'a', label: 'A', text: 'The difference between expected and actual transaction price' },
      { id: 'b', label: 'B', text: 'A type of DeFi token' },
      { id: 'c', label: 'C', text: 'The fee paid for transactions' },
      { id: 'd', label: 'D', text: 'The speed of transactions' }
    ],
    correctOptionId: 'a',
    explanation: 'Slippage refers to the difference between the expected price of a trade and the price at which the trade is executed. It occurs due to market volatility or low liquidity in trading pairs.',
    difficulty: 'Medium'
  },
  {
    id: 'defi-4',
    topicId: 'defi',
    questionNumber: 4,
    question: 'What is impermanent loss?',
    options: [
      { id: 'a', label: 'A', text: 'Loss from price divergence in liquidity pools' },
      { id: 'b', label: 'B', text: 'Loss from hacks or exploits' },
      { id: 'c', label: 'C', text: 'Loss from high gas fees' },
      { id: 'd', label: 'D', text: 'Loss from market manipulation' }
    ],
    correctOptionId: 'a',
    explanation: 'Impermanent loss occurs when the price of tokens in a liquidity pool changes compared to when they were deposited, potentially resulting in less value than holding the tokens outright.',
    difficulty: 'Medium'
  },
  {
    id: 'defi-5',
    topicId: 'defi',
    questionNumber: 5,
    question: 'In a Uniswap liquidity pool, why do liquidity providers face impermanent loss?',
    options: [
      { id: 'a', label: 'A', text: 'Due to price divergence from the rebalancing mechanism' },
      { id: 'b', label: 'B', text: 'Due to high transaction fees' },
      { id: 'c', label: 'C', text: 'Due to smart contract vulnerabilities' },
      { id: 'd', label: 'D', text: 'Due to the time-weighted average price calculation' }
    ],
    correctOptionId: 'a',
    explanation: 'Liquidity providers face impermanent loss due to the rebalancing mechanism of the constant product formula (x*y=k), which causes the pool to sell the appreciating asset and buy the depreciating asset, leading to price divergence.',
    difficulty: 'Hard'
  },
  {
    id: 'defi-6',
    topicId: 'defi',
    questionNumber: 6,
    question: 'What is yield farming?',
    options: [
      { id: 'a', label: 'A', text: 'Earning rewards by providing liquidity to protocols' },
      { id: 'b', label: 'B', text: 'Growing food with cryptocurrency' },
      { id: 'c', label: 'C', text: 'Mining cryptocurrency' },
      { id: 'd', label: 'D', text: 'Buying agricultural tokens' }
    ],
    correctOptionId: 'a',
    explanation: 'Yield farming is the practice of earning rewards by providing liquidity to DeFi protocols. Users deposit assets into liquidity pools to earn fees and governance tokens.',
    difficulty: 'Medium'
  },
  {
    id: 'defi-7',
    topicId: 'defi',
    questionNumber: 7,
    question: 'What is a flash loan?',
    options: [
      { id: 'a', label: 'A', text: 'A loan that must be repaid within the same block transaction' },
      { id: 'b', label: 'B', text: 'A loan with very high interest rates' },
      { id: 'c', label: 'C', text: 'A loan that can only be taken using flash wallets' },
      { id: 'd', label: 'D', text: 'A loan that is instantly approved' }
    ],
    correctOptionId: 'a',
    explanation: 'A flash loan is a type of loan that allows borrowing without collateral, provided the loan and fees are repaid within the same transaction block. If not repaid, the entire transaction reverts.',
    difficulty: 'Hard'
  },
  {
    id: 'defi-8',
    topicId: 'defi',
    questionNumber: 8,
    question: 'What does APY stand for in DeFi?',
    options: [
      { id: 'a', label: 'A', text: 'Annual Percentage Yield' },
      { id: 'b', label: 'B', text: 'Annual Profit Yield' },
      { id: 'c', label: 'C', text: 'Asset Percentage Yield' },
      { id: 'd', label: 'D', text: 'Actual Profit Yield' }
    ],
    correctOptionId: 'a',
    explanation: 'APY stands for Annual Percentage Yield, which represents the real rate of return earned on an investment after accounting for compounding interest over a year.',
    difficulty: 'Easy'
  },
  {
    id: 'defi-9',
    topicId: 'defi',
    questionNumber: 9,
    question: 'What is a stablecoin?',
    options: [
      { id: 'a', label: 'A', text: 'A cryptocurrency designed to maintain a stable value' },
      { id: 'b', label: 'B', text: 'A cryptocurrency used for storing value' },
      { id: 'c', label: 'C', text: 'A cryptocurrency that does not fluctuate in price' },
      { id: 'd', label: 'D', text: 'A cryptocurrency backed by physical assets' }
    ],
    correctOptionId: 'a',
    explanation: 'A stablecoin is a type of cryptocurrency designed to maintain a stable value relative to a reference asset, typically a fiat currency like the US dollar.',
    difficulty: 'Easy'
  },
  {
    id: 'defi-10',
    topicId: 'defi',
    questionNumber: 10,
    question: 'Which of the following is NOT a common DeFi risk?',
    options: [
      { id: 'a', label: 'A', text: 'Government regulation' },
      { id: 'b', label: 'B', text: 'Smart contract vulnerabilities' },
      { id: 'c', label: 'C', text: 'Impermanent loss' },
      { id: 'd', label: 'D', text: 'Rug pulls' }
    ],
    correctOptionId: 'a',
    explanation: 'While government regulation can impact DeFi, it is not considered a direct DeFi risk in the same category as technical risks like smart contract vulnerabilities, impermanent loss, or rug pulls.',
    difficulty: 'Hard'
  },

  // Blockchain Fundamentals Questions
  {
    id: 'blockchain-1',
    topicId: 'blockchain-fundamentals',
    questionNumber: 1,
    question: 'What is the primary feature that makes blockchain secure?',
    options: [
      { id: 'a', label: 'A', text: 'Cryptographic hashing' },
      { id: 'b', label: 'B', text: 'High transaction fees' },
      { id: 'c', label: 'C', text: 'Fast processing times' },
      { id: 'd', label: 'D', text: 'Centralized control' }
    ],
    correctOptionId: 'a',
    explanation: 'Cryptographic hashing is the primary feature that makes blockchain secure. It creates a unique digital fingerprint for each block that changes if any data is altered.',
    difficulty: 'Easy'
  },
  {
    id: 'blockchain-2',
    topicId: 'blockchain-fundamentals',
    questionNumber: 2,
    question: 'Who validates transactions on a blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'Network nodes' },
      { id: 'b', label: 'B', text: 'Central banks' },
      { id: 'c', label: 'C', text: 'Individual users' },
      { id: 'd', label: 'D', text: 'Government agencies' }
    ],
    correctOptionId: 'a',
    explanation: 'Network nodes validate transactions on a blockchain. These are computers that participate in the blockchain network by verifying and relaying transactions.',
    difficulty: 'Easy'
  },
  {
    id: 'blockchain-3',
    topicId: 'blockchain-fundamentals',
    questionNumber: 3,
    question: 'What does the term "immutability" mean in blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'Data cannot be changed once added to the blockchain' },
      { id: 'b', label: 'B', text: 'Data changes frequently' },
      { id: 'c', label: 'C', text: 'Data is encrypted' },
      { id: 'd', label: 'D', text: 'Data has a fixed size' }
    ],
    correctOptionId: 'a',
    explanation: 'Immutability in blockchain means that once data is added to the blockchain, it cannot be altered or deleted, making the record permanent and tamper-proof.',
    difficulty: 'Medium'
  },
  {
    id: 'blockchain-4',
    topicId: 'blockchain-fundamentals',
    questionNumber: 4,
    question: 'What is a "block" in blockchain terminology?',
    options: [
      { id: 'a', label: 'A', text: 'A collection of transactions' },
      { id: 'b', label: 'B', text: 'A single transaction' },
      { id: 'c', label: 'C', text: 'A network node' },
      { id: 'd', label: 'D', text: 'A cryptocurrency' }
    ],
    correctOptionId: 'a',
    explanation: 'A block in blockchain is a collection of transactions that are bundled together and added to the blockchain. Each block contains a reference to the previous block, creating the chain.',
    difficulty: 'Easy'
  },
  {
    id: 'blockchain-5',
    topicId: 'blockchain-fundamentals',
    questionNumber: 5,
    question: 'What is the main purpose of consensus mechanisms in blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'To ensure agreement on the state of the ledger' },
      { id: 'b', label: 'B', text: 'To increase transaction fees' },
      { id: 'c', label: 'C', text: 'To reduce block size' },
      { id: 'd', label: 'D', text: 'To limit network access' }
    ],
    correctOptionId: 'a',
    explanation: 'Consensus mechanisms ensure that all nodes in a blockchain network agree on the state of the ledger. This is essential for maintaining the integrity and security of the blockchain.',
    difficulty: 'Medium'
  },
  {
    id: 'blockchain-6',
    topicId: 'blockchain-fundamentals',
    questionNumber: 6,
    question: 'What is the "genesis block"?',
    options: [
      { id: 'a', label: 'A', text: 'The first block in a blockchain' },
      { id: 'b', label: 'B', text: 'The block with the most transactions' },
      { id: 'c', label: 'C', text: 'The most valuable block' },
      { id: 'd', label: 'D', text: 'The block that ends a chain' }
    ],
    correctOptionId: 'a',
    explanation: 'The genesis block is the first block in any blockchain. It is the foundation upon which all subsequent blocks are built.',
    difficulty: 'Medium'
  },
  {
    id: 'blockchain-7',
    topicId: 'blockchain-fundamentals',
    questionNumber: 7,
    question: 'What is "double-spending" in the context of blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'Spending the same cryptocurrency twice' },
      { id: 'b', label: 'B', text: 'Spending twice the amount needed' },
      { id: 'c', label: 'C', text: 'Spending on two different platforms' },
      { id: 'd', label: 'D', text: 'Spending that occurs twice daily' }
    ],
    correctOptionId: 'a',
    explanation: 'Double-spending is a potential problem in digital currencies where the same funds could be spent more than once. Blockchain technology solves this by maintaining a tamper-proof ledger.',
    difficulty: 'Hard'
  },
  {
    id: 'blockchain-8',
    topicId: 'blockchain-fundamentals',
    questionNumber: 8,
    question: 'What is a "private key" in blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'A secret code that allows access to your cryptocurrency' },
      { id: 'b', label: 'B', text: 'A public identifier for your wallet' },
      { id: 'c', label: 'C', text: 'A password for blockchain software' },
      { id: 'd', label: 'D', text: 'A code to access blockchain data' }
    ],
    correctOptionId: 'a',
    explanation: 'A private key is a secret code that allows access to your cryptocurrency. It must be kept secure as anyone with your private key can access your funds.',
    difficulty: 'Medium'
  },
  {
    id: 'blockchain-9',
    topicId: 'blockchain-fundamentals',
    questionNumber: 9,
    question: 'What is a "public key" in blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'An address that others can use to send you cryptocurrency' },
      { id: 'b', label: 'B', text: 'A public record of your transactions' },
      { id: 'c', label: 'C', text: 'A public code to access blockchain data' },
      { id: 'd', label: 'D', text: 'A shared password for blockchain access' }
    ],
    correctOptionId: 'a',
    explanation: 'A public key is an address that others can use to send you cryptocurrency. It is derived from your private key but does not reveal it.',
    difficulty: 'Medium'
  },
  {
    id: 'blockchain-10',
    topicId: 'blockchain-fundamentals',
    questionNumber: 10,
    question: 'What is the purpose of mining in Proof of Work blockchains?',
    options: [
      { id: 'a', label: 'A', text: 'To validate transactions and add new blocks to the chain' },
      { id: 'b', label: 'B', text: 'To create new cryptocurrencies' },
      { id: 'c', label: 'C', text: 'To store data on the blockchain' },
      { id: 'd', label: 'D', text: 'To secure the network against attacks' }
    ],
    correctOptionId: 'a',
    explanation: 'In Proof of Work blockchains, mining serves to validate transactions and add new blocks to the chain. Miners solve complex mathematical problems to earn the right to add the next block and receive rewards.',
    difficulty: 'Hard'
  },

  // DAO Questions
  {
    id: 'daos-1',
    topicId: 'daos',
    questionNumber: 1,
    question: 'What does DAO stand for?',
    options: [
      { id: 'a', label: 'A', text: 'Decentralized Autonomous Organization' },
      { id: 'b', label: 'B', text: 'Decentralized Automatic Operations' },
      { id: 'c', label: 'C', text: 'Distributed Autonomous Organization' },
      { id: 'd', label: 'D', text: 'Decentralized Authority Operations' }
    ],
    correctOptionId: 'a',
    explanation: 'DAO stands for Decentralized Autonomous Organization - an organization governed by rules encoded in smart contracts rather than traditional management structures.',
    difficulty: 'Easy'
  },
  {
    id: 'daos-2',
    topicId: 'daos',
    questionNumber: 2,
    question: 'How do DAO members typically make decisions?',
    options: [
      { id: 'a', label: 'A', text: 'Through voting with governance tokens' },
      { id: 'b', label: 'B', text: 'Through majority rule by participation' },
      { id: 'c', label: 'C', text: 'Through elected representatives' },
      { id: 'd', label: 'D', text: 'Through smart contract execution' }
    ],
    correctOptionId: 'a',
    explanation: 'DAO members make decisions through voting with governance tokens. Token holders can vote on proposals, with voting power typically proportional to the number of tokens held.',
    difficulty: 'Easy'
  },
  {
    id: 'daos-3',
    topicId: 'daos',
    questionNumber: 3,
    question: 'What is a common use of DAOs?',
    options: [
      { id: 'a', label: 'A', text: 'Governance of DeFi protocols' },
      { id: 'b', label: 'B', text: 'Storing cryptocurrency' },
      { id: 'c', label: 'C', text: 'Mining cryptocurrencies' },
      { id: 'd', label: 'D', text: 'Creating smart contracts' }
    ],
    correctOptionId: 'a',
    explanation: 'DAOs are commonly used for the governance of DeFi protocols, allowing token holders to vote on protocol upgrades, parameter changes, and other important decisions.',
    difficulty: 'Medium'
  },
  {
    id: 'daos-4',
    topicId: 'daos',
    questionNumber: 4,
    question: 'Which of these is an example of a DAO?',
    options: [
      { id: 'a', label: 'A', text: 'MakerDAO' },
      { id: 'b', label: 'B', text: 'Bitcoin' },
      { id: 'c', label: 'C', text: 'Ethereum' },
      { id: 'd', label: 'D', text: 'Uniswap' }
    ],
    correctOptionId: 'a',
    explanation: 'MakerDAO is a prominent example of a DAO that governs the DAI stablecoin protocol. It allows MKR token holders to vote on changes to the protocol.',
    difficulty: 'Medium'
  },
  {
    id: 'daos-5',
    topicId: 'daos',
    questionNumber: 5,
    question: 'What is "governance token" in a DAO context?',
    options: [
      { id: 'a', label: 'A', text: 'A token that gives holders voting rights in DAO decisions' },
      { id: 'b', label: 'B', text: 'A token used for transactions within the DAO' },
      { id: 'c', label: 'C', text: 'A token that represents value stored in the DAO' },
      { id: 'd', label: 'D', text: 'A token that provides access to DAO services' }
    ],
    correctOptionId: 'a',
    explanation: 'A governance token gives holders voting rights in DAO decisions. The more tokens a member holds, the more voting power they typically have in governance proposals.',
    difficulty: 'Medium'
  },
  {
    id: 'daos-6',
    topicId: 'daos',
    questionNumber: 6,
    question: 'What is a "proposal" in a DAO?',
    options: [
      { id: 'a', label: 'A', text: 'A suggestion for a change or action in the DAO' },
      { id: 'b', label: 'B', text: 'A new governance token' },
      { id: 'c', label: 'C', text: 'A financial request from the DAO' },
      { id: 'd', label: 'D', text: 'A meeting agenda item' }
    ],
    correctOptionId: 'a',
    explanation: 'A proposal in a DAO is a suggestion for a change or action that members can vote on. Proposals can include protocol upgrades, parameter changes, or treasury allocations.',
    difficulty: 'Hard'
  },
  {
    id: 'daos-7',
    topicId: 'daos',
    questionNumber: 7,
    question: 'What is "quorum" in DAO governance?',
    options: [
      { id: 'a', label: 'A', text: 'The minimum number of votes required for a proposal to be valid' },
      { id: 'b', label: 'B', text: 'The maximum number of proposals a DAO can have' },
      { id: 'c', label: 'C', text: 'The total number of governance tokens in circulation' },
      { id: 'd', label: 'D', text: 'The number of members in the DAO' }
    ],
    correctOptionId: 'a',
    explanation: 'Quorum in DAO governance is the minimum number of votes required for a proposal to be valid. If quorum is not reached, the proposal fails regardless of the voting outcome.',
    difficulty: 'Hard'
  },
  {
    id: 'daos-8',
    topicId: 'daos',
    questionNumber: 8,
    question: 'What is a common challenge faced by DAOs?',
    options: [
      { id: 'a', label: 'A', text: 'Voter apathy and low participation' },
      { id: 'b', label: 'B', text: 'Too many proposals being made' },
      { id: 'c', label: 'C', text: 'High transaction fees' },
      { id: 'd', label: 'D', text: 'Lack of transparency' }
    ],
    correctOptionId: 'a',
    explanation: 'A common challenge faced by DAOs is voter apathy and low participation. This can result in governance decisions being made by a small subset of token holders.',
    difficulty: 'Medium'
  },
  {
    id: 'daos-9',
    topicId: 'daos',
    questionNumber: 9,
    question: 'What is "delegated governance" in a DAO?',
    options: [
      { id: 'a', label: 'A', text: 'Allowing token holders to delegate their voting power to others' },
      { id: 'b', label: 'B', text: 'Deciding governance rules ahead of time' },
      { id: 'c', label: 'C', text: 'Delegating administrative tasks to a subset of members' },
      { id: 'd', label: 'D', text: 'Allowing external entities to govern the DAO' }
    ],
    correctOptionId: 'a',
    explanation: 'Delegated governance allows token holders to delegate their voting power to others they trust. This can help address voter apathy and improve participation in DAO governance.',
    difficulty: 'Hard'
  },
  {
    id: 'daos-10',
    topicId: 'daos',
    questionNumber: 10,
    question: 'What is a "treasury" in a DAO?',
    options: [
      { id: 'a', label: 'A', text: 'The collective funds managed by the DAO' },
      { id: 'b', label: 'B', text: 'The DAO\'s cryptocurrency holdings' },
      { id: 'c', label: 'C', text: 'The DAO\'s smart contract code' },
      { id: 'd', label: 'D', text: 'The DAO\'s governance tokens' }
    ],
    correctOptionId: 'a',
    explanation: 'A treasury in a DAO is the collective funds managed by the DAO. These funds can be used for development, grants, partnerships, and other organizational activities.',
    difficulty: 'Medium'
  },

  // Cryptocurrency Questions
  {
    id: 'crypto-1',
    topicId: 'cryptocurrencies',
    questionNumber: 1,
    question: 'What is the first cryptocurrency?',
    options: [
      { id: 'a', label: 'A', text: 'Bitcoin' },
      { id: 'b', label: 'B', text: 'Ethereum' },
      { id: 'c', label: 'C', text: 'Litecoin' },
      { id: 'd', label: 'D', text: 'Ripple' }
    ],
    correctOptionId: 'a',
    explanation: 'Bitcoin was the first cryptocurrency, launched in 2009 by an unknown person or group using the name Satoshi Nakamoto.',
    difficulty: 'Easy'
  },
  {
    id: 'crypto-2',
    topicId: 'cryptocurrencies',
    questionNumber: 2,
    question: 'What does "altcoin" refer to?',
    options: [
      { id: 'a', label: 'A', text: 'All cryptocurrencies other than Bitcoin' },
      { id: 'b', label: 'B', text: 'Cryptocurrencies with alternative uses' },
      { id: 'c', label: 'C', text: 'Cryptocurrencies that are alternatives to Ethereum' },
      { id: 'd', label: 'D', text: 'Cryptocurrencies with alternative consensus mechanisms' }
    ],
    correctOptionId: 'a',
    explanation: 'Altcoin is a combination of "alternative" and "coin", referring to all cryptocurrencies other than Bitcoin.',
    difficulty: 'Easy'
  },
  {
    id: 'crypto-3',
    topicId: 'cryptocurrencies',
    questionNumber: 3,
    question: 'What is a "wallet" in cryptocurrency?',
    options: [
      { id: 'a', label: 'A', text: 'A digital tool to store, send, and receive cryptocurrencies' },
      { id: 'b', label: 'B', text: 'A physical device to store cryptocurrency coins' },
      { id: 'c', label: 'C', text: 'A bank account for cryptocurrencies' },
      { id: 'd', label: 'D', text: 'A portfolio of cryptocurrency investments' }
    ],
    correctOptionId: 'a',
    explanation: 'A cryptocurrency wallet is a digital tool that allows users to store, send, and receive cryptocurrencies. It holds the private and public keys needed to interact with the blockchain.',
    difficulty: 'Easy'
  },
  {
    id: 'crypto-4',
    topicId: 'cryptocurrencies',
    questionNumber: 4,
    question: 'What is "market capitalization" in cryptocurrency?',
    options: [
      { id: 'a', label: 'A', text: 'Current price multiplied by total circulating supply' },
      { id: 'b', label: 'B', text: 'Total number of coins in circulation' },
      { id: 'c', label: 'C', text: 'The change in price over a specific period' },
      { id: 'd', label: 'D', text: 'Total value of all cryptocurrencies combined' }
    ],
    correctOptionId: 'a',
    explanation: 'Market capitalization in cryptocurrency is calculated by multiplying the current price of the coin by its total circulating supply.',
    difficulty: 'Medium'
  },
  {
    id: 'crypto-5',
    topicId: 'cryptocurrencies',
    questionNumber: 5,
    question: 'What is "tokenomics"?',
    options: [
      { id: 'a', label: 'A', text: 'The economic model of a cryptocurrency' },
      { id: 'b', label: 'B', text: 'The trading volume of a token' },
      { id: 'c', label: 'C', text: 'The number of tokens in circulation' },
      { id: 'd', label: 'D', text: 'The technology behind a token' }
    ],
    correctOptionId: 'a',
    explanation: 'Tokenomics refers to the economic model of a cryptocurrency, including factors like total supply, distribution, inflation rate, and use cases.',
    difficulty: 'Medium'
  },
  {
    id: 'crypto-6',
    topicId: 'cryptocurrencies',
    questionNumber: 6,
    question: 'What is a "halving" event in Bitcoin?',
    options: [
      { id: 'a', label: 'A', text: 'The reward for mining Bitcoin is cut in half' },
      { id: 'b', label: 'B', text: 'The price of Bitcoin is cut in half' },
      { id: 'c', label: 'C', text: 'The total supply of Bitcoin is cut in half' },
      { id: 'd', label: 'D', text: 'The time it takes to mine Bitcoin is cut in half' }
    ],
    correctOptionId: 'a',
    explanation: 'A Bitcoin halving is when the reward for mining Bitcoin is cut in half. This occurs approximately every 210,000 blocks to control inflation and limit the total supply of Bitcoin.',
    difficulty: 'Hard'
  },
  {
    id: 'crypto-7',
    topicId: 'cryptocurrencies',
    questionNumber: 7,
    question: 'What is a "hodler" in cryptocurrency culture?',
    options: [
      { id: 'a', label: 'A', text: 'Someone who holds cryptocurrency long-term' },
      { id: 'b', label: 'B', text: 'Someone who actively trades cryptocurrencies' },
      { id: 'c', label: 'C', text: 'Someone who mines cryptocurrency' },
      { id: 'd', label: 'D', text: 'Someone who creates new cryptocurrencies' }
    ],
    correctOptionId: 'a',
    explanation: 'A "hodler" is someone who holds cryptocurrency long-term regardless of price fluctuations. The term originated from a typo of the word "holder" in a Bitcoin forum post.',
    difficulty: 'Easy'
  },
  {
    id: 'crypto-8',
    topicId: 'cryptocurrencies',
    questionNumber: 8,
    question: 'What is the difference between a "coin" and a "token"?',
    options: [
      { id: 'a', label: 'A', text: 'Coins have their own blockchain; tokens are built on existing blockchains' },
      { id: 'b', label: 'B', text: 'Coins are physical; tokens are digital' },
      { id: 'c', label: 'C', text: 'Coins have intrinsic value; tokens do not' },
      { id: 'd', label: 'D', text: 'Coins are used for payments; tokens are for governance' }
    ],
    correctOptionId: 'a',
    explanation: 'Coins have their own native blockchain (like Bitcoin or Ethereum), while tokens are built on existing blockchains (like ERC-20 tokens on Ethereum).',
    difficulty: 'Medium'
  },
  {
    id: 'crypto-9',
    topicId: 'cryptocurrencies',
    questionNumber: 9,
    question: 'What is a "stablecoin"?',
    options: [
      { id: 'a', label: 'A', text: 'A cryptocurrency designed to maintain a stable value' },
      { id: 'b', label: 'B', text: 'A cryptocurrency that does not fluctuate in price' },
      { id: 'c', label: 'C', text: 'A cryptocurrency backed by government funds' },
      { id: 'd', label: 'D', text: 'A cryptocurrency used for storing value' }
    ],
    correctOptionId: 'a',
    explanation: 'A stablecoin is a cryptocurrency designed to maintain a stable value, usually pegged to a traditional asset like the US dollar or gold, to reduce volatility.',
    difficulty: 'Easy'
  },
  {
    id: 'crypto-10',
    topicId: 'cryptocurrencies',
    questionNumber: 10,
    question: 'What is "liquidity" in cryptocurrency markets?',
    options: [
      { id: 'a', label: 'A', text: 'How easily an asset can be bought or sold without affecting price' },
      { id: 'b', label: 'B', text: 'The total amount of cryptocurrency available in the market' },
      { id: 'c', label: 'C', text: 'The speed at which cryptocurrency transactions are processed' },
      { id: 'd', label: 'D', text: 'The amount of money flowing into cryptocurrency markets' }
    ],
    correctOptionId: 'a',
    explanation: 'Liquidity refers to how easily an asset can be bought or sold in the market without significantly affecting its price. High liquidity means there are many buyers and sellers.',
    difficulty: 'Hard'
  },

  // Smart Contracts Questions
  {
    id: 'smart-contracts-1',
    topicId: 'smart-contracts',
    questionNumber: 1,
    question: 'What is a smart contract?',
    options: [
      { id: 'a', label: 'A', text: 'Self-executing contracts with terms written in code' },
      { id: 'b', label: 'B', text: 'Traditional contracts stored digitally' },
      { id: 'c', label: 'C', text: 'Contracts that are automatically renewed' },
      { id: 'd', label: 'D', text: 'Contracts that save money' }
    ],
    correctOptionId: 'a',
    explanation: 'A smart contract is a self-executing contract with the terms of the agreement directly written into code. It automatically executes when predetermined conditions are met.',
    difficulty: 'Easy'
  },
  {
    id: 'smart-contracts-2',
    topicId: 'smart-contracts',
    questionNumber: 2,
    question: 'On which platform are most smart contracts built?',
    options: [
      { id: 'a', label: 'A', text: 'Ethereum' },
      { id: 'b', label: 'B', text: 'Bitcoin' },
      { id: 'c', label: 'C', text: 'Ripple' },
      { id: 'd', label: 'D', text: 'Litecoin' }
    ],
    correctOptionId: 'a',
    explanation: 'Ethereum is the most popular platform for building smart contracts. It introduced programmable blockchain functionality that allows developers to create complex decentralized applications.',
    difficulty: 'Easy'
  },
  {
    id: 'smart-contracts-3',
    topicId: 'smart-contracts',
    questionNumber: 3,
    question: 'What programming language is commonly used for Ethereum smart contracts?',
    options: [
      { id: 'a', label: 'A', text: 'Solidity' },
      { id: 'b', label: 'B', text: 'JavaScript' },
      { id: 'c', label: 'C', text: 'Python' },
      { id: 'd', label: 'D', text: 'Rust' }
    ],
    correctOptionId: 'a',
    explanation: 'Solidity is the most commonly used programming language for writing smart contracts on the Ethereum platform. It is specifically designed for creating smart contracts.',
    difficulty: 'Medium'
  },
  {
    id: 'smart-contracts-4',
    topicId: 'smart-contracts',
    questionNumber: 4,
    question: 'What is a "dApp"?',
    options: [
      { id: 'a', label: 'A', text: 'Decentralized Application running on a blockchain' },
      { id: 'b', label: 'B', text: 'A distributed Application system' },
      { id: 'c', label: 'C', text: 'A data Application protocol' },
      { id: 'd', label: 'D', text: 'A digital Asset platform' }
    ],
    correctOptionId: 'a',
    explanation: 'A dApp (decentralized application) is an application that runs on a blockchain network rather than a centralized server. It uses smart contracts to execute business logic.',
    difficulty: 'Easy'
  },
  {
    id: 'smart-contracts-5',
    topicId: 'smart-contracts',
    questionNumber: 5,
    question: 'What is "gas" in Ethereum smart contracts?',
    options: [
      { id: 'a', label: 'A', text: 'A fee paid to execute transactions and smart contracts' },
      { id: 'b', label: 'B', text: 'The speed at which a smart contract executes' },
      { id: 'c', label: 'C', text: 'A type of smart contract vulnerability' },
      { id: 'd', label: 'D', text: 'A cryptocurrency used in smart contracts' }
    ],
    correctOptionId: 'a',
    explanation: 'Gas is the fee paid to execute transactions and smart contracts on the Ethereum network. It compensates miners for the computational resources required to process the transaction.',
    difficulty: 'Medium'
  },
  {
    id: 'smart-contracts-6',
    topicId: 'smart-contracts',
    questionNumber: 6,
    question: 'What is a "reentrancy attack"?',
    options: [
      { id: 'a', label: 'A', text: 'When a contract calls back into itself before updating balances' },
      { id: 'b', label: 'B', text: 'When a contract is accessed by multiple users simultaneously' },
      { id: 'c', label: 'C', text: 'When a contract is re-deployed multiple times' },
      { id: 'd', label: 'D', text: 'When a contract is called recursively many times' }
    ],
    correctOptionId: 'a',
    explanation: 'A reentrancy attack occurs when a malicious contract calls back into the original contract before the first call is finished, potentially manipulating the contract state to steal funds.',
    difficulty: 'Hard'
  },
  {
    id: 'smart-contracts-7',
    topicId: 'smart-contracts',
    questionNumber: 7,
    question: 'What is an "oracle" in smart contracts?',
    options: [
      { id: 'a', label: 'A', text: 'A service that provides external data to smart contracts' },
      { id: 'b', label: 'B', text: 'A smart contract that manages other smart contracts' },
      { id: 'c', label: 'C', text: 'An advanced smart contract developer' },
      { id: 'd', label: 'D', text: 'A testing environment for smart contracts' }
    ],
    correctOptionId: 'a',
    explanation: 'An oracle is a service that provides external data to smart contracts. Since smart contracts are isolated from the internet, oracles allow them to interact with real-world data.',
    difficulty: 'Medium'
  },
  {
    id: 'smart-contracts-8',
    topicId: 'smart-contracts',
    questionNumber: 8,
    question: 'What is "formal verification" in smart contract development?',
    options: [
      { id: 'a', label: 'A', text: 'Using mathematical methods to prove code correctness' },
      { id: 'b', label: 'B', text: 'Having a legal expert review the contract' },
      { id: 'c', label: 'C', text: 'Testing the contract with real funds' },
      { id: 'd', label: 'D', text: 'Publishing the contract code publicly' }
    ],
    correctOptionId: 'a',
    explanation: 'Formal verification is a method of mathematically proving that a smart contract performs as intended. It helps identify potential vulnerabilities and ensure correctness.',
    difficulty: 'Hard'
  },
  {
    id: 'smart-contracts-9',
    topicId: 'smart-contracts',
    questionNumber: 9,
    question: 'What does "immutable" mean in the context of smart contracts?',
    options: [
      { id: 'a', label: 'A', text: 'Cannot be changed once deployed' },
      { id: 'b', label: 'B', text: 'Cannot be executed' },
      { id: 'c', label: 'C', text: 'Cannot be accessed' },
      { id: 'd', label: 'D', text: 'Cannot be read' }
    ],
    correctOptionId: 'a',
    explanation: 'Smart contracts are immutable once deployed, meaning their code cannot be changed. This ensures security and predictability but also means that any errors in the code cannot be fixed.',
    difficulty: 'Medium'
  },
  {
    id: 'smart-contracts-10',
    topicId: 'smart-contracts',
    questionNumber: 10,
    question: 'What is the main security risk associated with smart contracts?',
    options: [
      { id: 'a', label: 'A', text: 'Vulnerabilities in the code that can be exploited' },
      { id: 'b', label: 'B', text: 'High costs to deploy and execute' },
      { id: 'c', label: 'C', text: 'Difficulty in creating the contracts' },
      { id: 'd', label: 'D', text: 'Lack of standardization across platforms' }
    ],
    correctOptionId: 'a',
    explanation: 'The main security risk with smart contracts is vulnerabilities in the code that can be exploited by attackers. Since contracts are immutable, these vulnerabilities persist after deployment.',
    difficulty: 'Hard'
  },

  // NFT Questions
  {
    id: 'nfts-1',
    topicId: 'nfts',
    questionNumber: 1,
    question: 'What does NFT stand for?',
    options: [
      { id: 'a', label: 'A', text: 'Non-Fungible Token' },
      { id: 'b', label: 'B', text: 'New Financial Technology' },
      { id: 'c', label: 'C', text: 'Network Function Token' },
      { id: 'd', label: 'D', text: 'Native Financial Token' }
    ],
    correctOptionId: 'a',
    explanation: 'NFT stands for Non-Fungible Token. These are unique digital assets that represent ownership of specific items or content on a blockchain.',
    difficulty: 'Easy'
  },
  {
    id: 'nfts-2',
    topicId: 'nfts',
    questionNumber: 2,
    question: 'What makes NFTs "non-fungible"?',
    options: [
      { id: 'a', label: 'A', text: 'Each NFT has unique properties and cannot be exchanged on a one-to-one basis' },
      { id: 'b', label: 'B', text: 'NFTs cannot be traded' },
      { id: 'c', label: 'C', text: 'NFTs are always valuable' },
      { id: 'd', label: 'D', text: 'NFTs are only digital' }
    ],
    correctOptionId: 'a',
    explanation: 'NFTs are "non-fungible" because each token has unique properties and cannot be exchanged on a one-to-one basis like fungible tokens (e.g., Bitcoin). Each NFT is distinct and has its own value.',
    difficulty: 'Easy'
  },
  {
    id: 'nfts-3',
    topicId: 'nfts',
    questionNumber: 3,
    question: 'Which standard is most commonly used for NFTs on Ethereum?',
    options: [
      { id: 'a', label: 'A', text: 'ERC-721' },
      { id: 'b', label: 'B', text: 'ERC-20' },
      { id: 'c', label: 'C', text: 'ERC-1155' },
      { id: 'd', label: 'D', text: 'ERC-777' }
    ],
    correctOptionId: 'a',
    explanation: 'ERC-721 is the most commonly used standard for NFTs on Ethereum. It defines how to build non-fungible or unique tokens.',
    difficulty: 'Medium'
  },
  {
    id: 'nfts-4',
    topicId: 'nfts',
    questionNumber: 4,
    question: 'What can NFTs represent?',
    options: [
      { id: 'a', label: 'A', text: 'Digital art, music, videos, virtual real estate, and more' },
      { id: 'b', label: 'B', text: 'Only digital art' },
      { id: 'c', label: 'C', text: 'Only physical assets' },
      { id: 'd', label: 'D', text: 'Only collectibles' }
    ],
    correctOptionId: 'a',
    explanation: 'NFTs can represent various digital assets including art, music, videos, virtual real estate, gaming items, and more. They can also represent physical assets in some cases.',
    difficulty: 'Easy'
  },
  {
    id: 'nfts-5',
    topicId: 'nfts',
    questionNumber: 5,
    question: 'What is the main benefit of NFTs for creators?',
    options: [
      { id: 'a', label: 'A', text: 'Direct monetization and proof of ownership' },
      { id: 'b', label: 'B', text: 'Automatic sales' },
      { id: 'c', label: 'C', text: 'Guaranteed value appreciation' },
      { id: 'd', label: 'D', text: 'Free distribution' }
    ],
    correctOptionId: 'a',
    explanation: 'NFTs allow creators to monetize their work directly and provide verifiable proof of ownership. They can also include smart contracts for automatic royalty payments.',
    difficulty: 'Medium'
  },
  {
    id: 'nfts-6',
    topicId: 'nfts',
    questionNumber: 6,
    question: 'Which is a popular NFT marketplace?',
    options: [
      { id: 'a', label: 'A', text: 'OpenSea' },
      { id: 'b', label: 'B', text: 'Coinbase' },
      { id: 'c', label: 'C', text: 'Binance' },
      { id: 'd', label: 'D', text: 'Kraken' }
    ],
    correctOptionId: 'a',
    explanation: 'OpenSea is the largest NFT marketplace where users can mint, buy, and sell NFTs. It supports various NFT standards and categories.',
    difficulty: 'Easy'
  },
  {
    id: 'nfts-7',
    topicId: 'nfts',
    questionNumber: 7,
    question: 'What is "minting" in the context of NFTs?',
    options: [
      { id: 'a', label: 'A', text: 'Creating an NFT on the blockchain' },
      { id: 'b', label: 'B', text: 'Selling an NFT' },
      { id: 'c', label: 'C', text: 'Buying an NFT' },
      { id: 'd', label: 'D', text: 'Storing an NFT' }
    ],
    correctOptionId: 'a',
    explanation: 'Minting is the process of creating an NFT by uploading content to an NFT marketplace which then stores it in a decentralized system and creates the unique token.',
    difficulty: 'Easy'
  },
  {
    id: 'nfts-8',
    topicId: 'nfts',
    questionNumber: 8,
    question: 'What is "provenance" in NFTs?',
    options: [
      { id: 'a', label: 'A', text: 'The history of ownership of an NFT' },
      { id: 'b', label: 'B', text: 'The creator of the NFT' },
      { id: 'c', label: 'C', text: 'The value of the NFT' },
      { id: 'd', label: 'D', text: 'The artwork in the NFT' }
    ],
    correctOptionId: 'a',
    explanation: 'Provenance refers to the complete history of ownership of an NFT, which is recorded on the blockchain. This provides authenticity and traceability of digital assets.',
    difficulty: 'Hard'
  },
  {
    id: 'nfts-9',
    topicId: 'nfts',
    questionNumber: 9,
    question: 'What is the difference between ERC-721 and ERC-1155 standards?',
    options: [
      { id: 'a', label: 'A', text: 'ERC-721 is for unique tokens; ERC-1155 supports both unique and fungible tokens' },
      { id: 'b', label: 'B', text: 'ERC-721 is faster; ERC-1155 is more secure' },
      { id: 'c', label: 'C', text: 'ERC-721 is free; ERC-1155 costs gas' },
      { id: 'd', label: 'D', text: 'ERC-721 is older; ERC-1155 is newer' }
    ],
    correctOptionId: 'a',
    explanation: 'ERC-721 is designed for unique tokens where each token is distinct, while ERC-1155 allows creating a single contract that can manage both unique and fungible tokens, improving efficiency.',
    difficulty: 'Hard'
  },
  {
    id: 'nfts-10',
    topicId: 'nfts',
    questionNumber: 10,
    question: 'What is a potential use of NFTs beyond digital art?',
    options: [
      { id: 'a', label: 'A', text: 'Identity verification and real estate ownership' },
      { id: 'b', label: 'B', text: 'Physical currency replacement' },
      { id: 'c', label: 'C', text: 'Internet infrastructure' },
      { id: 'd', label: 'D', text: 'Energy production' }
    ],
    correctOptionId: 'a',
    explanation: 'NFTs have potential uses beyond digital art, including identity verification, real estate ownership records, academic credentials, and other applications requiring proof of authenticity and ownership.',
    difficulty: 'Medium'
  },

  // Consensus Mechanisms Questions
  {
    id: 'consensus-1',
    topicId: 'consensus',
    questionNumber: 1,
    question: 'What is the purpose of consensus mechanisms in blockchain?',
    options: [
      { id: 'a', label: 'A', text: 'To ensure all nodes agree on the state of the ledger' },
      { id: 'b', label: 'B', text: 'To increase transaction fees' },
      { id: 'c', label: 'C', text: 'To reduce block size' },
      { id: 'd', label: 'D', text: 'To limit network access' }
    ],
    correctOptionId: 'a',
    explanation: 'Consensus mechanisms ensure all nodes in a blockchain network agree on the state of the ledger, maintaining integrity and security without requiring trust between participants.',
    difficulty: 'Easy'
  },
  {
    id: 'consensus-2',
    topicId: 'consensus',
    questionNumber: 2,
    question: 'What does PoW stand for?',
    options: [
      { id: 'a', label: 'A', text: 'Proof of Work' },
      { id: 'b', label: 'B', text: 'Power of Work' },
      { id: 'c', label: 'C', text: 'Process of Work' },
      { id: 'd', label: 'D', text: 'Piece of Work' }
    ],
    correctOptionId: 'a',
    explanation: 'PoW stands for Proof of Work, a consensus mechanism that requires miners to solve complex mathematical problems to validate transactions and add new blocks.',
    difficulty: 'Easy'
  },
  {
    id: 'consensus-3',
    topicId: 'consensus',
    questionNumber: 3,
    question: 'What does PoS stand for?',
    options: [
      { id: 'a', label: 'A', text: 'Proof of Stake' },
      { id: 'b', label: 'B', text: 'Process of Stake' },
      { id: 'c', label: 'C', text: 'Power of Stake' },
      { id: 'd', label: 'D', text: 'Piece of Stake' }
    ],
    correctOptionId: 'a',
    explanation: 'PoS stands for Proof of Stake, a consensus mechanism that selects validators based on the number of tokens they hold and are willing to "stake" as collateral.',
    difficulty: 'Easy'
  },
  {
    id: 'consensus-4',
    topicId: 'consensus',
    questionNumber: 4,
    question: 'In PoW, what do miners compete to do?',
    options: [
      { id: 'a', label: 'A', text: 'Solve complex mathematical problems' },
      { id: 'b', label: 'B', text: 'Accumulate the most tokens' },
      { id: 'c', label: 'C', text: 'Process the most transactions' },
      { id: 'd', label: 'D', text: 'Validate the most blocks' }
    ],
    correctOptionId: 'a',
    explanation: 'In Proof of Work, miners compete to solve complex mathematical problems. The first miner to solve the problem gets the right to add the next block and earn rewards.',
    difficulty: 'Medium'
  },
  {
    id: 'consensus-5',
    topicId: 'consensus',
    questionNumber: 5,
    question: 'How are validators selected in PoS?',
    options: [
      { id: 'a', label: 'A', text: 'Based on the number of tokens they stake' },
      { id: 'b', label: 'B', text: 'Randomly among all network participants' },
      { id: 'c', label: 'C', text: 'Based on their computational power' },
      { id: 'd', label: 'D', text: 'Based on the time they\'ve been in the network' }
    ],
    correctOptionId: 'a',
    explanation: 'In Proof of Stake, validators are selected based on the number of tokens they hold and are willing to stake as collateral. Higher stakes typically mean better chances of being selected.',
    difficulty: 'Medium'
  },
  {
    id: 'consensus-6',
    topicId: 'consensus',
    questionNumber: 6,
    question: 'Which consensus mechanism is more energy-efficient?',
    options: [
      { id: 'a', label: 'A', text: 'Proof of Stake (PoS)' },
      { id: 'b', label: 'B', text: 'Proof of Work (PoW)' },
      { id: 'c', label: 'C', text: 'Both are equally efficient' },
      { id: 'd', label: 'D', text: 'It depends on the implementation' }
    ],
    correctOptionId: 'a',
    explanation: 'Proof of Stake is more energy-efficient than Proof of Work because it doesn\'t require massive computational power to solve mathematical problems. Validators are chosen based on stakes rather than computational work.',
    difficulty: 'Medium'
  },
  {
    id: 'consensus-7',
    topicId: 'consensus',
    questionNumber: 7,
    question: 'What is "staking" in PoS?',
    options: [
      { id: 'a', label: 'A', text: 'Locking tokens as collateral to participate in validation' },
      { id: 'b', label: 'B', text: 'Storing tokens in a wallet' },
      { id: 'c', label: 'C', text: 'Buying tokens to increase their value' },
      { id: 'd', label: 'D', text: 'Lending tokens to earn interest' }
    ],
    correctOptionId: 'a',
    explanation: 'Staking in Proof of Stake involves locking up tokens as collateral to participate in the validation process. Stakers can earn rewards but may face penalties for malicious behavior.',
    difficulty: 'Hard'
  },
  {
    id: 'consensus-8',
    topicId: 'consensus',
    questionNumber: 8,
    question: 'What is "slashing" in PoS?',
    options: [
      { id: 'a', label: 'A', text: 'Penalty for validator misbehavior' },
      { id: 'b', label: 'B', text: 'The process of creating new blocks' },
      { id: 'c', label: 'C', text: 'Reducing the supply of tokens' },
      { id: 'd', label: 'D', text: 'Splitting the blockchain' }
    ],
    correctOptionId: 'a',
    explanation: 'Slashing in Proof of Stake is a penalty mechanism where validators lose some of their staked tokens for malicious behavior or failure to follow protocol rules.',
    difficulty: 'Hard'
  },
  {
    id: 'consensus-9',
    topicId: 'consensus',
    questionNumber: 9,
    question: 'What is Byzantine Fault Tolerance (BFT)?',
    options: [
      { id: 'a', label: 'A', text: 'The ability of a system to function even with faulty nodes' },
      { id: 'b', label: 'B', text: 'The maximum number of nodes a system can handle' },
      { id: 'c', label: 'C', text: 'The speed of consensus in a blockchain' },
      { id: 'd', label: 'D', text: 'The energy efficiency of consensus mechanisms' }
    ],
    correctOptionId: 'a',
    explanation: 'Byzantine Fault Tolerance (BFT) is the ability of a distributed system to function correctly even if some of its nodes fail or act maliciously. It\'s an important concept in blockchain consensus.',
    difficulty: 'Hard'
  },
  {
    id: 'consensus-10',
    topicId: 'consensus',
    questionNumber: 10,
    question: 'Which consensus mechanism does Bitcoin use?',
    options: [
      { id: 'a', label: 'A', text: 'Proof of Work (PoW)' },
      { id: 'b', label: 'B', text: 'Proof of Stake (PoS)' },
      { id: 'c', label: 'C', text: 'Delegated Proof of Stake (DPoS)' },
      { id: 'd', label: 'D', text: 'Proof of Authority (PoA)' }
    ],
    correctOptionId: 'a',
    explanation: 'Bitcoin uses Proof of Work (PoW) consensus mechanism, which requires miners to solve complex mathematical problems to validate transactions and add new blocks to the blockchain.',
    difficulty: 'Easy'
  },

  // Ethereum & L2 Questions
  {
    id: 'ethereum-l2-1',
    topicId: 'ethereum-l2',
    questionNumber: 1,
    question: 'What is Ethereum?',
    options: [
      { id: 'a', label: 'A', text: 'A blockchain platform enabling smart contracts and dApps' },
      { id: 'b', label: 'B', text: 'A cryptocurrency only' },
      { id: 'c', label: 'C', text: 'A payment system' },
      { id: 'd', label: 'D', text: 'A decentralized exchange' }
    ],
    correctOptionId: 'a',
    explanation: 'Ethereum is a blockchain platform that enables developers to build and deploy smart contracts and decentralized applications (dApps). It is the second-largest cryptocurrency by market cap.',
    difficulty: 'Easy'
  },
  {
    id: 'ethereum-l2-2',
    topicId: 'ethereum-l2',
    questionNumber: 2,
    question: 'What is the main scalability challenge with Ethereum?',
    options: [
      { id: 'a', label: 'A', text: 'High gas fees and slow transaction speeds' },
      { id: 'b', label: 'B', text: 'Limited number of users' },
      { id: 'c', label: 'C', text: 'Inability to process smart contracts' },
      { id: 'd', label: 'D', text: 'Lack of security features' }
    ],
    correctOptionId: 'a',
    explanation: 'Ethereum faces scalability issues with high gas fees and slow transaction speeds during network congestion, as the network can only process about 15 transactions per second.',
    difficulty: 'Easy'
  },
  {
    id: 'ethereum-l2-3',
    topicId: 'ethereum-l2',
    questionNumber: 3,
    question: 'What are Layer 2 (L2) solutions?',
    options: [
      { id: 'a', label: 'A', text: 'Protocols built on top of Ethereum to improve scalability' },
      { id: 'b', label: 'B', text: 'Second-generation Ethereum tokens' },
      { id: 'c', label: 'C', text: 'Backup networks for Ethereum' },
      { id: 'd', label: 'D', text: 'Alternative blockchain platforms' }
    ],
    correctOptionId: 'a',
    explanation: 'Layer 2 solutions are protocols built on top of Ethereum to improve scalability and reduce costs. They handle transactions off the main Ethereum chain and periodically submit results back to Layer 1.',
    difficulty: 'Medium'
  },
  {
    id: 'ethereum-l2-4',
    topicId: 'ethereum-l2',
    questionNumber: 4,
    question: 'Which is NOT a type of Layer 2 solution?',
    options: [
      { id: 'a', label: 'A', text: 'Proof of Stake' },
      { id: 'b', label: 'B', text: 'Optimistic Rollups' },
      { id: 'c', label: 'C', text: 'ZK-Rollups' },
      { id: 'd', label: 'D', text: 'Sidechains' }
    ],
    correctOptionId: 'a',
    explanation: 'Proof of Stake is a consensus mechanism, not a Layer 2 scaling solution. Optimistic Rollups, ZK-Rollups, and Sidechains are all examples of Layer 2 scaling solutions.',
    difficulty: 'Medium'
  },
  {
    id: 'ethereum-l2-5',
    topicId: 'ethereum-l2',
    questionNumber: 5,
    question: 'What is the main difference between Optimistic and ZK Rollups?',
    options: [
      { id: 'a', label: 'A', text: 'Optimistic Rollups assume validity, ZK-Rollups prove validity upfront' },
      { id: 'b', label: 'B', text: 'Optimistic Rollups are faster, ZK-Rollups are more secure' },
      { id: 'c', label: 'C', text: 'Optimistic Rollups cost more, ZK-Rollups cost less' },
      { id: 'd', label: 'D', text: 'Optimistic Rollups are open-source, ZK-Rollups are proprietary' }
    ],
    correctOptionId: 'a',
    explanation: 'Optimistic Rollups assume transactions are valid and only run computation in case of fraud challenges, while ZK-Rollups use zero-knowledge proofs to validate transactions before submitting to Layer 1.',
    difficulty: 'Hard'
  },
  {
    id: 'ethereum-l2-6',
    topicId: 'ethereum-l2',
    questionNumber: 6,
    question: 'What is Polygon in the Ethereum ecosystem?',
    options: [
      { id: 'a', label: 'A', text: 'A popular sidechain solution for Ethereum' },
      { id: 'b', label: 'B', text: 'A programming language for smart contracts' },
      { id: 'c', label: 'C', text: 'A decentralized exchange on Ethereum' },
      { id: 'd', label: 'D', text: 'The Ethereum development team' }
    ],
    correctOptionId: 'a',
    explanation: 'Polygon is a popular sidechain solution for Ethereum that operates as a separate blockchain with its own consensus mechanism but connected to Ethereum, allowing for faster and cheaper transactions.',
    difficulty: 'Medium'
  },
  {
    id: 'ethereum-l2-7',
    topicId: 'ethereum-l2',
    questionNumber: 7,
    question: 'What is the purpose of "sharding" in Ethereum 2.0?',
    options: [
      { id: 'a', label: 'A', text: 'To increase capacity by splitting the network into multiple chains' },
      { id: 'b', label: 'B', text: 'To improve security by creating multiple copies of data' },
      { id: 'c', label: 'C', text: 'To reduce the size of the blockchain' },
      { id: 'd', label: 'D', text: 'To increase the price of ETH tokens' }
    ],
    correctOptionId: 'a',
    explanation: 'Sharding in Ethereum 2.0 splits the network into multiple chains, increasing capacity and throughput by allowing parallel processing of transactions.',
    difficulty: 'Hard'
  },
  {
    id: 'ethereum-l2-8',
    topicId: 'ethereum-l2',
    questionNumber: 8,
    question: 'What is the "Merge" in Ethereum\'s development?',
    options: [
      { id: 'a', label: 'A', text: 'Transition from Proof of Work to Proof of Stake' },
      { id: 'b', label: 'B', text: 'Combining with another blockchain' },
      { id: 'c', label: 'C', text: 'Merging Layer 1 and Layer 2 solutions' },
      { id: 'd', label: 'D', text: 'Combining multiple Ethereum chains' }
    ],
    correctOptionId: 'a',
    explanation: 'The Merge was the transition of Ethereum from Proof of Work to Proof of Stake consensus, which occurred in September 2022, improving scalability and energy efficiency.',
    difficulty: 'Medium'
  },
  {
    id: 'ethereum-l2-9',
    topicId: 'ethereum-l2',
    questionNumber: 9,
    question: 'What are gas fees in Ethereum?',
    options: [
      { id: 'a', label: 'A', text: 'Fees paid by users to execute transactions on Ethereum' },
      { id: 'b', label: 'B', text: 'Fees for using Layer 2 solutions' },
      { id: 'c', label: 'C', text: 'Fees for holding ETH tokens' },
      { id: 'd', label: 'D', text: 'Costs for creating smart contracts' }
    ],
    correctOptionId: 'a',
    explanation: 'Gas fees are payments made by users to compensate for the computing energy required to process and validate transactions on the Ethereum network.',
    difficulty: 'Easy'
  },
  {
    id: 'ethereum-l2-10',
    topicId: 'ethereum-l2',
    questionNumber: 10,
    question: 'Why are L2 solutions necessary for Ethereum?',
    options: [
      { id: 'a', label: 'A', text: 'To improve scalability and reduce costs due to network congestion' },
      { id: 'b', label: 'B', text: 'To replace Ethereum entirely' },
      { id: 'c', label: 'C', text: 'To add new programming languages' },
      { id: 'd', label: 'D', text: 'To increase security vulnerabilities' }
    ],
    correctOptionId: 'a',
    explanation: 'L2 solutions are necessary to improve Ethereum\'s scalability and reduce transaction costs, which are issues caused by network congestion on the main Ethereum chain.',
    difficulty: 'Hard'
  }
];

// Default app state
const DEFAULT_STATE: AppState = {
  currentPhase: 'topic-selection',
  selectedTopic: null,
  currentSectionIndex: 0,
  sectionsRead: [false, false, false, false, false], // For 5 sections per topic
  quizStarted: false,
  currentQuestionIndex: 0,
  userAnswers: [],
  timeRemaining: 600, // 10 minutes in seconds
  quizCompleted: false,
  score: 0,
  iqScore: 0,
  percentile: 0,
};

const IQQuizApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(DEFAULT_STATE);
  
  // Timer effect for quiz
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (appState.currentPhase === 'quiz' && appState.quizStarted && appState.timeRemaining > 0) {
      timer = setInterval(() => {
        setAppState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time's up! Submit quiz automatically
            const newState = {
              ...prev,
              timeRemaining: 0,
              quizStarted: false,
              quizCompleted: true,
              currentPhase: 'results'
            };
            
            // Calculate final scores
            calculateFinalScores(newState);
            return newState;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [appState.currentPhase, appState.quizStarted, appState.timeRemaining]);

  const calculateFinalScores = (state: AppState) => {
    if (!state.selectedTopic) return;
    
    // Get questions for the selected topic
    const topicQuestions = QUIZ_QUESTIONS.filter(q => q.topicId === state.selectedTopic);
    
    // Calculate score
    let correctCount = 0;
    topicQuestions.forEach((question, index) => {
      const userAnswer = state.userAnswers.find(a => a.questionId === question.id);
      if (userAnswer && userAnswer.selectedOptionId === question.correctOptionId) {
        correctCount++;
      }
    });
    
    // Calculate IQ score: IQ = 100 + (Correct Answers × 10) - 10
    const iqScore = 100 + (correctCount * 10) - 10;
    
    // Calculate percentile (simplified mapping)
    let percentile = 0;
    if (iqScore <= 90) percentile = 25;
    else if (iqScore <= 100) percentile = 50;
    else if (iqScore <= 120) percentile = 91;
    else if (iqScore <= 140) percentile = 99;
    else percentile = 100;
    
    setAppState(prev => ({
      ...prev,
      score: correctCount,
      iqScore,
      percentile
    }));
  };

  // Reset state for new quiz
  const startNewQuiz = (topicId: string) => {
    setAppState({
      ...DEFAULT_STATE,
      currentPhase: 'learning',
      selectedTopic: topicId,
      sectionsRead: Array(5).fill(false) // Reset all sections as unread
    });
  };

  // Move to next phase
  const goToNextPhase = () => {
    if (appState.currentPhase === 'learning') {
      // Check if all sections are read before moving to pre-quiz
      const allSectionsRead = appState.sectionsRead.every(read => read);
      if (allSectionsRead) {
        setAppState(prev => ({
          ...prev,
          currentPhase: 'pre-quiz'
        }));
      }
    } else if (appState.currentPhase === 'pre-quiz') {
      setAppState(prev => ({
        ...prev,
        currentPhase: 'quiz',
        quizStarted: true,
        timeRemaining: 600, // 10 minutes
        userAnswers: [] // Reset answers for new quiz
      }));
    } else if (appState.currentPhase === 'quiz') {
      setAppState(prev => ({
        ...prev,
        quizStarted: false,
        quizCompleted: true,
        currentPhase: 'results'
      }));
    }
  };

  // Handle section navigation in learning module
  const goToSection = (index: number) => {
    setAppState(prev => ({
      ...prev,
      currentSectionIndex: index
    }));
  };

  // Mark section as read
  const markSectionAsRead = (index: number) => {
    setAppState(prev => {
      const newSectionsRead = [...prev.sectionsRead];
      newSectionsRead[index] = true;
      return {
        ...prev,
        sectionsRead: newSectionsRead
      };
    });
  };

  // Handle quiz answer selection
  const selectAnswer = (questionId: string, optionId: string) => {
    setAppState(prev => {
      // Remove previous answer for this question if exists
      const filteredAnswers = prev.userAnswers.filter(a => a.questionId !== questionId);
      const newAnswers = [...filteredAnswers, { questionId, selectedOptionId: optionId }];
      
      return {
        ...prev,
        userAnswers: newAnswers
      };
    });
  };

  // Navigate between quiz questions
  const goToQuestion = (index: number) => {
    setAppState(prev => ({
      ...prev,
      currentQuestionIndex: index
    }));
  };

  // Submit quiz manually
  const submitQuiz = () => {
    calculateFinalScores(appState);
    setAppState(prev => ({
      ...prev,
      quizStarted: false,
      quizCompleted: true,
      currentPhase: 'results'
    }));
  };

  // Retake quiz
  const retakeQuiz = () => {
    if (!appState.selectedTopic) return;
    startNewQuiz(appState.selectedTopic);
  };

  // Navigate to answer review
  const goToReview = () => {
    setAppState(prev => ({
      ...prev,
      currentPhase: 'review'
    }));
  };

  // Return to topic selection
  const returnToTopics = () => {
    setAppState(DEFAULT_STATE);
  };

  // Render current phase
  const renderCurrentPhase = () => {
    switch (appState.currentPhase) {
      case 'topic-selection':
        return <TopicSelectionPage onStartLearning={startNewQuiz} />;
      case 'learning':
        return (
          <LearningModule
            selectedTopic={appState.selectedTopic}
            currentSectionIndex={appState.currentSectionIndex}
            sectionsRead={appState.sectionsRead}
            onSectionChange={goToSection}
            onMarkAsRead={markSectionAsRead}
            onContinue={goToNextPhase}
            learningContent={LEARNING_CONTENT}
          />
        );
      case 'pre-quiz':
        return <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-3xl font-bold text-center mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-center mb-8">You've completed the learning module. Would you like to take the quiz now?</p>
          <div className="flex justify-center">
            <button 
              onClick={goToNextPhase}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>;
      case 'quiz':
        return (
          <QuizPage
            selectedTopic={appState.selectedTopic}
            currentQuestionIndex={appState.currentQuestionIndex}
            timeRemaining={appState.timeRemaining}
            userAnswers={appState.userAnswers}
            onSelectAnswer={selectAnswer}
            onGoToQuestion={goToQuestion}
            onSubmit={submitQuiz}
            quizQuestions={QUIZ_QUESTIONS}
          />
        );
      case 'results':
        return (
          <ResultsPage
            iqScore={appState.iqScore}
            score={appState.score}
            percentile={appState.percentile}
            selectedTopic={appState.selectedTopic}
            onRetake={retakeQuiz}
            onReview={goToReview}
            onReturnToTopics={returnToTopics}
          />
        );
      case 'review':
        return (
          <AnswerReviewPage
            selectedTopic={appState.selectedTopic}
            userAnswers={appState.userAnswers}
            onReturnToResults={() => setAppState(prev => ({ ...prev, currentPhase: 'results' }))}
            quizQuestions={QUIZ_QUESTIONS}
          />
        );
      default:
        return <TopicSelectionPage onStartLearning={startNewQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Web3 IQ Quiz
          </h1>
          <p className="text-center text-blue-200 mt-2">
            Educational IQ Assessment for Web3 & DeFi Concepts
          </p>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {renderCurrentPhase()}
        </div>
      </main>
    </div>
  );
};

export default IQQuizApp;