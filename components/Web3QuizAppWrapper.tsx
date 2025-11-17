'use client'

import { useState, useEffect } from 'react'
import Web3QuizApp from './Web3QuizApp'

export default function Web3QuizAppWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <Web3QuizApp />
}
