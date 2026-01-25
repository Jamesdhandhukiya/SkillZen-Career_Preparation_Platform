"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Clock, ArrowLeft, ArrowRight, CheckCircle, RotateCcw, Target, Settings, Timer, BarChart3, History } from "lucide-react"
import { QuotaManager } from "@/lib/quota-manager"

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface APIQuestion {
  question: string
  answer: string
  options: string[]
  explanation: string
}

interface APITopic {
  name: string
  value: string
  description: string
}

interface TestResult {
  id: string
  type: "practice" | "timed"
  difficulty: string
  duration?: number
  score: {
    correct: number
    total: number
    percentage: number
  }
  timestamp: Date
  questions: Question[]
  selectedAnswers: { [key: number]: number }
}

// Available API topics
const apiTopics: APITopic[] = [
  { name: "Mixture and Alligation", value: "mixture-and-alligation", description: "Problems involving mixing of different substances" },
  { name: "Profit and Loss", value: "profit-and-loss", description: "Business mathematics and financial calculations" },
  { name: "Pipes and Cisterns", value: "pipes-and-cisterns", description: "Work and time problems with pipes" },
  { name: "Age", value: "age", description: "Age-related word problems" },
  { name: "Permutation and Combination", value: "permutation-and-combination", description: "Arrangement and selection problems" },
  { name: "Speed Time Distance", value: "speed-time-distance", description: "Motion and travel problems" },
  { name: "Simple Interest", value: "simple-interest", description: "Basic interest calculations" },
  { name: "Calendars", value: "calendars", description: "Date and calendar problems" },
]

// API endpoint mapping to match exact API documentation
// Topic display names
const topicDisplayNames: { [key: string]: string } = {
  'mixture-and-alligation': 'Mixture and Alligation',
  'profit-and-loss': 'Profit and Loss',
  'pipes-and-cisterns': 'Pipes and Cisterns',
  'age': 'Age Problems',
  'permutation-and-combination': 'Permutation and Combination',
  'speed-time-distance': 'Speed, Time and Distance',
  'simple-interest': 'Simple Interest',
  'calendars': 'Calendar Problems'
}

// Fallback questions (keeping some for offline use)
const fallbackQuestions: Question[] = [
  {
    id: 1,
    category: "Quantitative",
    question: "If a train travels 120 km in 2 hours, what is its speed in km/h?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correctAnswer: 1,
    explanation: "Speed = Distance / Time = 120 km / 2 hours = 60 km/h",
    difficulty: "Easy",
  },
  {
    id: 2,
    category: "Logical Reasoning",
    question: "Complete the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "The differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42",
    difficulty: "Medium",
  },
  {
    id: 3,
    category: "Verbal Ability",
    question: "Choose the synonym for 'Abundant':",
    options: ["Scarce", "Plentiful", "Limited", "Rare"],
    correctAnswer: 1,
    explanation: "Abundant means existing in large quantities; plentiful.",
    difficulty: "Easy",
  },
]

