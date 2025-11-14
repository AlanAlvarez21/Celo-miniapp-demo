'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Clock, Brain, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ArrowRight, Coins, Shield, Users, BookOpen, Sparkles, Trophy, Zap, Medal, Wallet, CoinsIcon } from 'lucide-react'
import { useCeloPayment } from '@/hooks/useCeloPayment'

type LeaderboardEntry = {
  id: string
  username: string
  topicId: string
  topicTitle: string
  score: number
  percentage: number
  rank: string
  date: string
  timeLeft: number
}

type Topic = {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  description: string
  learningContent: {
    intro: string
    sections: {
      title: string
      content: string
      highlight: string
    }[]
    keyTakeaways: string[]
  }
  questions: Question[]
}

type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const topics: Topic[] = [
  {
    id: 'defi',
    title: 'DeFi Basics',
    icon: <Coins className="h-8 w-8" />,
    color: 'from-yellow-400 to-orange-500',
    description: 'Learn about Decentralized Finance and how it\'s revolutionizing banking',
    learningContent: {
      intro: 'Decentralized Finance (DeFi) is a revolutionary financial system built on blockchain technology that eliminates traditional intermediaries.',
      sections: [
        {
          title: 'What is DeFi?',
          content: 'DeFi refers to financial services that operate without traditional banks or financial institutions. Instead, smart contracts on blockchains automatically execute transactions.',
          highlight: 'No banks, no brokers - just code and smart contracts!'
        },
        {
          title: 'Key DeFi Services',
          content: 'DeFi offers lending, borrowing, trading, and earning interest on crypto assets. Platforms like Uniswap, Aave, and Compound let you trade and lend directly.',
          highlight: 'Trade 24/7, globally, without permission from anyone!'
        },
        {
          title: 'Liquidity Pools',
          content: 'Users can deposit crypto into pools to enable trading. In return, they earn fees from trades. This is called "liquidity mining" or "yield farming".',
          highlight: 'Be the bank - earn fees like Wall Street does!'
        }
      ],
      keyTakeaways: [
        'DeFi eliminates middlemen using smart contracts',
        'Anyone can access DeFi services globally 24/7',
        'You can earn passive income through liquidity pools',
        'All transactions are transparent on the blockchain'
      ]
    },
    questions: [
      {
        id: 1,
        text: "What does DeFi stand for?",
        options: ["Digital Finance", "Decentralized Finance", "Direct Finance", "Distributed Finance"],
        correctAnswer: 1,
        explanation: "DeFi stands for Decentralized Finance - financial services without traditional intermediaries.",
        difficulty: 'Easy'
      },
      {
        id: 2,
        text: "What executes transactions automatically in DeFi?",
        options: ["Banks", "Smart Contracts", "Government", "Brokers"],
        correctAnswer: 1,
        explanation: "Smart contracts are self-executing code on the blockchain that automatically handle transactions.",
        difficulty: 'Easy'
      },
      {
        id: 3,
        text: "What is yield farming?",
        options: ["Growing crops", "Earning fees by providing liquidity", "Mining Bitcoin", "Buying stocks"],
        correctAnswer: 1,
        explanation: "Yield farming means earning fees by providing liquidity to DeFi protocols.",
        difficulty: 'Medium'
      },
      {
        id: 4,
        text: "Which is NOT a DeFi platform?",
        options: ["Uniswap", "Aave", "PayPal", "Compound"],
        correctAnswer: 2,
        explanation: "PayPal is a traditional centralized payment processor, not a DeFi platform.",
        difficulty: 'Medium'
      },
      {
        id: 5,
        text: "What's a main advantage of DeFi over traditional finance?",
        options: ["Higher fees", "Limited hours", "No permission needed", "Slower transactions"],
        correctAnswer: 2,
        explanation: "DeFi is permissionless - anyone can access it without approval from banks or institutions.",
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'web3',
    title: 'Web3 Fundamentals',
    icon: <Sparkles className="h-8 w-8" />,
    color: 'from-purple-400 to-pink-500',
    description: 'Discover the next generation of the internet powered by blockchain',
    learningContent: {
      intro: 'Web3 represents the evolution of the internet from centralized platforms to decentralized networks where users own their data and digital assets.',
      sections: [
        {
          title: 'Evolution: Web1 → Web2 → Web3',
          content: 'Web1 was read-only (static websites). Web2 added social media but platforms own your data. Web3 gives YOU ownership through blockchain.',
          highlight: 'You own your data, identity, and assets - not corporations!'
        },
        {
          title: 'Core Web3 Technologies',
          content: 'Blockchain stores data permanently. Cryptocurrencies enable value transfer. NFTs prove digital ownership. Smart contracts automate agreements.',
          highlight: 'Build unstoppable apps that no single company can shut down!'
        },
        {
          title: 'Your Web3 Wallet',
          content: 'Wallets like MetaMask are your passport to Web3. They store your crypto, NFTs, and serve as your digital identity across all Web3 apps.',
          highlight: 'One wallet = access to thousands of apps!'
        }
      ],
      keyTakeaways: [
        'Web3 gives users ownership of their data and assets',
        'Blockchain makes Web3 transparent and uncensorable',
        'Wallets are your identity across all Web3 apps',
        'Smart contracts enable trustless interactions'
      ]
    },
    questions: [
      {
        id: 1,
        text: "What's the main difference between Web2 and Web3?",
        options: ["Speed", "User ownership", "Colors", "Language"],
        correctAnswer: 1,
        explanation: "Web3's defining feature is that users own their data, assets, and identity rather than corporations.",
        difficulty: 'Easy'
      },
      {
        id: 2,
        text: "What technology powers Web3?",
        options: ["Social media", "Blockchain", "Email", "Cloud storage"],
        correctAnswer: 1,
        explanation: "Blockchain technology is the foundation that enables decentralization in Web3.",
        difficulty: 'Easy'
      },
      {
        id: 3,
        text: "What is a Web3 wallet used for?",
        options: ["Storing photos", "Digital identity and assets", "Making calls", "Watching videos"],
        correctAnswer: 1,
        explanation: "Web3 wallets store your crypto, NFTs, and serve as your digital identity across dApps.",
        difficulty: 'Medium'
      },
      {
        id: 4,
        text: "Which is a popular Web3 wallet?",
        options: ["Gmail", "MetaMask", "Instagram", "Spotify"],
        correctAnswer: 1,
        explanation: "MetaMask is one of the most popular Web3 wallets for accessing decentralized applications.",
        difficulty: 'Medium'
      },
      {
        id: 5,
        text: "What makes Web3 apps 'unstoppable'?",
        options: ["Better graphics", "Decentralized architecture", "Faster loading", "More users"],
        correctAnswer: 1,
        explanation: "Because Web3 apps run on decentralized networks, no single entity can shut them down.",
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'daos',
    title: 'DAOs Explained',
    icon: <Users className="h-8 w-8" />,
    color: 'from-blue-400 to-cyan-500',
    description: 'Understand how Decentralized Autonomous Organizations work',
    learningContent: {
      intro: 'DAOs (Decentralized Autonomous Organizations) are internet-native organizations governed by code and community voting rather than traditional hierarchies.',
      sections: [
        {
          title: 'What is a DAO?',
          content: 'A DAO is an organization where rules are encoded in smart contracts and decisions are made through member voting. No CEOs, no boards - just code and consensus.',
          highlight: 'Democracy powered by smart contracts!'
        },
        {
          title: 'How DAOs Work',
          content: 'Members hold governance tokens that grant voting power. Proposals are submitted, discussed, and voted on-chain. When a vote passes, smart contracts automatically execute the decision.',
          highlight: 'One token = one vote. Pure digital democracy!'
        },
        {
          title: 'Real DAO Examples',
          content: 'MakerDAO governs the DAI stablecoin. Uniswap DAO controls protocol upgrades. ConstitutionDAO raised $47M to buy the US Constitution!',
          highlight: 'DAOs are already managing billions of dollars!'
        }
      ],
      keyTakeaways: [
        'DAOs are organizations governed by smart contracts',
        'Members vote on decisions using governance tokens',
        'All votes and decisions are transparent on-chain',
        'DAOs eliminate traditional corporate hierarchies'
      ]
    },
    questions: [
      {
        id: 1,
        text: "What does DAO stand for?",
        options: ["Digital Asset Organization", "Decentralized Autonomous Organization", "Direct Action Order", "Distributed Application Online"],
        correctAnswer: 1,
        explanation: "DAO stands for Decentralized Autonomous Organization - a blockchain-governed community.",
        difficulty: 'Easy'
      },
      {
        id: 2,
        text: "How are decisions made in a DAO?",
        options: ["CEO decides", "Member voting", "Government approval", "Random selection"],
        correctAnswer: 1,
        explanation: "DAO members vote on proposals, and smart contracts execute the majority decision.",
        difficulty: 'Easy'
      },
      {
        id: 3,
        text: "What gives you voting power in a DAO?",
        options: ["Age", "Governance tokens", "Location", "Job title"],
        correctAnswer: 1,
        explanation: "Holding governance tokens grants you voting rights proportional to your holdings.",
        difficulty: 'Medium'
      },
      {
        id: 4,
        text: "Which is a real DAO?",
        options: ["Facebook", "MakerDAO", "Amazon", "Netflix"],
        correctAnswer: 1,
        explanation: "MakerDAO is a prominent DAO that governs the DAI stablecoin protocol.",
        difficulty: 'Medium'
      },
      {
        id: 5,
        text: "What executes DAO decisions automatically?",
        options: ["Lawyers", "Smart contracts", "Executives", "Managers"],
        correctAnswer: 1,
        explanation: "Smart contracts automatically execute decisions once a vote passes, ensuring trustless governance.",
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'security',
    title: 'Web3 Security',
    icon: <Shield className="h-8 w-8" />,
    color: 'from-green-400 to-emerald-500',
    description: 'Master the essentials of staying safe in the crypto world',
    learningContent: {
      intro: 'Web3 security is crucial because you are your own bank. Understanding how to protect your assets is the difference between success and losing everything.',
      sections: [
        {
          title: 'Wallet Security Basics',
          content: 'Your seed phrase is EVERYTHING. It\'s 12-24 words that recover your wallet. Never share it, never store it digitally. Write it down and keep it safe offline.',
          highlight: 'Lose your seed phrase = lose your crypto forever!'
        },
        {
          title: 'Common Scams',
          content: 'Phishing sites mimic real platforms. Fake airdrops steal your tokens. "Support" DMs are always scams. If it sounds too good to be true, it is.',
          highlight: 'Real Web3 projects NEVER DM you first!'
        },
        {
          title: 'Smart Contract Risks',
          content: 'Before approving any transaction, understand what you\'re signing. Malicious contracts can drain your wallet. Only interact with verified, audited projects.',
          highlight: 'Read before you sign - your wallet depends on it!'
        }
      ],
      keyTakeaways: [
        'Never share your seed phrase with anyone',
        'Use hardware wallets for large amounts',
        'Verify contract addresses before interacting',
        'Be extremely skeptical of unsolicited offers'
      ]
    },
    questions: [
      {
        id: 1,
        text: "What should you NEVER share?",
        options: ["Your username", "Your seed phrase", "Your email", "Your favorite color"],
        correctAnswer: 1,
        explanation: "Your seed phrase gives complete access to your wallet. Never share it with anyone, ever.",
        difficulty: 'Easy'
      },
      {
        id: 2,
        text: "How many words is a typical seed phrase?",
        options: ["6", "12 or 24", "50", "100"],
        correctAnswer: 1,
        explanation: "Most seed phrases are either 12 or 24 words that can recover your entire wallet.",
        difficulty: 'Easy'
      },
      {
        id: 3,
        text: "What's the best way to store your seed phrase?",
        options: ["Email it", "Screenshot on phone", "Write on paper offline", "Cloud storage"],
        correctAnswer: 2,
        explanation: "Writing your seed phrase on paper and storing it securely offline is the safest method.",
        difficulty: 'Medium'
      },
      {
        id: 4,
        text: "If someone DMs you offering crypto support, you should:",
        options: ["Send them money", "Ignore - it's a scam", "Share your seed phrase", "Click their links"],
        correctAnswer: 1,
        explanation: "Legitimate projects never DM you first. All unsolicited support messages are scams.",
        difficulty: 'Medium'
      },
      {
        id: 5,
        text: "Before approving a smart contract transaction, you should:",
        options: ["Click quickly", "Verify what you're approving", "Trust the website", "Skip reading"],
        correctAnswer: 1,
        explanation: "Always understand what permissions you're granting. Malicious contracts can drain your wallet.",
        difficulty: 'Hard'
      }
    ]
  }
]

type Screen = 'home' | 'learn' | 'quiz' | 'score' | 'review' | 'leaderboard' | 'payment'

export default function Web3QuizApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes for shorter quizzes
  const [quizStarted, setQuizStarted] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [username, setUsername] = useState('')
  const [scoreData, setScoreData] = useState<null | { correct: number; total: number; percentage: number; rank: string }>(null);
  const [hasPaid, setHasPaid] = useState(false); // Track if user has paid to see score

  // Timer logic
  useEffect(() => {
    if (quizStarted && screen === 'quiz' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [quizStarted, screen, timeLeft])

  // Initialize payment hook
  const {
    address,
    isWalletConnected,
    connectWallet,
    makePayment,
    paymentStatus,
    isPaymentLoading,
    transactionHash,
  } = useCeloPayment();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setAnswers(Array(topic.questions.length).fill(null))
    setScreen('learn')
  }

  const handleStartQuiz = () => {
    setScreen('quiz')
    setQuizStarted(true)
    setTimeLeft(300) // Reset timer
    setCurrentQuestion(0)
  }

  // Function to initiate payment for score access
  const handlePaymentForScore = () => {
    // Calculate the score first
    const calculatedScore = calculateScore();
    setScoreData(calculatedScore);

    if (!isWalletConnected) {
      connectWallet();
    } else {
      // If wallet is connected, make payment to default receiving address
      makePaymentToDefault('0.1'); // Send 0.1 CELO to the configured receiving address
    }
  };

  // Handle payment success
  useEffect(() => {
    if (paymentStatus === 'success') {
      setHasPaid(true); // Allow access to score
      setScreen('score'); // Navigate to score screen
    } else if (paymentStatus === 'failed') {
      alert('Payment failed. Please try again.');
    }
  }, [paymentStatus]);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (selectedTopic && currentQuestion < selectedTopic.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAutoSubmit = () => {
    setQuizStarted(false)
    setScreen('score')
  }

  const saveToLeaderboard = (scoreData: { correct: number; total: number; percentage: number; rank: string }) => {
    if (!selectedTopic) return
    
    const entry: LeaderboardEntry = {
      id: Date.now().toString(),
      username: username || 'Anonymous',
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      score: scoreData.correct,
      percentage: scoreData.percentage,
      rank: scoreData.rank,
      date: new Date().toISOString(),
      timeLeft
    }
    
    const existing = localStorage.getItem('web3_leaderboard')
    const leaderboard: LeaderboardEntry[] = existing ? JSON.parse(existing) : []
    leaderboard.push(entry)
    
    // Keep only top 100 entries
    leaderboard.sort((a, b) => b.percentage - a.percentage)
    const trimmed = leaderboard.slice(0, 100)
    
    localStorage.setItem('web3_leaderboard', JSON.stringify(trimmed))
  }

  const getLeaderboard = (): LeaderboardEntry[] => {
    const existing = localStorage.getItem('web3_leaderboard')
    return existing ? JSON.parse(existing) : []
  }

  const handleSubmit = () => {
    const unanswered = answers.filter(a => a === null).length
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      )
      if (!confirm) return
    }
    setQuizStarted(false)
    saveToLeaderboard(calculateScore())
    setScreen('payment') // Changed to go to payment screen
  }

  const calculateScore = () => {
    if (!selectedTopic) return { correct: 0, total: 0, percentage: 0, rank: 'Newbie' }
    
    const correct = answers.filter((answer, index) => 
      answer === selectedTopic.questions[index].correctAnswer
    ).length
    const total = selectedTopic.questions.length
    const percentage = Math.round((correct / total) * 100)
    
    let rank = ''
    if (percentage >= 90) rank = 'Web3 Master'
    else if (percentage >= 75) rank = 'Crypto Expert'
    else if (percentage >= 60) rank = 'Blockchain Pro'
    else if (percentage >= 45) rank = 'DeFi Learner'
    else rank = 'Web3 Newbie'
    
    return { correct, total, percentage, rank }
  }

  const handleRestart = () => {
    setScreen('home')
    setSelectedTopic(null)
    setCurrentQuestion(0)
    setAnswers([])
    setTimeLeft(300)
    setQuizStarted(false)
    setShowMethodology(false)
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block bg-white border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 transform rotate-1">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black uppercase tracking-tight">
                Web3 Academy
              </h1>
            </div>
            <p className="text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              Learn. Quiz. Master the Future! 🚀
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <label className="block text-sm font-black text-black uppercase mb-2">
                Enter Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Anonymous"
                maxLength={20}
                className="w-full px-4 py-3 border-4 border-black font-bold text-black text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>
          </div>

          {/* Topic Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className="group text-left bg-white border-6 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`bg-gradient-to-br ${topic.color} border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white`}>
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-black text-black uppercase mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-base md:text-lg font-bold text-gray-700">
                      {topic.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t-4 border-black">
                  <span className="text-sm font-black text-black uppercase bg-yellow-300 border-2 border-black px-3 py-1">
                    {topic.questions.length} Questions
                  </span>
                  <ArrowRight className="h-6 w-6 text-black group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <button
              onClick={() => setScreen('leaderboard')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-lg text-black uppercase flex items-center gap-2"
            >
              <Trophy className="h-6 w-6" />
              Leaderboard
            </button>
          </div>

          {/* Footer Badge */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-black text-white border-4 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] transform rotate-2">
              <p className="text-lg font-black uppercase">
                🎮 Choose Your Adventure!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'learn' && selectedTopic) {
    const { learningContent } = selectedTopic
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-300 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-4">
                <div className={`bg-gradient-to-br ${selectedTopic.color} border-4 border-black p-3 text-white`}>
                  {selectedTopic.icon}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-black uppercase">
                    {selectedTopic.title}
                  </h1>
                  <p className="text-base font-bold text-gray-700 mt-1">
                    Learn before you test! 📚
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="bg-yellow-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-black flex-shrink-0 mt-1" />
              <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
                {learningContent.intro}
              </p>
            </div>
          </div>

          {/* Learning Sections */}
          <div className="space-y-6 mb-8">
            {learningContent.sections.map((section, index) => (
              <div key={index} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3 flex items-center gap-2">
                  <span className="bg-black text-white w-8 h-8 flex items-center justify-center border-2 border-black">
                    {index + 1}
                  </span>
                  {section.title}
                </h3>
                <p className="text-base md:text-lg font-bold text-gray-700 mb-4 leading-relaxed">
                  {section.content}
                </p>
                <div className="bg-gradient-to-r from-pink-300 to-purple-300 border-4 border-black p-4">
                  <p className="text-base md:text-lg font-black text-black flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {section.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-green-300 to-emerald-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h3 className="text-2xl font-black text-black uppercase mb-4 flex items-center gap-2">
              <Trophy className="h-7 w-7" />
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {learningContent.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg font-bold text-black">
                    {takeaway}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setScreen('home')}
              className="flex-1 bg-white border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-lg text-black uppercase"
            >
              ← Back to Topics
            </button>
            <button
              onClick={handleStartQuiz}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px)] transition-all duration-200 font-black text-lg text-black uppercase flex items-center justify-center gap-2"
            >
              Ready! Start Quiz 🎮
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'quiz' && selectedTopic) {
    const question = selectedTopic.questions[currentQuestion]
    const answeredCount = answers.filter(a => a !== null).length
    const progressPercent = ((currentQuestion + 1) / selectedTopic.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300">
        {/* Header */}
        <div className="border-b-6 border-black bg-white sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-br ${selectedTopic.color} border-4 border-black p-2 text-white`}>
                  {selectedTopic.icon}
                </div>
                <span className="text-base md:text-lg font-black text-black uppercase">
                  Q{currentQuestion + 1}/{selectedTopic.questions.length}
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 border-4 border-black ${
                timeLeft <= 60 ? 'bg-red-400' : 'bg-green-400'
              }`}>
                <Clock className="h-5 w-5 text-black" />
                <span className="font-black text-xl text-black font-mono">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 border-4 border-black">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white border-6 border-black p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-black leading-tight">
                {question.text}
              </h2>
              <span className={`text-xs md:text-sm px-3 py-1 border-3 border-black whitespace-nowrap font-black uppercase ${
                question.difficulty === 'Easy' ? 'bg-green-400' :
                question.difficulty === 'Medium' ? 'bg-yellow-400' :
                'bg-red-400'
              }`}>
                {question.difficulty}
              </span>
            </div>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-4 md:p-5 border-4 border-black transition-all ${
                    answers[currentQuestion] === index
                      ? 'bg-gradient-to-r from-yellow-300 to-pink-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-10 h-10 border-4 border-black text-base md:text-lg font-black ${
                      answers[currentQuestion] === index
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-base md:text-lg font-bold text-black">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <div className="text-center bg-white border-4 border-black px-4 py-2">
              <span className="text-sm md:text-base font-black text-black">
                {answeredCount}/{selectedTopic.questions.length}
              </span>
            </div>

            {currentQuestion === selectedTopic.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-400 to-emerald-500 border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
              >
                Submit! 🏁
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'payment' && selectedTopic) {
    const { correct, total, percentage, rank } = calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-300 to-purple-400 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white border-6 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-br from-green-400 to-blue-500 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                <CoinsIcon className="h-12 w-12 md:h-16 md:w-16 text-black" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-black uppercase mb-2">
                Access Your Score
              </h1>
              <p className="text-lg md:text-xl font-bold text-gray-700">
                Pay 0.1 CELO to reveal your results
              </p>
            </div>

            {/* Score Preview */}
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 opacity-60">
              <div className="text-center">
                <p className="text-sm md:text-base font-black text-black uppercase mb-2">
                  Your Score
                </p>
                <p className="text-7xl md:text-9xl font-black text-white [text-shadow:_4px_4px_0_rgb(0_0_0)]">
                  {percentage}%
                </p>
                <p className="text-2xl md:text-3xl font-black text-black uppercase mt-4 bg-white border-4 border-black px-6 py-2 inline-block">
                  {rank}
                </p>
              </div>
            </div>

            {/* Wallet Connection and Payment */}
            <div className="space-y-6 mb-8">
              {!isWalletConnected ? (
                <div className="text-center p-6 bg-yellow-200 border-4 border-black">
                  <p className="text-lg font-bold text-black mb-4">Connect your wallet to proceed</p>
                  <button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-lg text-white uppercase flex items-center justify-center gap-2"
                  >
                    <Wallet className="h-6 w-6" />
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 bg-green-200 border-4 border-black">
                  <p className="text-lg font-bold text-black mb-4">Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  <button
                    onClick={handlePaymentForScore}
                    disabled={isPaymentLoading}
                    className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-lg text-white uppercase ${
                      isPaymentLoading ? 'opacity-70' : ''
                    }`}
                  >
                    {isPaymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Pay 0.1 CELO to See Score'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Payment Status */}
            {paymentStatus !== 'idle' && (
              <div className="mb-6 p-4 border-4 border-black bg-blue-100">
                <p className="text-center font-black text-black">
                  {paymentStatus === 'approving' && 'Approving transaction...'}
                  {paymentStatus === 'processing' && 'Processing payment...'}
                  {paymentStatus === 'success' && 'Payment successful!'}
                  {paymentStatus === 'failed' && 'Payment failed. Please try again.'}
                </p>
                {transactionHash && (
                  <p className="text-center text-sm font-bold text-black mt-2">
                    Transaction: {transactionHash?.slice(0, 6)}...{transactionHash?.slice(-4)}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setScreen('quiz')}
                className="bg-white border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
              >
                ← Back to Quiz
              </button>
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'score' && selectedTopic && hasPaid) {
    const { correct, total, percentage, rank } = scoreData || calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white border-6 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                <Trophy className="h-12 w-12 md:h-16 md:w-16 text-black" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-black uppercase mb-2">
                Quiz Complete!
              </h1>
              <p className="text-lg md:text-xl font-bold text-gray-700">
                {selectedTopic.title} Challenge
              </p>
            </div>

            {/* Main Score */}
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
              <div className="text-center">
                <p className="text-sm md:text-base font-black text-black uppercase mb-2">
                  Your Score
                </p>
                <p className="text-7xl md:text-9xl font-black text-white [text-shadow:_4px_4px_0_rgb(0_0_0)]">
                  {percentage}%
                </p>
                <p className="text-2xl md:text-3xl font-black text-black uppercase mt-4 bg-white border-4 border-black px-6 py-2 inline-block">
                  {rank}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-400 border-4 border-black p-6 text-center">
                <p className="text-sm font-black text-black uppercase mb-1">Correct</p>
                <p className="text-4xl md:text-5xl font-black text-black">{correct}/{total}</p>
              </div>
              <div className="bg-cyan-400 border-4 border-black p-6 text-center">
                <p className="text-sm font-black text-black uppercase mb-1">Time Left</p>
                <p className="text-4xl md:text-5xl font-black text-black font-mono">{formatTime(timeLeft)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setScreen('review')}
                className="bg-white border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
              >
                📝 Review
              </button>
              <button
                onClick={() => {
                  setScreen('learn') // Go back to learn screen to restart quiz
                  setAnswers(Array(selectedTopic.questions.length).fill(null))
                  setTimeLeft(300)
                }}
                className="bg-yellow-400 border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
              >
                🔄 Retry
              </button>
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user tries to access score without payment
  if (screen === 'score' && !hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-300 via-orange-300 to-pink-400 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="bg-white border-6 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center">
            <h1 className="text-3xl md:text-5xl font-black text-black uppercase mb-4">
              Access Denied
            </h1>
            <p className="text-xl md:text-2xl font-bold text-gray-700 mb-8">
              You need to pay 0.1 CELO to access your score
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setScreen('payment')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-lg text-white uppercase"
              >
                Pay to Access Score
              </button>
              <button
                onClick={handleRestart}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-lg text-black uppercase"
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'review' && selectedTopic) {
    const { correct, total } = calculateScore()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
        {/* Header */}
        <div className="border-b-6 border-black bg-white sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-black uppercase">Answer Review</h1>
                <p className="text-base md:text-lg font-bold text-gray-700 mt-1">
                  {correct}/{total} Correct Answers
                </p>
              </div>
              <button 
                onClick={() => setScreen('score')}
                className="bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-sm text-black uppercase"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {selectedTopic.questions.map((question, qIndex) => {
            const userAnswer = answers[qIndex]
            const isCorrect = userAnswer === question.correctAnswer
            const wasAnswered = userAnswer !== null

            return (
              <div key={question.id} className="bg-white border-6 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex items-center justify-center w-10 h-10 bg-black text-white border-4 border-black text-base font-black flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <p className="text-lg md:text-xl font-black text-black leading-tight">
                      {question.text}
                    </p>
                  </div>
                  {wasAnswered ? (
                    isCorrect ? (
                      <div className="bg-green-400 border-4 border-black p-2">
                        <CheckCircle2 className="h-6 w-6 text-black" />
                      </div>
                    ) : (
                      <div className="bg-red-400 border-4 border-black p-2">
                        <XCircle className="h-6 w-6 text-black" />
                      </div>
                    )
                  ) : (
                    <span className="text-xs px-3 py-1 bg-gray-300 border-2 border-black font-black uppercase">
                      Skipped
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3 mb-4">
                  {question.options.map((option, oIndex) => {
                    const isUserAnswer = userAnswer === oIndex
                    const isCorrectAnswer = question.correctAnswer === oIndex
                    
                    return (
                      <div
                        key={oIndex}
                        className={`p-4 border-4 border-black ${
                          isCorrectAnswer
                            ? 'bg-green-300'
                            : isUserAnswer && !isCorrect
                            ? 'bg-red-300'
                            : 'bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`flex items-center justify-center w-8 h-8 border-3 border-black text-sm font-black ${
                              isCorrectAnswer || (isUserAnswer && !isCorrect)
                                ? 'bg-black text-white'
                                : 'bg-white text-black'
                            }`}>
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span className="text-base font-bold text-black">{option}</span>
                          </div>
                          {isCorrectAnswer && (
                            <span className="text-xs bg-white border-2 border-black px-2 py-1 font-black uppercase">
                              ✓ Correct
                            </span>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <span className="text-xs bg-white border-2 border-black px-2 py-1 font-black uppercase">
                              ✗ Your Pick
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-yellow-200 border-4 border-black p-4">
                  <p className="text-sm font-black text-black uppercase mb-2">💡 Explanation</p>
                  <p className="text-base font-bold text-black leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => setScreen('score')}
              className="bg-white border-4 border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
            >
              ← Back to Score
            </button>
            <button 
              onClick={handleRestart}
              className="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
            >
              🏠 New Topic
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'leaderboard') {
    const leaderboard = getLeaderboard()
    const groupedByTopic: { [key: string]: LeaderboardEntry[] } = {}
    
    leaderboard.forEach(entry => {
      if (!groupedByTopic[entry.topicId]) {
        groupedByTopic[entry.topicId] = []
      }
      groupedByTopic[entry.topicId].push(entry)
    })

    const allTimeTop = [...leaderboard].sort((a, b) => b.percentage - a.percentage).slice(0, 10)

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4 transform -rotate-1">
              <h1 className="text-4xl md:text-6xl font-black text-black uppercase flex items-center gap-4 justify-center">
                <Trophy className="h-12 w-12 md:h-16 md:w-16" />
                Leaderboard
              </h1>
            </div>
            <button
              onClick={() => setScreen('home')}
              className="bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-black text-base text-black uppercase"
            >
              ← Back Home
            </button>
          </div>

          {leaderboard.length === 0 ? (
            <div className="bg-white border-6 border-black p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-2xl font-black text-black uppercase mb-4">No Scores Yet!</p>
              <p className="text-lg font-bold text-gray-700">
                Complete a quiz to see your name here!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* All Time Top 10 */}
              <div className="bg-white border-6 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl md:text-3xl font-black text-black uppercase mb-6 flex items-center gap-3">
                  <Medal className="h-8 w-8 text-yellow-600" />
                  Top 10 All Time
                </h2>
                <div className="space-y-3">
                  {allTimeTop.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-4 border-4 border-black ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-300 to-orange-300' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-r from-orange-300 to-amber-400' :
                        'bg-gray-100'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-12 h-12 border-4 border-black font-black text-xl ${
                        index < 3 ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg md:text-xl font-black text-black truncate">
                          {entry.username}
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {entry.topicTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl md:text-3xl font-black text-black">
                          {entry.percentage}%
                        </p>
                        <p className="text-xs font-bold text-gray-700 uppercase">
                          {entry.rank}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Topic */}
              {Object.entries(groupedByTopic).map(([topicId, entries]) => {
                const topic = topics.find(t => t.id === topicId)
                if (!topic) return null
                
                const topEntries = entries.slice(0, 5)
                
                return (
                  <div key={topicId} className="bg-white border-6 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`bg-gradient-to-br ${topic.color} border-4 border-black p-3 text-white`}>
                        {topic.icon}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-black uppercase">
                        {topic.title} - Top 5
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {topEntries.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-4 p-4 border-4 border-black bg-gray-100"
                        >
                          <div className="flex items-center justify-center w-10 h-10 bg-white border-3 border-black font-black text-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base md:text-lg font-black text-black truncate">
                              {entry.username}
                            </p>
                            <p className="text-xs font-bold text-gray-600">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl md:text-2xl font-black text-black">
                              {entry.percentage}%
                            </p>
                            <p className="text-xs font-bold text-gray-600">
                              {entry.score}/{topics.find(t => t.id === topicId)?.questions.length}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
