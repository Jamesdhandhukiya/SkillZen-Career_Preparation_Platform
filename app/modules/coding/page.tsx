"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Code, Play, RotateCcw, Clock, Target, Users, Award } from "lucide-react"
import { QuotaManager } from "@/lib/quota-manager"

// DSA Topics
const dsaTopics = [
  { id: "arrays", name: "Arrays", subtopics: ["Array Manipulation", "Two Pointers", "Sliding Window", "Prefix Sum", "Array Rotation"] },
  { id: "strings", name: "Strings", subtopics: ["String Manipulation", "Pattern Matching", "String Algorithms", "Parsing", "Encoding/Decoding"] },
  { id: "linked-lists", name: "Linked Lists", subtopics: ["Singly Linked List", "Doubly Linked List", "Circular Linked List", "List Operations", "List Algorithms"] },
  { id: "stacks", name: "Stacks", subtopics: ["Stack Operations", "Monotonic Stack", "Expression Evaluation", "Stack-based Algorithms", "Parentheses Matching"] },
  { id: "queues-deques", name: "Queues & Deques", subtopics: ["Queue Operations", "Priority Queue", "Circular Queue", "Deque Operations", "Queue-based Algorithms"] },
  { id: "trees", name: "Trees", subtopics: ["Binary Trees", "Tree Traversal", "Tree Construction", "Tree Properties", "Tree Algorithms"] },
  { id: "binary-search-trees", name: "Binary Search Trees", subtopics: ["BST Operations", "BST Properties", "BST Traversal", "BST Construction", "BST Algorithms"] },
  { id: "heaps", name: "Heaps / Priority Queues", subtopics: ["Heap Operations", "Heap Sort", "Priority Queue", "Heap Properties", "Heap Algorithms"] },
  { id: "hashing", name: "Hashing", subtopics: ["Hash Tables", "Hash Functions", "Collision Handling", "Hash-based Algorithms", "Distributed Hashing"] },
  { id: "graphs", name: "Graphs", subtopics: ["Graph Representation", "Graph Traversal", "Shortest Path", "Minimum Spanning Tree", "Topological Sort"] },
  { id: "searching", name: "Searching Algorithms", subtopics: ["Linear Search", "Binary Search", "Ternary Search", "Exponential Search", "Interpolation Search"] },
  { id: "sorting", name: "Sorting Algorithms", subtopics: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Radix Sort"] },
  { id: "divide-conquer", name: "Divide & Conquer", subtopics: ["Merge Sort", "Quick Sort", "Binary Search", "Fast Exponentiation", "Strassen's Algorithm"] },
  { id: "greedy", name: "Greedy Algorithms", subtopics: ["Activity Selection", "Huffman Coding", "Minimum Spanning Tree", "Shortest Path", "Knapsack Problems"] },
  { id: "dynamic-programming", name: "Dynamic Programming", subtopics: ["Memoization", "Tabulation", "1D DP", "2D DP", "String DP", "Tree DP"] },
  { id: "backtracking", name: "Backtracking", subtopics: ["N-Queens", "Sudoku Solver", "Permutations", "Combinations", "Subset Generation"] },
  { id: "bit-manipulation", name: "Bit Manipulation", subtopics: ["Bitwise Operations", "Bit Masking", "Bit Counting", "Bit Shifting", "Bit Algorithms"] }
]

// Database Topics
const databaseTopics = [
  { id: "basic-queries", name: "Basic Queries", subtopics: ["SELECT", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "DISTINCT"] },
  { id: "joins", name: "Joins", subtopics: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "SELF JOIN", "CROSS JOIN"] },
  { id: "subqueries", name: "Subqueries", subtopics: ["Scalar Subqueries", "Correlated Subqueries", "EXISTS", "IN", "ANY/ALL"] },
  { id: "aggregate-functions", name: "Aggregate Functions", subtopics: ["COUNT", "SUM", "AVG", "MIN", "MAX", "GROUP_CONCAT"] },
  { id: "set-operations", name: "Set Operations", subtopics: ["UNION", "INTERSECT", "EXCEPT", "Set Theory", "Set Comparison"] },
  { id: "window-functions", name: "Window Functions", subtopics: ["ROW_NUMBER", "RANK", "DENSE_RANK", "LEAD/LAG", "FIRST_VALUE/LAST_VALUE"] },
  { id: "views", name: "Views", subtopics: ["Creating Views", "Updating Views", "Materialized Views", "View Security", "View Optimization"] },
  { id: "indexing", name: "Indexing", subtopics: ["Primary Index", "Secondary Index", "Composite Index", "Index Types", "Index Optimization"] },
  { id: "top-n-queries", name: "Top-N Queries", subtopics: ["Nth Highest Salary", "Top K Elements", "Ranking Queries", "Pagination", "Limit/Offset"] },
  { id: "duplicates", name: "Duplicates Handling", subtopics: ["Finding Duplicates", "Removing Duplicates", "Duplicate Prevention", "Duplicate Analysis", "Data Cleaning"] },
  { id: "normalization", name: "Normalization", subtopics: ["1NF", "2NF", "3NF", "BCNF", "Denormalization", "Normal Forms"] },
  { id: "er-diagram", name: "ER Diagram → SQL Schema", subtopics: ["Entity Mapping", "Relationship Mapping", "Attribute Mapping", "Constraint Mapping", "Schema Design"] },
  { id: "transactions", name: "Transactions & ACID", subtopics: ["Atomicity", "Consistency", "Isolation", "Durability", "Transaction Control"] },
  { id: "deadlocks", name: "Deadlocks", subtopics: ["Deadlock Detection", "Deadlock Prevention", "Deadlock Avoidance", "Deadlock Recovery", "Lock Management"] },
  { id: "query-optimization", name: "Query Optimization", subtopics: ["Query Planning", "Index Usage", "Join Optimization", "Query Rewriting", "Performance Tuning"] }
]