// Generate questions using Gemini AI or fallback
const generateQuestions = async (topic: string, count: number, difficulty: string, setApiStatus?: (status: "checking" | "online" | "offline" | "quota-exceeded") => void, setQuotaInfo?: React.Dispatch<React.SetStateAction<{remaining: number, total: number} | null>>): Promise<Question[]> => {
  console.log(`📝 Generating ${count} questions for topic: ${topic} with difficulty: ${difficulty}`)
  
  // Check rate limiting before making API call
  if (QuotaManager.shouldWaitForRateLimit()) {
    console.log("⏳ Rate limiting: waiting before API call")
    setApiStatus?.("offline")
    throw new Error('Rate limit exceeded. Please wait before trying again.')
  }
  
  // Set status to checking when starting generation
  setApiStatus?.("checking")
  
  try {
    // Record API call time for rate limiting
    QuotaManager.recordApiCall()
    
    // Try to generate with Gemini AI
    const topicDisplayName = topicDisplayNames[topic] || topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    const prompt = `Create ${count} aptitude questions about ${topicDisplayName} at ${difficulty} level.

Return as JSON array with this exact format:
[{"question":"Question text here","options":["Option A text","Option B text","Option C text","Option D text"],"correctAnswer":"Option B text","explanation":"Explanation text"}]

Requirements:
- correctAnswer must be the EXACT text from one of the options
- Each question must have exactly 4 options
- Questions should be ${difficulty} difficulty level
- Include detailed explanations
- Return ONLY the JSON array, no other text

Topic: ${topicDisplayName}
Difficulty: ${difficulty}
Count: ${count}`

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })

    if (response.ok) {
      const data = await response.json()
      const responseText = data.response?.trim()
      
      if (responseText) {
        // Clean up the response
        let cleanedText = responseText
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        }
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        try {
          const generatedQuestions = JSON.parse(cleanedText)
          
          // Convert to our Question format
          const questions: Question[] = generatedQuestions.map((q: any, index: number) => {
            const correctIndex = q.options.findIndex((option: string) => option === q.correctAnswer)
            
            return {
              id: Date.now() + Math.random() * 1000 + index,
              category: topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              question: q.question,
              options: q.options,
              correctAnswer: correctIndex >= 0 ? correctIndex : 0,
              explanation: q.explanation || 'No explanation provided',
              difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) as "Easy" | "Medium" | "Hard"
            }
          })

          console.log(`✅ Generated ${questions.length} questions with Gemini AI`)
          setApiStatus?.("online") // Update status to online when successful
          // Update quota info (decrease by 1 for each generation)
          const updatedQuota = QuotaManager.decreaseQuota()
          setQuotaInfo?.(updatedQuota)
          return questions
        } catch (parseError) {
          console.error('Failed to parse Gemini response:', parseError)
          throw new Error('Failed to parse AI response')
        }
      }
    } else {
      // Handle specific error responses
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 429) {
        setApiStatus?.("quota-exceeded")
        console.log("🚫 Rate limit exceeded - please wait before trying again")
        throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.')
      } else if (errorData.error?.includes('quota')) {
        setApiStatus?.("quota-exceeded")
        throw new Error('API quota exceeded')
      }
    }
    
    throw new Error('Gemini AI not available')
  } catch (error) {
    console.log('🔄 Using fallback questions:', error instanceof Error ? error.message : 'Unknown error')
    
    // Fallback to sample questions
    const shuffledQuestions = [...fallbackQuestions].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(count, fallbackQuestions.length))
    
    const questions: Question[] = selectedQuestions.map((q, index) => ({
      ...q,
      id: Date.now() + Math.random() * 1000 + index,
      category: topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) as "Easy" | "Medium" | "Hard"
    }))
    
    console.log(`✅ Generated ${questions.length} fallback questions`)
    setApiStatus?.("offline") // Update status to offline when using fallback
    return questions
  }
}


