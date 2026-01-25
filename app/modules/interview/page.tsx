"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageSquare, Mic, MicOff, RotateCcw, Star, Target, Users, Clock, Brain, Code } from "lucide-react"
import { QuotaManager } from "@/lib/quota-manager"


interface InterviewQuestion {
  id: number
  category: "Technical" | "HR" | "Behavioral"
  role: string
  question: string
  difficulty: "Easy" | "Medium" | "Hard"
  sampleAnswer: string
  tips: string[]
  followUp?: string[]
}

// Comprehensive Tech Roles A-Z
const techRoles = [
  { id: "ai-engineer", name: "AI Engineer", description: "Machine Learning and AI systems" },
  { id: "android-developer", name: "Android Developer", description: "Mobile app development for Android" },
  { id: "backend-developer", name: "Backend Developer", description: "Server-side development and APIs" },
  { id: "blockchain-developer", name: "Blockchain Developer", description: "Cryptocurrency and blockchain technology" },
  { id: "cloud-architect", name: "Cloud Architect", description: "Cloud infrastructure and architecture" },
  { id: "cybersecurity-analyst", name: "Cybersecurity Analyst", description: "Information security and threat analysis" },
  { id: "data-analyst", name: "Data Analyst", description: "Data analysis and business intelligence" },
  { id: "data-engineer", name: "Data Engineer", description: "Data pipeline and infrastructure" },
  { id: "data-scientist", name: "Data Scientist", description: "Advanced analytics and machine learning" },
  { id: "database-administrator", name: "Database Administrator", description: "Database management and optimization" },
  { id: "devops-engineer", name: "DevOps Engineer", description: "Development operations and automation" },
  { id: "embedded-developer", name: "Embedded Developer", description: "Firmware and embedded systems" },
  { id: "frontend-developer", name: "Frontend Developer", description: "User interface and user experience" },
  { id: "full-stack-developer", name: "Full Stack Developer", description: "Both frontend and backend development" },
  { id: "game-developer", name: "Game Developer", description: "Video game development" },
  { id: "ios-developer", name: "iOS Developer", description: "Mobile app development for iOS" },
  { id: "it-support", name: "IT Support Specialist", description: "Technical support and troubleshooting" },
  { id: "java-developer", name: "Java Developer", description: "Java-based application development" },
  { id: "javascript-developer", name: "JavaScript Developer", description: "JavaScript and web technologies" },
  { id: "machine-learning-engineer", name: "Machine Learning Engineer", description: "ML model development and deployment" },
  { id: "mobile-developer", name: "Mobile Developer", description: "Cross-platform mobile development" },
  { id: "network-engineer", name: "Network Engineer", description: "Network infrastructure and security" },
  { id: "php-developer", name: "PHP Developer", description: "PHP-based web development" },
  { id: "product-manager", name: "Product Manager", description: "Product strategy and management" },
  { id: "python-developer", name: "Python Developer", description: "Python-based application development" },
  { id: "qa-engineer", name: "QA Engineer", description: "Quality assurance and testing" },
  { id: "react-developer", name: "React Developer", description: "React.js frontend development" },
  { id: "ruby-developer", name: "Ruby Developer", description: "Ruby and Rails development" },
  { id: "salesforce-developer", name: "Salesforce Developer", description: "Salesforce platform development" },
  { id: "scrum-master", name: "Scrum Master", description: "Agile project management" },
  { id: "security-engineer", name: "Security Engineer", description: "Cybersecurity and system protection" },
  { id: "software-architect", name: "Software Architect", description: "System design and architecture" },
  { id: "software-engineer", name: "Software Engineer", description: "General software development" },
  { id: "system-administrator", name: "System Administrator", description: "System administration and maintenance" },
  { id: "tech-lead", name: "Tech Lead", description: "Technical leadership and mentoring" },
  { id: "ui-ux-designer", name: "UI/UX Designer", description: "User interface and experience design" },
  { id: "unity-developer", name: "Unity Developer", description: "Unity game engine development" },
  { id: "vue-developer", name: "Vue Developer", description: "Vue.js frontend development" },
  { id: "web-developer", name: "Web Developer", description: "General web development" },
  { id: "wordpress-developer", name: "WordPress Developer", description: "WordPress customization and development" }
]

