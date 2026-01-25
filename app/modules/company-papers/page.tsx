"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Building, Search, Clock, Award, Filter, Download } from "lucide-react"

interface CompanyPaper {
  id: number
  company: string
  year: number
  role: string
  type: "Aptitude" | "Technical" | "Coding" | "HR"
  duration: number
  questions: CompanyQuestion[]
  difficulty: "Easy" | "Medium" | "Hard"
  passPercentage: number
}

interface CompanyQuestion {
  id: number
  question: string
  options?: string[]
  correctAnswer?: number
  type: "MCQ" | "Coding" | "Descriptive"
  marks: number
  explanation?: string
}

const companyPapers: CompanyPaper[] = [
  {
    id: 1,
    company: "TCS",
    year: 2024,
    role: "Software Engineer",
    type: "Aptitude",
    duration: 90,
    difficulty: "Medium",
    passPercentage: 65,
    questions: [
      {
        id: 1,
        question:
          "A train 125m long running at 50 km/hr crosses a bridge in 30 seconds. What is the length of the bridge?",
        options: ["291.5m", "291.6m", "291.7m", "291.8m"],
        correctAnswer: 2,
        type: "MCQ",
        marks: 1,
        explanation:
          "Speed = 50 km/hr = 50 × 5/18 = 13.89 m/s. Distance = Speed × Time = 13.89 × 30 = 416.7m. Bridge length = 416.7 - 125 = 291.7m",
      },
      {
        id: 2,
        question: "If CODING is written as DPEJOH, how is FLOWER written?",
        options: ["GMPXFS", "GMPXFR", "GMPWFS", "HMPXFS"],
        correctAnswer: 0,
        type: "MCQ",
        marks: 1,
        explanation: "Each letter is shifted by +1 position in the alphabet",
      },
      {
        id: 3,
        question: "Choose the word that is most similar to 'METICULOUS':",
        options: ["Careless", "Precise", "Quick", "Loud"],
        correctAnswer: 1,
        type: "MCQ",
        marks: 1,
        explanation: "Meticulous means showing great attention to detail; precise",
      },
    ],
  },
  {
    id: 2,
    company: "Infosys",
    year: 2024,
    role: "System Engineer",
    type: "Technical",
    duration: 60,
    difficulty: "Medium",
    passPercentage: 70,
    questions: [
      {
        id: 1,
        question: "What is the output of the following code?\nint x = 5;\nint y = ++x + x++;\nprintf('%d', y);",
        options: ["11", "12", "13", "10"],
        correctAnswer: 1,
        type: "MCQ",
        marks: 2,
        explanation: "++x increments x to 6, then x++ uses 6 and increments to 7. So y = 6 + 6 = 12",
      },
      {
        id: 2,
        question: "Which data structure is used for implementing recursion?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        type: "MCQ",
        marks: 2,
        explanation: "Stack is used to store function calls and local variables during recursion",
      },
    ],
  },
  {
    id: 3,
    company: "Wipro",
    year: 2023,
    role: "Project Engineer",
    type: "Coding",
    duration: 120,
    difficulty: "Hard",
    passPercentage: 55,
    questions: [
      {
        id: 1,
        question: "Write a program to find the second largest element in an array without sorting.",
        type: "Coding",
        marks: 10,
        explanation: "Iterate through array keeping track of largest and second largest elements",
      },
      {
        id: 2,
        question: "Implement a function to check if a string is a palindrome (ignore spaces and case).",
        type: "Coding",
        marks: 10,
        explanation: "Use two pointers approach or reverse string comparison",
      },
    ],
  },
  {
    id: 4,
    company: "Accenture",
    year: 2024,
    role: "Associate Software Engineer",
    type: "Aptitude",
    duration: 75,
    difficulty: "Easy",
    passPercentage: 75,
    questions: [
      {
        id: 1,
        question: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 1,
        type: "MCQ",
        marks: 1,
        explanation: "25% of 80 = (25/100) × 80 = 20",
      },
      {
        id: 2,
        question: "Complete the series: 1, 4, 9, 16, ?",
        options: ["20", "25", "24", "36"],
        correctAnswer: 1,
        type: "MCQ",
        marks: 1,
        explanation: "Perfect squares: 1², 2², 3², 4², 5² = 25",
      },
    ],
  },
]

