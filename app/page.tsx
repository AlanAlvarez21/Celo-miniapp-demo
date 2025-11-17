import dynamic from 'next/dynamic'

const Web3QuizApp = dynamic(() => import('@/components/Web3QuizApp'), { ssr: false })

export default function Page() {
  return <Web3QuizApp />
}