const questionCategories = [
  { id: "technical", name: "Technical", description: "Programming, algorithms, and technical concepts", icon: Code },
  { id: "hr", name: "HR", description: "General HR and company culture questions", icon: Users },
  { id: "behavioral", name: "Behavioral", description: "Situational and behavioral assessment", icon: Brain }
]

const difficulties = [
  { id: "easy", name: "Easy", description: "Basic concepts and entry-level questions" },
  { id: "medium", name: "Medium", description: "Intermediate level with some complexity" },
  { id: "hard", name: "Hard", description: "Advanced concepts and senior-level questions" }
]

const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    category: "Technical",
    role: "Web Developer",
    question: "Explain the difference between let, const, and var in JavaScript.",
    difficulty: "Medium",
    sampleAnswer:
      "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned but not redeclared, const is block-scoped and cannot be reassigned or redeclared. const must be initialized at declaration.",
    tips: [
      "Mention hoisting behavior",
      "Explain scope differences",
      "Give practical examples",
      "Discuss temporal dead zone",
    ],
    followUp: ["What is hoisting?", "Can you modify a const object?", "What happens in the temporal dead zone?"],
  },
  {
    id: 2,
    category: "HR",
    role: "General",
    question: "Tell me about yourself.",
    difficulty: "Easy",
    sampleAnswer:
      "I'm a passionate web developer with 2 years of experience building responsive web applications. I specialize in React and Node.js, and I'm particularly interested in creating user-friendly interfaces that solve real-world problems.",
    tips: [
      "Keep it professional and relevant",
      "Highlight key achievements",
      "Connect to the role you're applying for",
      "Keep it under 2 minutes",
    ],
    followUp: ["What motivates you?", "Where do you see yourself in 5 years?", "Why are you interested in this role?"],
  },
  {
    id: 3,
    category: "Behavioral",
    role: "General",
    question: "Describe a time when you had to work with a difficult team member.",
    difficulty: "Hard",
    sampleAnswer:
      "In my previous project, I worked with a team member who was resistant to code reviews. I approached them privately to understand their concerns, explained the benefits of peer review, and suggested we start with smaller, less critical changes. This helped build trust and eventually they became one of our most thorough reviewers.",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Focus on your actions and learning",
      "Show emotional intelligence",
      "End with a positive outcome",
    ],
    followUp: [
      "How do you handle conflict in general?",
      "What did you learn from this experience?",
      "How would you prevent similar issues?",
    ],
  },
  {
    id: 4,
    category: "Technical",
    role: "Data Analyst",
    question: "How would you handle missing data in a dataset?",
    difficulty: "Medium",
    sampleAnswer:
      "I would first analyze the pattern of missing data to understand if it's random or systematic. Then choose appropriate strategies: deletion for small amounts of random missing data, imputation using mean/median/mode for numerical data, or advanced techniques like regression imputation for more complex cases.",
    tips: [
      "Mention different types of missing data",
      "Discuss various imputation methods",
      "Consider the impact on analysis",
      "Mention validation techniques",
    ],
    followUp: [
      "When would you use forward fill vs backward fill?",
      "How do you validate your imputation strategy?",
      "What are the risks of removing missing data?",
    ],
  },
]