export default function CompanyPapersPage() {
  const [selectedPaper, setSelectedPaper] = useState<CompanyPaper | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | string }>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCompany, setFilterCompany] = useState("All")
  const [filterYear, setFilterYear] = useState("All")
  const [filterType, setFilterType] = useState("All")
  const [showResults, setShowResults] = useState(false)

  const companies = ["All", ...Array.from(new Set(companyPapers.map((p) => p.company)))]
  const years = ["All", ...Array.from(new Set(companyPapers.map((p) => p.year.toString())))]
  const types = ["All", ...Array.from(new Set(companyPapers.map((p) => p.type)))]

  const filteredPapers = companyPapers.filter((paper) => {
    const matchesSearch =
      paper.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompany = filterCompany === "All" || paper.company === filterCompany
    const matchesYear = filterYear === "All" || paper.year.toString() === filterYear
    const matchesType = filterType === "All" || paper.type === filterType

    return matchesSearch && matchesCompany && matchesYear && matchesType
  })

  const handleAnswerSelect = (questionId: number, answer: number | string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmitPaper = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!selectedPaper) return { correct: 0, total: 0, percentage: 0 }

    let correct = 0
    selectedPaper.questions.forEach((q) => {
      if (q.type === "MCQ" && userAnswers[q.id] === q.correctAnswer) {
        correct++
      }
    })

    return {
      correct,
      total: selectedPaper.questions.filter((q) => q.type === "MCQ").length,
      percentage: Math.round((correct / selectedPaper.questions.filter((q) => q.type === "MCQ").length) * 100),
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "Hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Aptitude":
        return "text-blue-600 bg-blue-100"
      case "Technical":
        return "text-purple-600 bg-purple-100"
      case "Coding":
        return "text-green-600 bg-green-100"
      case "HR":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (selectedPaper && showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header - Fixed at top */}
        <header className="border-b bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              onClick={() => {
                setSelectedPaper(null)
                setShowResults(false)
                setCurrentQuestion(0)
                setUserAnswers({})
              }}
              variant="outline"
              className="bg-transparent border-gray-300 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Papers
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Company Papers
              </span>
            </div>
            
            <div className="text-sm text-gray-300">
              Test Results
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl pt-28 px-4">

          <Card className="text-center bg-white border-gray-200">
            <CardHeader>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">
                {selectedPaper.company} - {selectedPaper.year}
              </CardTitle>
              <CardDescription className="text-gray-600">Test Results for {selectedPaper.role}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{score.correct}</p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{score.percentage}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedPaper.passPercentage}%</p>
                  <p className="text-sm text-gray-600">Company Cutoff</p>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${score.percentage >= selectedPaper.passPercentage ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <p
                  className={`font-semibold ${score.percentage >= selectedPaper.passPercentage ? "text-green-600" : "text-red-600"}`}
                >
                  {score.percentage >= selectedPaper.passPercentage
                    ? "🎉 Congratulations! You passed!"
                    : "❌ You need to improve. Try again!"}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Detailed Results</h3>
                {selectedPaper.questions
                  .filter((q) => q.type === "MCQ")
                  .map((question, index) => {
                    const userAnswer = userAnswers[question.id]
                    const isCorrect = userAnswer === question.correctAnswer
                    return (
                      <div key={question.id} className="text-left p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                          <span className="text-sm text-gray-500">+{question.marks} marks</span>
                        </div>
                        <p className="font-medium mb-2 text-gray-800">{question.question}</p>
                        {question.options && (
                          <>
                            <p className="text-sm text-gray-600 mb-1">
                              Your answer:{" "}
                              {userAnswer !== undefined ? question.options[userAnswer as number] : "Not answered"}
                            </p>
                            <p className="text-sm text-green-600 mb-2">
                              Correct answer: {question.options[question.correctAnswer!]}
                            </p>
                          </>
                        )}
                        {question.explanation && <p className="text-sm text-gray-500">{question.explanation}</p>}
                      </div>
                    )
                  })}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setCurrentQuestion(0)
                    setUserAnswers({})
                  }}
                  variant="outline"
                  className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    setSelectedPaper(null)
                    setShowResults(false)
                    setCurrentQuestion(0)
                    setUserAnswers({})
                  }}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Back to Papers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (selectedPaper) {
    const currentQ = selectedPaper.questions[currentQuestion]
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header - Fixed at top */}
        <header className="border-b bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button 
              onClick={() => setSelectedPaper(null)} 
              variant="outline"
              className="bg-transparent border-gray-300 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Papers
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">
                {selectedPaper.company} - {selectedPaper.year}
              </h1>
              <p className="text-sm text-gray-300">
                {selectedPaper.role} | {selectedPaper.type} Test
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span>{selectedPaper.duration} mins</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-4xl pt-28 px-4">

          <Card className="mb-6 bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {selectedPaper.questions.length}
                </span>
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / selectedPaper.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-800">{currentQ.question}</CardTitle>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="border-gray-300 text-gray-700">+{currentQ.marks} marks</Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">{currentQ.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentQ.type === "MCQ" && currentQ.options && (
                <RadioGroup
                  value={userAnswers[currentQ.id]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(currentQ.id, Number.parseInt(value))}
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-800">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQ.type === "Coding" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Write your code solution:</p>
                    <textarea
                      className="w-full h-40 p-3 border rounded-md font-mono text-sm"
                      placeholder="// Write your solution here..."
                      value={(userAnswers[currentQ.id] as string) || ""}
                      onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                    />
                  </div>
                </div>
              )}

              {currentQ.type === "Descriptive" && (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 p-3 border rounded-md"
                    placeholder="Write your answer here..."
                    value={(userAnswers[currentQ.id] as string) || ""}
                    onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentQuestion === selectedPaper.questions.length - 1 ? (
                <Button onClick={handleSubmitPaper} className="bg-green-600 hover:bg-green-700 text-white">
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(Math.min(selectedPaper.questions.length - 1, currentQuestion + 1))}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
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
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Company Papers
            </span>
          </div>
          
          <div className="text-sm text-gray-300">
            Practice with real papers
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl pt-28 px-4">

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Filter className="w-5 h-5 mr-2 text-orange-600" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search company or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="p-2 border rounded-md"
              >
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="p-2 border rounded-md"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border rounded-md"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <Button variant="outline" className="flex items-center bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Papers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-lg text-gray-800">{paper.company}</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">{paper.year}</Badge>
                </div>
                <CardDescription className="text-gray-600">{paper.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(paper.type)}>{paper.type}</Badge>
                  <Badge className={getDifficultyColor(paper.difficulty)}>{paper.difficulty}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{paper.duration} mins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span>{paper.passPercentage}% cutoff</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>{paper.questions.length} questions</p>
                  <p>Total marks: {paper.questions.reduce((sum, q) => sum + q.marks, 0)}</p>
                </div>

                <Button 
                  onClick={() => setSelectedPaper(paper)} 
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Start Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">No papers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