// Problem-Solving Topics
const problemSolvingTopics = [
  { id: "mathematics", name: "Mathematics", subtopics: ["GCD", "LCM", "Modular Arithmetic", "Primes", "Sieve of Eratosthenes", "Number Theory"] },
  { id: "number-theory", name: "Number Theory", subtopics: ["Prime Numbers", "Factorization", "Modular Arithmetic", "Euclidean Algorithm", "Chinese Remainder Theorem"] },
  { id: "recursion", name: "Recursion", subtopics: ["Base Cases", "Recursive Calls", "Tail Recursion", "Memoization", "Recursive Backtracking"] },
  { id: "combinatorics", name: "Combinatorics", subtopics: ["Permutations", "Combinations", "Binomial Coefficients", "Pigeonhole Principle", "Inclusion-Exclusion"] },
  { id: "string-matching", name: "String Matching Algorithms", subtopics: ["KMP Algorithm", "Rabin-Karp", "Z-Algorithm", "Boyer-Moore", "Aho-Corasick"] },
  { id: "geometry", name: "Geometry", subtopics: ["Convex Hull", "Line Intersection", "Point in Polygon", "Distance Calculations", "Geometric Algorithms"] },
  { id: "game-theory", name: "Game Theory", subtopics: ["Nim Game", "Grundy Numbers", "Minimax", "Alpha-Beta Pruning", "Game Strategies"] },
  { id: "simulation", name: "Simulation & Implementation", subtopics: ["State Machines", "Event Simulation", "Process Simulation", "System Modeling", "Implementation Problems"] }
]

const difficulties = [
  { id: "easy", name: "Easy", description: "Basic concepts and simple implementations" },
  { id: "medium", name: "Medium", description: "Intermediate problems requiring good understanding" },
  { id: "hard", name: "Hard", description: "Advanced problems with complex algorithms" }
]

const testTypes = [
  { id: "practice", name: "Practice Test", description: "No time limit - learn at your own pace" },
  { id: "timed", name: "Timed Test", description: "Time-limited test to simulate real conditions" }
]

const durations = [
  { id: "15", name: "15 minutes", description: "Quick practice session" },
  { id: "30", name: "30 minutes", description: "Standard practice session" },
  { id: "45", name: "45 minutes", description: "Extended practice session" },
  { id: "60", name: "60 minutes", description: "Comprehensive practice session" }
]