export default function AptitudePage() {
  const [mode, setMode] = useState<"practice" | "test" | "config" | "results">("config")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isTestActive, setIsTestActive] = useState(false)
  const [difficulty, setDifficulty] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [topic, setTopic] = useState<string>("")
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [testHistory, setTestHistory] = useState<TestResult[]>([])
  const [currentTestType, setCurrentTestType] = useState<"practice" | "timed">("practice")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set())
  const [selectedTestResult, setSelectedTestResult] = useState<TestResult | null>(null)
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline" | "quota-exceeded">("checking")
  const [quotaInfo, setQuotaInfo] = useState<{remaining: number, total: number} | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTestActive && timeLeft > 0 && !showResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      handleSubmitTest()
    }
    return () => clearTimeout(timer)
  }, [isTestActive, timeLeft, showResults])

  // Check API status with caching to avoid unnecessary calls
  const checkApiStatus = async (forceCheck?: boolean) => {
    // Check if we have a cached status and it's recent
    if (!forceCheck) {
      const cachedStatus = QuotaManager.getApiStatus()
      const cachedQuota = QuotaManager.getQuotaInfo()
      
      if (cachedStatus !== "offline" && cachedQuota) {
        console.log("📋 Using cached API status:", cachedStatus)
        setApiStatus(cachedStatus)
        setQuotaInfo(cachedQuota)
        return
      }
    }
    
    // Check rate limiting
    if (QuotaManager.shouldWaitForRateLimit()) {
      console.log("⏳ Rate limiting: waiting before API call")
      setApiStatus("offline")
      return
    }
    
    setApiStatus("checking")
    console.log("🔍 Checking API status...")
    
    try {
      // Record API call time for rate limiting
      QuotaManager.recordApiCall()
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Test connection'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.response && !data.error) {
          console.log("✅ API is online and working")
          setApiStatus("online")
          
          // Use shared quota manager
          const quotaData = QuotaManager.getQuotaInfo() || QuotaManager.resetQuota()
          setQuotaInfo(quotaData)
          QuotaManager.setApiStatus("online")
        } else {
          console.log("❌ API response invalid:", data)
          setApiStatus("offline")
          QuotaManager.setApiStatus("offline")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.log(`❌ API error: ${response.status}`, errorData)
        
        if (response.status === 429) {
          setApiStatus("quota-exceeded")
          const quotaData = QuotaManager.resetQuota(0) // Set to 0 remaining
          setQuotaInfo(quotaData)
          QuotaManager.setApiStatus("quota-exceeded")
          console.log("🚫 Rate limit exceeded - please wait before trying again")
        } else if (errorData.error?.includes('quota')) {
          setApiStatus("quota-exceeded")
          const quotaData = QuotaManager.resetQuota(0)
          setQuotaInfo(quotaData)
          QuotaManager.setApiStatus("quota-exceeded")
        } else {
          setApiStatus("offline")
          QuotaManager.setApiStatus("offline")
        }
      }
    } catch (error) {
      console.error("Error checking API status:", error)
      setApiStatus("offline")
      QuotaManager.setApiStatus("offline")
    }
  }

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus()
  }, [])


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    const totalQuestions = filteredQuestions.length || fallbackQuestions.length
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    const score = calculateScore()
    const testResult: TestResult = {
      id: Date.now().toString(),
      type: currentTestType,
      difficulty: difficulty,
      duration: currentTestType === "timed" ? getDurationInSeconds(duration) : undefined,
      score: score,
      timestamp: new Date(),
      questions: filteredQuestions.length > 0 ? filteredQuestions : fallbackQuestions,
      selectedAnswers: selectedAnswers
    }
    
    setTestHistory(prev => [testResult, ...prev])
    setShowResults(true)
    setIsTestActive(false)
  }

  const calculateScore = () => {
    let correct = 0
    const questionsToCheck = filteredQuestions.length > 0 ? filteredQuestions : fallbackQuestions
    questionsToCheck.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: questionsToCheck.length,
      percentage: Math.round((correct / questionsToCheck.length) * 100),
    }
  }

  const filterQuestionsByDifficulty = (questions: Question[], difficultyLevel: string) => {
    if (difficultyLevel === "all") {
      return questions
    }
    return questions.filter(q => q.difficulty.toLowerCase() === difficultyLevel.toLowerCase())
  }

  const getDurationInSeconds = (durationStr: string) => {
    switch (durationStr) {
      // case "5": return 300 // 5 minutes
      // case "10": return 600 // 10 minutes
      case "15": return 900 // 15 minutes
      case "30": return 1800 // 30 minutes
      case "45": return 2700 // 45 minutes
      case "60": return 3600 // 60 minutes
      default: return 1800 // default 30 minutes
    }
  }

  const getQuestionCountByDuration = (durationStr: string, isPractice: boolean = false) => {
    if (isPractice) return 10 // Practice mode always uses 10 questions
    
    switch (durationStr) {
      case "15": return 8
      case "30": return 20
      case "45": return 25
      case "60": return 30
      default: return 20 // default 30 minutes = 20 questions
    }
  }

  const startTest = async () => {
    if (!difficulty || !duration || !topic) return
    
    setIsLoading(true)
    setError("")
    
    try {
      let questions: Question[] = []
      const questionCount = getQuestionCountByDuration(duration, false) // Get count based on duration
      console.log(`🚀 Starting test with ${questionCount} questions for ${duration} minutes`)
      
      // Generate questions
      console.log(`📝 Generating ${questionCount} questions...`)
      questions = await generateQuestions(topic, questionCount, difficulty, setApiStatus, setQuotaInfo)
      console.log(`✅ Generated ${questions.length} questions`)
      
      // Track used question IDs to avoid repetition
      const newUsedIds = new Set(usedQuestionIds)
      questions.forEach(q => newUsedIds.add(q.id))
      setUsedQuestionIds(newUsedIds)
      
      setFilteredQuestions(questions)
    setMode("test")
    setIsTestActive(true)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
      setTimeLeft(getDurationInSeconds(duration))
      setCurrentTestType("timed")
    } catch (err) {
      console.error("Error starting test:", err)
      setError("Failed to load test questions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const startPractice = async () => {
    if (!difficulty || !topic) return
    
    setIsLoading(true)
    setError("")
    
    try {
      let questions: Question[] = []
      const questionCount = getQuestionCountByDuration("", true) // Always 10 for practice
      
      // Generate questions
      console.log(`📝 Generating ${questionCount} questions...`)
      questions = await generateQuestions(topic, questionCount, difficulty, setApiStatus, setQuotaInfo)
      console.log(`✅ Generated ${questions.length} questions`)
      
      // Track used question IDs to avoid repetition
      const newUsedIds = new Set(usedQuestionIds)
      questions.forEach(q => newUsedIds.add(q.id))
      setUsedQuestionIds(newUsedIds)
      
      setFilteredQuestions(questions)
      setMode("practice")
      setCurrentQuestion(0)
      setSelectedAnswers({})
      setShowResults(false)
      setCurrentTestType("practice")
    } catch (err) {
      console.error("Error starting practice:", err)
      setError("Failed to load practice questions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetTest = () => {
    setMode("config")
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setIsTestActive(false)
    setTimeLeft(1800)
    setDifficulty("")
    setDuration("")
    setTopic("")
    setFilteredQuestions([])
    setError("")
    setRetryCount(0)
    // Don't clear usedQuestionIds to maintain question uniqueness across sessions
  }


  const clearTestHistory = () => {
    setTestHistory([])
    setError("Test history cleared successfully.")
  }

  const retryAPICall = async () => {
    setRetryCount(prev => prev + 1)
    setError("")
    
    if (currentTestType === "timed") {
      await startTest()
    } else {
      await startPractice()
    }
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Test Completed!</CardTitle>
              <CardDescription className="text-gray-600">Here are your results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{score.correct}</p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{score.percentage}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">{score.total}</p>
                  <p className="text-sm text-gray-600">Total Questions</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Detailed Results</h3>
                {(filteredQuestions.length > 0 ? filteredQuestions : fallbackQuestions).map((question, index) => {
                  const userAnswer = selectedAnswers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer
                  return (
                    <div key={question.id} className="text-left p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={isCorrect ? "default" : "destructive"}>
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                        <Badge variant="outline">{question.category}</Badge>
                      </div>
                      <p className="font-medium mb-2 text-gray-800">{question.question}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        Your answer: {userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}
                      </p>
                      <p className="text-sm text-green-600 mb-2">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                      <p className="text-sm text-gray-500">{question.explanation}</p>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetTest} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/dashboard">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Fixed at top */}
      <header className="border-b bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Aptitude Practice
            </span>
          </div>
          
          <div className="text-sm text-gray-300">
            Test your skills
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto pt-28 px-4">

        {mode === "config" && (
          <Card className="bg-white border-gray-200 shadow-xl mb-8">
              <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-800">
                    <Settings className="w-5 h-5 mr-2 text-red-600" />
                    Test Configuration
                </CardTitle>
                  <CardDescription className="text-gray-600">
                    Select your preferred difficulty level and test duration
                  </CardDescription>
                </div>
                
                {/* API Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 border">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        apiStatus === "online" ? "bg-green-500" : 
                        apiStatus === "offline" ? "bg-red-500" : 
                        apiStatus === "quota-exceeded" ? "bg-orange-500" :
                        "bg-yellow-500 animate-pulse"
                      }`}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {apiStatus === "online" ? "AI Online" : 
                         apiStatus === "offline" ? "AI Offline" : 
                         apiStatus === "quota-exceeded" ? "Quota Exceeded" :
                         "Checking AI..."}
                      </span>
                      {apiStatus === "offline" && (
                        <span className="text-xs text-gray-500 mt-1">
                          Using sample questions - fully functional
                        </span>
                      )}
                      {apiStatus === "quota-exceeded" && (
                        <span className="text-xs text-orange-600 mt-1">
                          Rate limit exceeded - please wait a few minutes
                        </span>
                      )}
                      {apiStatus === "online" && quotaInfo && (
                        <span className={`text-xs mt-1 ${
                          quotaInfo.remaining <= 100 ? 'text-red-600' : 
                          quotaInfo.remaining <= 300 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {quotaInfo.remaining}/{quotaInfo.total} requests remaining
                          {quotaInfo.remaining <= 100 && ' - Low quota!'}
                        </span>
                      )}
                    </div>
                    <Button 
                      onClick={() => checkApiStatus()} 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      disabled={apiStatus === "checking"}
                    >
                      <RotateCcw className={`w-3 h-3 ${apiStatus === "checking" ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>
                
                {/* Quota Progress Bar */}
                {apiStatus === "online" && quotaInfo && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>API Quota</span>
                      <span>{quotaInfo.remaining} remaining</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          quotaInfo.remaining <= 50 ? 'bg-red-500' : 
                          quotaInfo.remaining <= 150 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${(quotaInfo.remaining / quotaInfo.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
              </div>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Selection */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                  Topic
                </Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiTopics.map((apiTopic) => (
                      <SelectItem key={apiTopic.value} value={apiTopic.value}>
                        {apiTopic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {topic && topic !== "fallback" && (
                  <p className="text-xs text-gray-500">
                    {apiTopics.find(t => t.value === topic)?.description}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Difficulty Selection */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
                    Difficulty Level
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                    Test Duration
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-yellow-800 text-sm">{error}</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        The app will use sample questions instead. You can still take the test normally.
                      </p>
                      {retryCount < 3 && topic !== "fallback" && (
                        <div className="mt-3">
                          <Button
                            onClick={retryAPICall}
                            disabled={isLoading}
                            size="sm"
                            variant="outline"
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                          >
                            {isLoading ? (
                              <>
                                <div className="w-3 h-3 mr-2 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
                                Retrying...
                              </>
                            ) : (
                              `Retry (${retryCount}/3)`
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={startPractice} 
                  disabled={!difficulty || !topic || isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Start Practice (10 Q)
                    </>
                  )}
                </Button>
                <Button 
                  onClick={startTest} 
                  disabled={!difficulty || !duration || !topic || isLoading}
                  className="bg-black hover:bg-gray-800 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Timer className="w-4 h-4 mr-2" />
                      Start Test ({getQuestionCountByDuration(duration, false)} Q)
                    </>
                  )}
                </Button>
              </div>

              {/* Question Pool Management */}

              {/* Info Cards */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Practice Mode (10 Questions)</h4>
                  <p className="text-sm text-blue-700">
                    Get instant feedback on each question. Perfect for learning and skill building.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    • No time limit • Instant feedback • 10 questions per session
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    Timed Test {duration ? `(${getQuestionCountByDuration(duration)} Questions)` : ''}
                  </h4>
                  <p className="text-sm text-green-700">
                    Complete the test within the selected time limit. Get your final score at the end.
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    • 15min: 8 questions • 30min: 20 questions • 45min: 25 questions • 60min: 30 questions
                  </p>
                  {duration && (
                    <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-700 font-medium">
                      Selected: {duration} duration = {getQuestionCountByDuration(duration)} questions
                    </div>
                  )}
                </div>
              </div>
              </CardContent>
            </Card>
        )}

        {/* Results Section */}
        {mode === "results" && (
          <Card className="bg-white border-gray-200 shadow-xl mb-8">
              <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-800">
                    <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
                    Test Results History
                </CardTitle>
                  <CardDescription className="text-gray-600">
                    View all your practice and timed test results
                  </CardDescription>
                </div>
                {testHistory.length > 0 && (
                  <Button 
                    onClick={clearTestHistory}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                )}
              </div>
              </CardHeader>
              <CardContent>
              {testHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No test results yet. Take a test to see your results here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testHistory.map((result, index) => (
                    <div 
                      key={result.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("Clicked on test result:", result)
                        console.log("Questions in result:", result.questions?.length || 0)
                        setSelectedTestResult(result)
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant={result.type === "timed" ? "default" : "secondary"}>
                            {result.type === "timed" ? "Timed Test" : "Practice"}
                          </Badge>
                          <Badge variant="outline">{result.difficulty}</Badge>
                          {result.duration && (
                            <Badge variant="outline">
                              {Math.floor(result.duration / 60)} min
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {result.timestamp.toLocaleDateString()} {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{result.score.correct}</p>
                          <p className="text-sm text-gray-600">Correct</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-600">{result.score.total}</p>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{result.score.percentage}%</p>
                          <p className="text-sm text-gray-600">Score</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMode("config")
                              setDifficulty(result.difficulty)
                              setDuration(result.duration ? Math.floor(result.duration / 60).toString() : "")
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Retake Test
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <span>{result.questions.length} questions</span>
                          <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view details →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => setMode("config")}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Back to Configuration
                </Button>
              </div>
              </CardContent>
            </Card>
        )}

        {/* Detailed Test Result View */}
        {selectedTestResult && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
            Debug: selectedTestResult is set with {selectedTestResult.questions?.length || 0} questions
          </div>
        )}
        {selectedTestResult && (
          <Card className="bg-white border-gray-200 shadow-xl mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-gray-800">
                    <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
                    Test Result Details
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {selectedTestResult.type === "timed" ? "Timed Test" : "Practice Test"} - {selectedTestResult.difficulty} Level
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setSelectedTestResult(null)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Test Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{selectedTestResult.score.correct}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">{selectedTestResult.score.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedTestResult.score.percentage}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedTestResult.questions?.length || 0}</p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
              </div>

              {/* Questions and Answers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions & Answers</h3>
                {selectedTestResult.questions && selectedTestResult.questions.length > 0 ? (
                  selectedTestResult.questions.map((question, index) => {
                    const userAnswer = selectedTestResult.selectedAnswers?.[question.id]
                    const isCorrect = userAnswer === question.correctAnswer
                    
                    return (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{question.question}</p>
                        
                        <div className="space-y-2">
                          {question.options && question.options.map((option, optionIndex) => {
                            let optionClass = "p-3 rounded-lg border "
                            if (optionIndex === question.correctAnswer) {
                              optionClass += "bg-green-50 border-green-200 text-green-800"
                            } else if (optionIndex === userAnswer && !isCorrect) {
                              optionClass += "bg-red-50 border-red-200 text-red-800"
                            } else {
                              optionClass += "bg-gray-50 border-gray-200 text-gray-700"
                            }
                            
                            return (
                              <div key={optionIndex} className={optionClass}>
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <span>{option}</span>
                                  {optionIndex === question.correctAnswer && (
                                    <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                                  )}
                                  {optionIndex === userAnswer && !isCorrect && (
                                    <div className="w-4 h-4 ml-2 rounded-full bg-red-600 flex items-center justify-center">
                                      <span className="text-white text-xs">✕</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No questions found in this test result.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Interface */}
        {(mode === "practice" || isTestActive) && (
          <div className="space-y-6">
            {/* Progress and Timer */}
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {filteredQuestions.length || fallbackQuestions.length}
                    </span>
                    <Progress value={((currentQuestion + 1) / (filteredQuestions.length || fallbackQuestions.length)) * 100} className="w-32" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {difficulty && (
                      <Badge variant="outline" className="text-xs">
                        {difficulty} Level
                      </Badge>
                    )}
                    {topic && (
                      <Badge variant="secondary" className="text-xs">
                        {apiTopics.find(t => t.value === topic)?.name || topic}
                      </Badge>
                    )}
                    <Badge variant={isTestActive ? "destructive" : "default"} className="text-xs">
                      {isTestActive ? "Timed Test" : "Practice Mode"}
                    </Badge>
                  {isTestActive && (
                      <div className="flex items-center space-x-2 text-red-600 ml-4">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                  )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).category}</Badge>
                </div>
                <CardTitle className="text-lg text-gray-800">{(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  key={currentQuestion} // Reset RadioGroup when question changes
                  value={selectedAnswers[(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).id]?.toString()}
                  onValueChange={(value) =>
                    handleAnswerSelect((filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).id, Number.parseInt(value))
                  }
                >
                  {(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-800">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {mode === "practice" && selectedAnswers[(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).id] !== undefined && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-800 mb-2">
                      {selectedAnswers[(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).id] ===
                      (filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).correctAnswer
                        ? "✅ Correct!"
                        : "❌ Incorrect"}
                    </p>
                    <p className="text-sm text-red-700">{(filteredQuestions[currentQuestion] || fallbackQuestions[currentQuestion]).explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentQuestion === (filteredQuestions.length || fallbackQuestions.length) - 1 ? (
                  <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700 text-white">
                    Submit Test
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700 text-white">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