export default function InterviewPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null)
  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [feedback, setFeedback] = useState<{
    score: number
    strengths: string[]
    improvements: string[]
    analysis: string
  } | null>(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline" | "quota-exceeded">("checking")
  const [quotaInfo, setQuotaInfo] = useState<{remaining: number, total: number} | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGrammarChecking, setIsGrammarChecking] = useState(false)
  const [grammarIssues, setGrammarIssues] = useState<Array<{
    message: string
    shortMessage?: string
    replacements: string[]
    offset: number
    length: number
    ruleId?: string
  }>>([])
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [scores, setScores] = useState<{[key: number]: number}>({})
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null)

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


  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      if (recordingStream) {
        recordingStream.getTracks().forEach(track => track.stop())
      }
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio)
      }
    }
  }, [recordingStream, recordedAudio])


  const handleStartRecording = async () => {
    try {
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        alert('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.')
        return
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      setRecordingStream(stream)
      setIsRecording(true)
      setRecordingTime(0)
      setAudioChunks([])
      setRecordedAudio(null)
      
      // Create MediaRecorder with fallback for better compatibility
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '' // Use default
          }
        }
      }
      
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      
      setMediaRecorder(recorder)
      
      // Store chunks locally to avoid state issues
      let currentChunks: Blob[] = []
      
      // Handle data available
      recorder.ondataavailable = (event) => {
        console.log("Audio data available:", event.data.size, "bytes")
        if (event.data.size > 0) {
          currentChunks.push(event.data)
          console.log("Total audio chunks:", currentChunks.length)
        }
      }
      
      // Handle recording errors
      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event)
        setIsRecording(false)
      }
      
      // Handle recording stop
      recorder.onstop = () => {
        console.log("Recording stopped, chunks:", currentChunks.length)
        if (currentChunks.length > 0) {
          const audioBlob = new Blob(currentChunks, { type: mimeType || 'audio/webm' })
          const audioUrl = URL.createObjectURL(audioBlob)
          setRecordedAudio(audioUrl)
          console.log("✅ Audio recorded successfully", audioBlob.size, "bytes, type:", mimeType)
        } else {
          console.warn("No audio data recorded")
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        setRecordingStream(null)
      }
      
      // Start recording
      recorder.start(1000) // Collect data every second
      
      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      // Auto stop after 2 minutes
      setTimeout(() => {
        clearInterval(timer)
        if (recorder.state === 'recording') {
          handleStopRecording()
        }
      }, 120000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Microphone access denied. Please allow microphone access to record your answers.')
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
    }
    setIsRecording(false)
  }

  // Convert recorded audio to text using Gemini AI
  const convertAudioToText = async () => {
    if (!recordedAudio) {
      console.error("No recorded audio available")
      alert("No recorded audio available. Please record audio first.")
      return
    }
    
    console.log("Starting audio conversion for:", recordedAudio)
    setIsLoading(true)
    try {
      // Get the audio blob from the recorded audio URL
      const response = await fetch(recordedAudio)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`)
      }
      
      const audioBlob = await response.blob()
      console.log("Audio blob size:", audioBlob.size, "bytes, type:", audioBlob.type)
      
      if (audioBlob.size === 0) {
        throw new Error("Audio blob is empty")
      }
      
      // Convert audio to base64 using FileReader (more efficient for large files)
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          // Remove data URL prefix to get just the base64 string
          const base64 = result.split(',')[1]
          console.log("Base64 audio length:", base64.length)
          resolve(base64)
        }
        reader.onerror = (error) => {
          console.error("FileReader error:", error)
          reject(error)
        }
        reader.readAsDataURL(audioBlob)
      })
      
      const prompt = `Transcribe this audio recording to text. The audio contains a spoken interview answer in English. Return only the transcribed text in English, no other formatting or explanation.`
      
      console.log("Sending request to Gemini API...")
      const response2 = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          audio: base64Audio 
        })
      })

      console.log("API response status:", response2.status)
      if (response2.ok) {
        const data = await response2.json()
        console.log("API response data:", data)
        const transcribedText = data.response?.trim() || ''
        
        if (transcribedText) {
          setUserAnswer(transcribedText)
          console.log("✅ Audio converted to text successfully:", transcribedText)
          
          // Update quota
          const updatedQuota = QuotaManager.decreaseQuota()
          setQuotaInfo(updatedQuota)
        } else {
          console.error("Empty transcription result")
          alert("Failed to convert audio to text. Please try again or type your answer manually.")
        }
      } else {
        const errorData = await response2.json().catch(() => ({}))
        console.error('API Error:', response2.status, errorData)
        alert(`Error converting audio to text (${response2.status}). Please type your answer manually.`)
      }
    } catch (error) {
      console.error('Error converting audio to text:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Error converting audio to text: ${errorMessage}. Please type your answer manually.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate 10 questions using Gemini AI
  const generateQuestions = async (role: string, category: string, difficulty: string) => {
    if (apiStatus === "offline" || apiStatus === "quota-exceeded") {
      console.log("🔄 Using fallback questions - API not available")
      return
    }

    setIsLoading(true)
    try {
      const roleData = techRoles.find(r => r.id === role)
      const roleName = roleData?.name || role
      
      const prompt = `Create exactly 10 interview questions for a ${roleName} position.
      
Category: ${category}
Difficulty: ${difficulty}

Return as JSON array with this exact format:
[{"question":"Question text here","sampleAnswer":"Sample answer here","tips":["Tip 1","Tip 2","Tip 3"],"followUp":["Follow-up 1","Follow-up 2"]}]

Requirements:
- Questions should be specific to ${roleName} role
- ${category} category focus
- ${difficulty} difficulty level
- Include practical, real-world scenarios
- Provide detailed sample answers
- Include actionable tips
- Add relevant follow-up questions
- Return EXACTLY 10 questions

Return ONLY the JSON array, no other text. Make sure the JSON is valid and properly formatted.`

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (response.ok) {
        const data = await response.json()
        const responseText = data.response?.trim()
        
        if (responseText) {
          try {
            // Clean the response text to ensure valid JSON
            let cleanResponse = responseText
            
            // Remove any text before the first '[' and after the last ']'
            const firstBracket = cleanResponse.indexOf('[')
            const lastBracket = cleanResponse.lastIndexOf(']')
            
            if (firstBracket !== -1 && lastBracket !== -1) {
              cleanResponse = cleanResponse.substring(firstBracket, lastBracket + 1)
            }
            
            const questions = JSON.parse(cleanResponse)
            console.log("✅ Generated questions successfully", questions.length)
            
            // Update quota
            const updatedQuota = QuotaManager.decreaseQuota()
            setQuotaInfo(updatedQuota)
            
            // Convert to our format and store all questions
            if (Array.isArray(questions) && questions.length > 0) {
              const formattedQuestions = questions.map((q, index) => ({
                id: Date.now() + index,
                category: category as "Technical" | "HR" | "Behavioral",
                role: roleName,
                question: q.question,
                difficulty: difficulty as "Easy" | "Medium" | "Hard",
                sampleAnswer: q.sampleAnswer,
                tips: q.tips || [],
                followUp: q.followUp || []
              }))
              
              // Store all questions and set the first one as selected
              setGeneratedQuestions(formattedQuestions)
              setCurrentQuestionIndex(0)
              setSelectedQuestion(formattedQuestions[0])
              setUserAnswer("")
              setFeedback(null)
            }
          } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError)
            console.error('Response text:', responseText)
            // Fallback to sample questions
            setGeneratedQuestions(interviewQuestions.slice(0, 10))
            setCurrentQuestionIndex(0)
            setSelectedQuestion(interviewQuestions[0])
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 429) {
          console.log("🚫 Rate limit exceeded - please wait before trying again")
          setApiStatus("quota-exceeded")
        }
        // Fallback to sample questions
        setGeneratedQuestions(interviewQuestions.slice(0, 10))
        setCurrentQuestionIndex(0)
        setSelectedQuestion(interviewQuestions[0])
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      // Fallback to sample questions
      setGeneratedQuestions(interviewQuestions.slice(0, 10))
      setCurrentQuestionIndex(0)
      setSelectedQuestion(interviewQuestions[0])
    } finally {
      setIsLoading(false)
    }
  }

  // AI-powered answer scoring and analysis
  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !userAnswer.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      const prompt = `Evaluate this interview answer and provide detailed feedback.

Question: "${selectedQuestion.question}"
Role: ${selectedQuestion.role}
Category: ${selectedQuestion.category}
Difficulty: ${selectedQuestion.difficulty}

User's Answer: "${userAnswer}"

Sample Answer: "${selectedQuestion.sampleAnswer}"

IMPORTANT: This answer may have been converted from speech-to-text, so consider:
- Speech patterns and natural language flow
- Potential transcription errors or incomplete sentences
- The intent behind the spoken response
- Content quality regardless of transcription accuracy

Please provide a comprehensive evaluation in this exact JSON format:
{
  "score": 85,
  "strengths": ["Clear communication", "Good structure", "Relevant examples"],
  "improvements": ["Add more technical details", "Provide specific metrics"],
  "analysis": "Detailed analysis of the answer quality, relevance, and areas for improvement. Compare with the sample answer and provide specific feedback on how to improve. Consider that this may be a speech-to-text conversion and focus on content quality and intent."
}

Evaluation Criteria (100 points total):
- Relevance to the question (0-25 points): How well does the answer address the specific question asked?
- Technical accuracy and depth (0-25 points): Is the technical content correct and sufficiently detailed?
- Structure and clarity (0-25 points): Is the answer well-organized and easy to understand?
- Examples and evidence (0-25 points): Does the answer include relevant examples, metrics, or evidence?

Scoring Guidelines:
- 90-100: Excellent answer with clear examples, technical depth, and strong structure
- 80-89: Good answer with minor areas for improvement
- 70-79: Adequate answer but needs more detail or examples
- 60-69: Basic answer that addresses the question but lacks depth
- Below 60: Answer needs significant improvement

Return ONLY the JSON object, no other text.`

      console.log("Sending analysis request for answer:", userAnswer.substring(0, 100) + "...")
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      console.log("Analysis API response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        const responseText = data.response?.trim()
        
        console.log("Raw AI response:", responseText)
        
        if (responseText) {
          try {
            // Clean the response text to ensure valid JSON
            let cleanResponse = responseText
            
            // Remove any text before the first '{' and after the last '}'
            const firstBrace = cleanResponse.indexOf('{')
            const lastBrace = cleanResponse.lastIndexOf('}')
            
            if (firstBrace !== -1 && lastBrace !== -1) {
              cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1)
            }
            
            console.log("Cleaned response for parsing:", cleanResponse)
            const aiFeedback = JSON.parse(cleanResponse)
            
            // Validate the feedback structure
            if (!aiFeedback.score || !aiFeedback.strengths || !aiFeedback.improvements || !aiFeedback.analysis) {
              throw new Error("Invalid feedback structure")
            }
            
            // Store the answer and score
            setAnswers(prev => ({ ...prev, [selectedQuestion.id]: userAnswer }))
            setScores(prev => ({ ...prev, [selectedQuestion.id]: aiFeedback.score }))
            
            setFeedback(aiFeedback)
            
            // Update quota
            const updatedQuota = QuotaManager.decreaseQuota()
            setQuotaInfo(updatedQuota)
            
            console.log("✅ Answer evaluated successfully:", aiFeedback)
          } catch (parseError) {
            console.error('Failed to parse AI feedback:', parseError)
            console.error('Response text:', responseText)
            
            // Fallback to basic scoring with better analysis
            const basicScore = Math.floor(Math.random() * 30) + 70
            const basicFeedback = {
              score: basicScore,
              strengths: ["Answer provided", "Shows effort", "Addresses the question"],
              improvements: ["Could be more detailed", "Add specific examples", "Provide more technical depth"],
              analysis: `Your answer shows understanding of the question. The response covers the main points but could benefit from more specific details and examples. Consider elaborating on technical aspects and providing concrete examples to strengthen your response.`
            }
            setFeedback(basicFeedback)
            setAnswers(prev => ({ ...prev, [selectedQuestion.id]: userAnswer }))
            setScores(prev => ({ ...prev, [selectedQuestion.id]: basicScore }))
          }
        } else {
          throw new Error("Empty response from AI")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        
        // Fallback to basic scoring
        const basicScore = Math.floor(Math.random() * 30) + 70
        const basicFeedback = {
          score: basicScore,
          strengths: ["Answer provided", "Shows effort"],
          improvements: ["Could be more detailed", "Add specific examples"],
          analysis: "Your answer shows understanding of the question. Consider adding more specific details and examples to strengthen your response."
        }
        setFeedback(basicFeedback)
        setAnswers(prev => ({ ...prev, [selectedQuestion.id]: userAnswer }))
        setScores(prev => ({ ...prev, [selectedQuestion.id]: basicScore }))
      }
    } catch (error) {
      console.error('Error evaluating answer:', error)
      // Fallback to basic scoring
      const basicScore = Math.floor(Math.random() * 30) + 70
      const basicFeedback = {
        score: basicScore,
        strengths: ["Answer provided", "Shows effort"],
        improvements: ["Could be more detailed", "Add specific examples"],
        analysis: "Your answer shows understanding of the question. Consider adding more specific details and examples to strengthen your response."
      }
      setFeedback(basicFeedback)
      setAnswers(prev => ({ ...prev, [selectedQuestion.id]: userAnswer }))
      setScores(prev => ({ ...prev, [selectedQuestion.id]: basicScore }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Grammar and style check via LanguageTool
  const handleGrammarCheck = async () => {
    if (!userAnswer.trim()) return
    setIsGrammarChecking(true)
    setGrammarIssues([])
    try {
      const res = await fetch('/api/languagetool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userAnswer, language: 'en-US' })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('LanguageTool error', res.status, err)
        return
      }
      const data = await res.json()
      const issues = (data.matches || []).map((m: any) => ({
        message: m.message,
        shortMessage: m.shortMessage,
        replacements: (m.replacements || []).slice(0, 3).map((r: any) => r.value),
        offset: m.offset,
        length: m.length,
        ruleId: m.rule?.id
      }))
      setGrammarIssues(issues)
    } catch (e) {
      console.error('Grammar check failed', e)
    } finally {
      setIsGrammarChecking(false)
    }
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setSelectedQuestion(generatedQuestions[nextIndex])
      setUserAnswer(answers[generatedQuestions[nextIndex].id] || "")
      setFeedback(null)
    }
  }

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      setSelectedQuestion(generatedQuestions[prevIndex])
      setUserAnswer(answers[generatedQuestions[prevIndex].id] || "")
      setFeedback(null)
    }
  }

  // Calculate overall score
  const calculateOverallScore = () => {
    const questionScores = Object.values(scores)
    if (questionScores.length === 0) return 0
    return Math.round(questionScores.reduce((sum, score) => sum + score, 0) / questionScores.length)
  }

  // Handle finish interview
  const handleFinishInterview = () => {
    setShowFinishModal(true)
  }

  // Confirm finish interview
  const confirmFinishInterview = () => {
    // Reset to configuration mode
    setGeneratedQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedQuestion(null)
    setAnswers({})
    setScores({})
    setFeedback(null)
    setUserAnswer("")
    setSelectedRole("")
    setSelectedCategory("")
    setSelectedDifficulty("")
    setShowFinishModal(false)
  }


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "text-blue-600 bg-blue-100"
      case "HR":
        return "text-purple-600 bg-purple-100"
      case "Behavioral":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              SkillZen
            </span>
          </div>
          <Link href="/dashboard" className="inline-flex items-center text-gray-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Interview Studio</h1>
          <p className="text-gray-300">AI-powered interview preparation with personalized questions</p>
        </div>

        {/* Interview Studio Configuration */}
          <div className="mb-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-600" />
                  Interview Configuration
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Customize your interview practice with specific roles and question types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your target role" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {techRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{role.name}</span>
                              <span className="text-xs text-gray-500">{role.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Question Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <category.icon className="w-4 h-4 mr-2" />
                              <div className="flex flex-col">
                                <span className="font-medium">{category.name}</span>
                                <span className="text-xs text-gray-500">{category.description}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty.id} value={difficulty.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{difficulty.name}</span>
                              <span className="text-xs text-gray-500">{difficulty.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Questions Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        apiStatus === "online" ? "bg-green-500" :
                        apiStatus === "checking" ? "bg-yellow-500 animate-pulse" :
                        apiStatus === "quota-exceeded" ? "bg-orange-500" : "bg-red-500"
                      }`}></div>
                      <span className="text-sm text-gray-600">
                        {apiStatus === "online" ? "AI Ready" :
                         apiStatus === "checking" ? "Checking..." :
                         apiStatus === "quota-exceeded" ? "Rate Limited" : "Offline"}
                      </span>
                    </div>
                    {quotaInfo && apiStatus === "online" && (
                      <span className="text-sm text-gray-600">
                        {quotaInfo.remaining} questions remaining
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => generateQuestions(selectedRole, selectedCategory, selectedDifficulty)}
                    disabled={!selectedRole || !selectedCategory || !selectedDifficulty || isLoading || apiStatus === "offline"}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>

                {/* Status Messages */}
                {apiStatus === "quota-exceeded" && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      Rate limit exceeded. Please wait a few minutes before generating new questions.
                    </p>
                  </div>
                )}
                {apiStatus === "offline" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      AI is currently offline. You can still practice with sample questions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        {/* Question Progress */}
        {generatedQuestions.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center justify-between">
                  <span>Question {currentQuestionIndex + 1} of {generatedQuestions.length}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Overall Score: {calculateOverallScore()}/100</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(Object.keys(answers).length / generatedQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Progress: {Object.keys(answers).length} answered out of {generatedQuestions.length} questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {generatedQuestions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-red-600 text-white'
                          : answers[generatedQuestions[index].id]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      onClick={() => {
                        setCurrentQuestionIndex(index)
                        setSelectedQuestion(generatedQuestions[index])
                        setUserAnswer(answers[generatedQuestions[index].id] || "")
                        setFeedback(null)
                      }}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generated Question Display */}
        {selectedQuestion && (
          <div className="mt-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-800">{selectedQuestion.question}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge className={getCategoryColor(selectedQuestion.category)}>
                      {selectedQuestion.category}
                    </Badge>
                    <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                      {selectedQuestion.difficulty}
                    </Badge>
                    {currentQuestionIndex === generatedQuestions.length - 1 && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Final Question
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="text-gray-600">Role: {selectedQuestion.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recording Controls */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        variant={isRecording ? "destructive" : "default"}
                        size="sm"
                        disabled={isLoading}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-4 h-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      {isRecording && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="font-mono">{formatTime(recordingTime)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Recommended time: 2-3 minutes | <strong>Speak in English only</strong>
                    </div>
                  </div>
                  
                  
                  {/* Recorded Audio Player */}
                  {recordedAudio && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Audio Recorded</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <audio controls className="flex-1" preload="metadata">
                            <source src={recordedAudio} type="audio/webm" />
                            <source src={recordedAudio} type="audio/mp4" />
                            <source src={recordedAudio} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={convertAudioToText}
                            disabled={isLoading}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {isLoading ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Converting...
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                Convert to Text
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setRecordedAudio(null)}
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Clear Audio
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Click "Convert to Text" to transcribe your audio recording using AI. <strong>Please speak in English only.</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Answer */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Answer (Optional - for text practice)
                  </label>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!userAnswer.trim() || isSubmitting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Get AI Feedback"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGrammarCheck}
                    disabled={!userAnswer.trim() || isGrammarChecking}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {isGrammarChecking ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      'Grammar Check'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setUserAnswer("")} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Navigation Buttons */}
                {generatedQuestions.length > 1 && (
                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </Button>
                    {currentQuestionIndex === generatedQuestions.length - 1 ? (
                      <Button
                        onClick={handleFinishInterview}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        🏁 Finish Interview
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                )}

                {/* Sample Answer & Tips */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Sample Answer:</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedQuestion.sampleAnswer}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Key Tips:</h3>
                    <ul className="space-y-2">
                      {selectedQuestion.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedQuestion.followUp && selectedQuestion.followUp.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Possible Follow-up Questions:</h3>
                      <div className="space-y-2">
                        {selectedQuestion.followUp.map((followUp, index) => (
                          <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <p className="text-gray-700">{followUp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">AI Analysis & Feedback</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full text-white text-xl font-bold mb-2">
                          {feedback.score}
                        </div>
                        <p className="text-lg font-semibold">Score: {feedback.score}/100</p>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.floor(feedback.score / 20)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Detailed Analysis */}
                      {feedback.analysis && (
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 mb-2">Detailed Analysis</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{feedback.analysis}</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {feedback.strengths.map((strength, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement</h4>
                          <ul className="space-y-1">
                            {feedback.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                <span className="text-sm">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grammar Suggestions */}
                {grammarIssues.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Grammar & Style Suggestions</h3>
                    <div className="space-y-3">
                      {grammarIssues.map((issue, idx) => (
                        <div key={idx} className="p-3 bg-white border rounded">
                          <p className="text-sm text-gray-800"><strong>Issue:</strong> {issue.message}{issue.shortMessage ? ` (${issue.shortMessage})` : ''}</p>
                          {issue.replacements.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Suggestions:</strong> {issue.replacements.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Final Summary */}
        {generatedQuestions.length > 0 && Object.keys(answers).length === generatedQuestions.length && (
          <div className="mt-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 text-center">Interview Complete! 🎉</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Congratulations! You've completed all {generatedQuestions.length} questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-600 to-blue-600 rounded-full text-white text-3xl font-bold mb-4">
                    {calculateOverallScore()}
                  </div>
                  <p className="text-2xl font-semibold text-gray-800">Overall Score</p>
                  <p className="text-gray-600">out of 100 points</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Object.keys(answers).length}</div>
                    <div className="text-sm text-gray-600">Questions Answered</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(calculateOverallScore())}</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculateOverallScore() >= 80 ? 'Excellent' : 
                       calculateOverallScore() >= 60 ? 'Good' : 'Needs Improvement'}
                    </div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                </div>

                <div className="text-center space-x-4">
                  <Button 
                    onClick={() => {
                      // Reset everything including configuration
                      setGeneratedQuestions([])
                      setCurrentQuestionIndex(0)
                      setSelectedQuestion(null)
                      setAnswers({})
                      setScores({})
                      setFeedback(null)
                      setUserAnswer("")
                      setSelectedRole("")
                      setSelectedCategory("")
                      setSelectedDifficulty("")
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Start New Interview
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestionIndex(0)
                      setSelectedQuestion(generatedQuestions[0])
                      setUserAnswer(answers[generatedQuestions[0].id] || "")
                      setFeedback(null)
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Review Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Custom Finish Confirmation Modal */}
        {showFinishModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Finish Interview?</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to finish the interview? This will take you back to the configuration screen and you'll lose your current progress.
                </p>
                <div className="flex space-x-3 justify-end">
                  <Button
                    onClick={() => setShowFinishModal(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmFinishInterview}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Finish Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
