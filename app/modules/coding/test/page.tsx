"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Code, Play, RotateCcw, Clock, Target, Users, Award, Eye, EyeOff, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import CodeEditor from "@/components/CodeEditor"
import SolutionTabs from "@/components/SolutionTabs"

// Sample coding questions
const sampleQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[2] + nums[4] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" }
    ]
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string contains valid parentheses."
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All types of brackets are properly closed."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "The string contains invalid parentheses."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    solution: `function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in map) {
            if (stack.length === 0 || stack.pop() !== map[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
    testCases: [
      { input: '"()"', expected: "true" },
      { input: '"()[]{}"', expected: "true" },
      { input: '"(]"', expected: "false" },
      { input: '"([)]"', expected: "false" }
    ]
  },
  {
    id: 3,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Medium",
    category: "Trees",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal: left -> root -> right"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    solution: `function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}`,
    testCases: [
      { input: "[1,null,2,3]", expected: "[1,3,2]" },
      { input: "[]", expected: "[]" },
      { input: "[1]", expected: "[1]" }
    ]
  }
]

export default function CodingTestPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userCode, setUserCode] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [showSolution, setShowSolution] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [testMode, setTestMode] = useState("practice") // "practice" or "timed"
  const [isTestComplete, setIsTestComplete] = useState(false)
  const [testResults, setTestResults] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    timeTaken: 0,
    startTime: Date.now()
  })
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [testConfiguration, setTestConfiguration] = useState<any>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Fetch questions based on configuration
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)
        
        // Get configuration from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search)
        const config = {
          category: urlParams.get('category') || 'dsa',
          topic: urlParams.get('topic') || 'arrays',
          subtopic: urlParams.get('subtopic') || 'all',
          difficulty: urlParams.get('difficulty') || 'easy',
          questionCount: parseInt(urlParams.get('questionCount') || '5'),
          testType: urlParams.get('testType') || 'practice'
        }
        
        setTestConfiguration(config)
        setTestMode(config.testType)
        
        // Set timer for timed tests
        if (config.testType === 'timed') {
          const duration = parseInt(urlParams.get('duration') || '30') * 60 // Convert minutes to seconds
          setTimeLeft(duration)
        }
        
        console.log('Fetching questions with config:', config)
        
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config)
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Fetched questions:', data)
        console.log('Questions array:', data.questions)
        console.log('Questions length:', data.questions?.length)
        
        setQuestions(data.questions || [])
        setTestResults(prev => ({
          ...prev,
          totalQuestions: data.questions?.length || 0
        }))
        
      } catch (error) {
        console.error('Error fetching questions:', error)
        // Fallback to sample questions
        setQuestions(sampleQuestions)
        setTestResults(prev => ({
          ...prev,
          totalQuestions: sampleQuestions.length
        }))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuestions()
  }, [])

  // Timer effect for timed tests
  useEffect(() => {
    if (testMode === "timed" && timeLeft > 0 && !isTestComplete && !isLoading) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTestComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [testMode, timeLeft, isTestComplete, isLoading])

  // Initialize code editor with function signature
  useEffect(() => {
    if (currentQuestion && !isLoading) {
      const functionName = currentQuestion.title.toLowerCase().replace(/\s+/g, '')
      
      // Generate appropriate function signature based on language
      let initialCode = ''
      switch (selectedLanguage) {
        case 'python':
          initialCode = `def ${functionName}(input):
    # Write your solution here
    pass`
          break
        case 'java':
          initialCode = `public class Solution {
    public int ${functionName}(int input) {
        // Write your solution here
        return 0;
    }
}`
          break
        case 'cpp':
          initialCode = `#include <iostream>
using namespace std;

int ${functionName}(int input) {
    // Write your solution here
    return 0;
}`
          break
        case 'csharp':
          initialCode = `public class Solution {
    public int ${functionName}(int input) {
        // Write your solution here
        return 0;
    }
}`
          break
        case 'go':
          initialCode = `func ${functionName}(input int) int {
    // Write your solution here
    return 0
}`
          break
        case 'rust':
          initialCode = `fn ${functionName}(input: i32) -> i32 {
    // Write your solution here
    0
}`
          break
        default: // javascript
          initialCode = `function ${functionName}(input) {
    // Write your solution here
    
}`
      }
      
      setUserCode(initialCode)
      setShowSolution(false)
    }
  }, [currentQuestion, isLoading, selectedLanguage])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }


  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      finishTest()
    }
  }

  const finishTest = () => {
    const timeTaken = Math.floor((Date.now() - testResults.startTime) / 1000)
    const correctAnswers = Math.floor(Math.random() * totalQuestions) // Simulate correct answers
    const answeredQuestions = totalQuestions // All questions were attempted
    
    setTestResults(prev => ({
      ...prev,
      totalQuestions: totalQuestions,
      answeredQuestions,
      correctAnswers,
      timeTaken
    }))
    
    setIsTestComplete(true)
    setShowResults(true)
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Questions</h2>
            <p className="text-gray-600">
              Generating personalized questions based on your configuration...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No questions loaded
  if (!questions || questions.length === 0) {
    console.log('No questions available. Questions state:', questions)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-white border-gray-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Available</h2>
            <p className="text-gray-600 mb-6">
              Unable to load questions. Please try again or check your configuration.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/modules/coding">Back to Configuration</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isTestComplete && showResults) {
    const accuracy = Math.round((testResults.correctAnswers / testResults.totalQuestions) * 100)
    const score = Math.round((testResults.correctAnswers / testResults.totalQuestions) * 100)
    
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto pt-28 px-4 pb-8">
          <Card className="bg-white border-gray-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-2">Test Complete!</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {testMode === "timed" ? "Time's up! Here are your results." : "Great job! Here are your results."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-2">{score}%</div>
                  <div className="text-sm font-medium text-red-800">Overall Score</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{testResults.correctAnswers}/{testResults.totalQuestions}</div>
                  <div className="text-sm font-medium text-blue-800">Correct Answers</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(testResults.timeTaken)}</div>
                  <div className="text-sm font-medium text-green-800">Time Taken</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 text-center">Detailed Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Questions Attempted</span>
                      <span className="text-lg font-bold text-gray-900">{testResults.answeredQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Correct Answers</span>
                      <span className="text-lg font-bold text-green-600">{testResults.correctAnswers}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Incorrect Answers</span>
                      <span className="text-lg font-bold text-red-600">{testResults.totalQuestions - testResults.correctAnswers}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Accuracy</span>
                      <span className="text-lg font-bold text-blue-600">{accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Test Mode</span>
                      <span className="text-lg font-bold text-gray-900 capitalize">{testMode}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Average Time per Question</span>
                      <span className="text-lg font-bold text-purple-600">
                        {formatTime(Math.floor(testResults.timeTaken / testResults.totalQuestions))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Analysis</h4>
                <div className="space-y-3">
                  {score >= 80 && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Excellent performance! You have a strong understanding of coding concepts.</span>
                    </div>
                  )}
                  {score >= 60 && score < 80 && (
                    <div className="flex items-center text-yellow-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Good performance! Consider practicing more to improve your accuracy.</span>
                    </div>
                  )}
                  {score < 60 && (
                    <div className="flex items-center text-red-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Keep practicing! Focus on understanding the fundamentals and problem-solving approaches.</span>
                    </div>
                  )}
                  
                  {testMode === "timed" && testResults.timeTaken < 1800 && (
                    <div className="flex items-center text-blue-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Great time management! You completed the test efficiently.</span>
                    </div>
                  )}
                  
                  {testMode === "practice" && (
                    <div className="flex items-center text-purple-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Practice mode allows you to learn at your own pace. Keep exploring solutions!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  <Link href="/modules/coding">Take Another Test</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/modules/coding" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Configuration
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Coding Test
              </span>
            </div>
            
            {testMode === "timed" && (
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeLeft <= 300 ? 'bg-red-600 animate-pulse' : 
                timeLeft <= 600 ? 'bg-orange-600' : 'bg-red-600'
              }`}>
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-mono text-lg">
                  {formatTime(timeLeft)}
                </span>
                {timeLeft <= 300 && (
                  <span className="text-white text-sm ml-2">⚠️ Time Running Low!</span>
                )}
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-300">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto pt-28 px-4 pb-8">
        {/* Time Warning for Timed Mode */}
        {testMode === "timed" && timeLeft <= 300 && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center text-red-800">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Time Running Low!</span>
              <span className="ml-2">Only {formatTime(timeLeft)} remaining</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Section */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl text-gray-800">
                        {currentQuestion.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {currentQuestion.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {currentQuestion.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Examples */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Examples:</h4>
                  <div className="space-y-3">
                    {currentQuestion.examples.map((example: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Input: </span>
                            <code className="text-sm bg-white px-2 py-1 rounded border">
                              {example.input}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Output: </span>
                            <code className="text-sm bg-white px-2 py-1 rounded border">
                              {example.output}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Explanation: </span>
                            <span className="text-sm text-gray-600">{example.explanation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Constraints:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {currentQuestion.constraints.map((constraint: any, index: number) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Solution Section - Only for Practice Mode */}
            {testMode === "practice" && currentQuestion?.solutions && (
              <SolutionTabs 
                solutions={currentQuestion.solutions}
                selectedLanguage={selectedLanguage}
                className="mt-6"
              />
            )}
          </div>

          {/* Code Editor Section */}
          <div className="space-y-6">
            <CodeEditor
              initialCode={userCode}
              language={selectedLanguage}
              onCodeChange={setUserCode}
              onLanguageChange={setSelectedLanguage}
              onRun={(code, language) => {
                console.log('Code executed:', { code, language })
              }}
              testCases={currentQuestion.testCases}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalQuestions }, (_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={index === currentQuestionIndex ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={nextQuestion}
              className="flex items-center bg-red-600 hover:bg-red-700"
            >
              {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {/* Finish Test Button - Only show when not on last question */}
          {currentQuestionIndex < totalQuestions - 1 && (
            <div className="flex justify-center">
              <Button
                onClick={finishTest}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Finish Test
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