export default function CodingPage() {
  const [mode, setMode] = useState<"config" | "practice">("config")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedTestType, setSelectedTestType] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<string>("30")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline" | "quota-exceeded">("checking")
  const [quotaInfo, setQuotaInfo] = useState<{remaining: number, total: number} | null>(null)

  // Get topics based on selected category
  const getTopics = () => {
    switch (selectedCategory) {
      case "dsa": return dsaTopics
      case "database": return databaseTopics
      case "problem-solving": return problemSolvingTopics
      default: return []
    }
  }

  // Get subtopics based on selected topic
  const getSubtopics = () => {
    const topics = getTopics()
    const topic = topics.find(t => t.id === selectedTopic)
    return topic?.subtopics || []
  }

  // Check API status
  const checkApiStatus = async () => {
    // Check if we have a cached status and it's recent
    const cachedStatus = QuotaManager.getApiStatus()
    const cachedQuota = QuotaManager.getQuotaInfo()
    
    if (cachedStatus !== "offline" && cachedQuota) {
      console.log("📋 Using cached API status:", cachedStatus)
      setApiStatus(cachedStatus)
      setQuotaInfo(cachedQuota)
      return
    }
    
    // Check rate limiting
    if (QuotaManager.shouldWaitForRateLimit()) {
      console.log("⏳ Rate limiting: waiting before API call")
      setApiStatus("offline")
      return
    }
    
    setApiStatus("checking")
    try {
      // Record API call time for rate limiting
      QuotaManager.recordApiCall()
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Test connection' })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.response && !data.error) {
          setApiStatus("online")
          
          // Use shared quota manager
          const quotaData = QuotaManager.getQuotaInfo() || QuotaManager.resetQuota()
          setQuotaInfo(quotaData)
          QuotaManager.setApiStatus("online")
        } else {
          setApiStatus("offline")
          QuotaManager.setApiStatus("offline")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
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
      setApiStatus("offline")
      QuotaManager.setApiStatus("offline")
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  const handleStartCoding = () => {
    if (!selectedCategory || !selectedTopic || !selectedDifficulty || !selectedTestType) {
      alert("Please select all required fields")
      return
    }
    
    if (selectedTestType === "timed" && !selectedDuration) {
      alert("Please select a duration for timed test")
      return
    }
    
    // Build URL with configuration parameters
    const params = new URLSearchParams({
      category: selectedCategory,
      topic: selectedTopic,
      subtopic: selectedSubtopic,
      difficulty: selectedDifficulty,
      testType: selectedTestType,
      questionCount: questionCount.toString()
    })
    
    if (selectedTestType === "timed") {
      params.append('duration', selectedDuration)
    }
    
    // Navigate to coding test page with configuration
    window.location.href = `/modules/coding/test?${params.toString()}`
  }

  if (mode === "practice") {
    // This would be the existing coding practice interface
    // For now, we'll show a placeholder
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header - Fixed at top */}
        <header className="border-b bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button 
              onClick={() => setMode("config")} 
              variant="ghost" 
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Configuration
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Coding Practice
              </span>
            </div>
            
            <div className="text-sm text-gray-300">
              {selectedCategory} • {getTopics().find(t => t.id === selectedTopic)?.name} • {selectedDifficulty} • {testTypes.find(t => t.id === selectedTestType)?.name}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto pt-28 px-4">
          <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Coding Practice Interface</h2>
              <p className="text-gray-600 mb-6">
                This is where the actual coding problems and editor would be displayed.
              </p>
              <Button 
                onClick={() => setMode("config")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Configure New Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900">
      {/* Header - Fixed at top */}
      <header className="border-b bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Coding Practice
            </span>
          </div>
          
          <div className="text-sm text-gray-300">
            Master your coding skills
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto pt-28 px-4 pb-8">
        {/* Configuration Card */}
        <Card className="bg-white border-gray-200 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-800">
                  <Target className="w-5 h-5 mr-2 text-red-600" />
                  Test Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select your preferred category, topic, and difficulty level
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
                    onClick={checkApiStatus} 
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

          <CardContent className="space-y-8">
            {/* Row 1: Category and Difficulty Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Selection */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-600" />
                    Category
                  </CardTitle>
                  <CardDescription>Choose the type of coding problems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Category Buttons */}
                    <div className="space-y-3">
                      <Button
                        variant={selectedCategory === "dsa" ? "default" : "outline"}
                        onClick={() => {
                          setSelectedCategory("dsa")
                          setSelectedTopic("")
                          setSelectedSubtopic("all")
                        }}
                        className={`w-full justify-start h-auto p-4 ${
                          selectedCategory === "dsa" 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                            : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">Data Structures & Algorithms</div>
                          <div className="text-sm opacity-70">Arrays, Trees, Graphs, Dynamic Programming, etc.</div>
          </div>
                      </Button>
                      
                      <Button
                        variant={selectedCategory === "database" ? "default" : "outline"}
                        onClick={() => {
                          setSelectedCategory("database")
                          setSelectedTopic("")
                          setSelectedSubtopic("all")
                        }}
                        className={`w-full justify-start h-auto p-4 ${
                          selectedCategory === "database" 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                            : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">Database & SQL</div>
                          <div className="text-sm opacity-70">Queries, Joins, Optimization, Transactions, etc.</div>
                        </div>
                      </Button>
                      
                      <Button
                        variant={selectedCategory === "problem-solving" ? "default" : "outline"}
                        onClick={() => {
                          setSelectedCategory("problem-solving")
                          setSelectedTopic("")
                          setSelectedSubtopic("all")
                        }}
                        className={`w-full justify-start h-auto p-4 ${
                          selectedCategory === "problem-solving" 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                            : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">Problem Solving</div>
                          <div className="text-sm opacity-70">Mathematics, Recursion, String Algorithms, etc.</div>
                      </div>
                      </Button>
                    </div>

                    {/* Topic and Subtopic Selection - Only show when category is selected */}
                    {selectedCategory && (
                      <div className="border-t pt-6 space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Topic</label>
                          <Select value={selectedTopic} onValueChange={(value) => {
                            setSelectedTopic(value)
                            setSelectedSubtopic("all")
                          }}>
                            <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                              {getTopics().map((topic) => (
                                <SelectItem key={topic.id} value={topic.id}>
                    <div>
                                    <div className="font-medium">{topic.name}</div>
                                    <div className="text-xs text-gray-500">{topic.subtopics.length} subtopics available</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                    </div>

                        {/* Subtopic Selection */}
                        {selectedTopic && getSubtopics().length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Subtopic (Optional)</label>
                            <Select value={selectedSubtopic} onValueChange={setSelectedSubtopic}>
                              <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                                <SelectValue placeholder="Select a subtopic" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Subtopics</SelectItem>
                                {getSubtopics().map((subtopic) => (
                                  <SelectItem key={subtopic} value={subtopic}>
                                    {subtopic}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Selection */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2 text-red-600" />
                    Difficulty
                  </CardTitle>
                  <CardDescription>Choose the difficulty level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty.id}
                        variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                        onClick={() => setSelectedDifficulty(difficulty.id)}
                        className={`w-full justify-start h-auto p-4 ${
                          selectedDifficulty === difficulty.id 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                            : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{difficulty.name}</div>
                          <div className="text-sm opacity-70">{difficulty.description}</div>
                        </div>
                      </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
                    </div>

            {/* Row 2: Test Type and Problems Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Test Type Selection */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-red-600" />
                    Test Type
                  </CardTitle>
                  <CardDescription>Choose your test mode</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testTypes.map((testType) => (
                      <Button
                        key={testType.id}
                        variant={selectedTestType === testType.id ? "default" : "outline"}
                        onClick={() => setSelectedTestType(testType.id)}
                        className={`w-full justify-start h-auto p-4 ${
                          selectedTestType === testType.id 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                            : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{testType.name}</div>
                          <div className="text-sm opacity-70">{testType.description}</div>
                        </div>
                      </Button>
                    ))}
                    </div>
                  </CardContent>
                </Card>

              {/* Problems Selection */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-red-600" />
                    Problems
                  </CardTitle>
                  <CardDescription>Number of problems to solve</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Number of Problems</label>
                      <Select 
                        value={questionCount.toString()} 
                        onValueChange={(value) => setQuestionCount(parseInt(value))}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 5, 10, 15, 20].map((count) => (
                            <SelectItem key={count} value={count.toString()}>
                              {count} problems
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration - Only show for timed tests */}
                    {selectedTestType === "timed" && (
                      <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                          <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.id} value={duration.id}>
                                <div>
                                  <div className="font-medium">{duration.name}</div>
                                  <div className="text-xs text-gray-500">{duration.description}</div>
                    </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                      </div>
                  </CardContent>
                </Card>
                      </div>


            {/* Start Button */}
            <div className="pt-6">
              <Button 
                onClick={handleStartCoding}
                size="lg" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={!selectedCategory || !selectedTopic || !selectedDifficulty || !selectedTestType}
              >
                <Play className="w-5 h-5 mr-2" />
                {selectedTestType === "practice" ? "Start Practice Test" : "Start Timed Test"}
              </Button>
              
              {selectedCategory && selectedTopic && selectedDifficulty && selectedTestType && (
                <div className="mt-6 p-6 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-sm mb-2 text-red-800">Session Summary:</h4>
                  <div className="text-sm text-red-700 space-y-2">
                    <div>• Category: {selectedCategory === "dsa" ? "Data Structures & Algorithms" : selectedCategory === "database" ? "Database & SQL" : "Problem Solving"}</div>
                    <div>• Topic: {getTopics().find(t => t.id === selectedTopic)?.name}</div>
                    {selectedSubtopic && selectedSubtopic !== "all" && <div>• Subtopic: {selectedSubtopic}</div>}
                    <div>• Difficulty: {difficulties.find(d => d.id === selectedDifficulty)?.name}</div>
                    <div>• Test Type: {testTypes.find(t => t.id === selectedTestType)?.name}</div>
                    {selectedTestType === "timed" && <div>• Duration: {durations.find(d => d.id === selectedDuration)?.name}</div>}
                    <div>• Problems: {questionCount}</div>
                          </div>
                        </div>
              )}
                    </div>
                  </CardContent>
                </Card>
      </div>
    </div>
  )
}