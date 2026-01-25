"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useResume } from "../contexts/ResumeContext"
import { saveResumeData } from "@/lib/resumeService"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, DollarSign, Zap, Download, Star, TrendingUp } from "lucide-react"

export default function ToolsPage() {
  const { user } = useAuth()
  const { resumeData, setResumeData, loadUserData, clearUserData } = useResume()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisSuccess, setAnalysisSuccess] = useState(false)

  // Load user-specific data when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id)
    } else {
      clearUserData()
    }
  }, [user?.id, loadUserData, clearUserData])
  const [resumeAnalysis, setResumeAnalysis] = useState<{
    atsScore: number
    analysis: {
      strengths: string[]
      improvements: string[]
      overall: string
    }
    skills: string[]
    personalInfo: {
      name: string
      email: string
      phone: string
      address: string
      linkedin?: string
      website?: string
    }
    experience: Array<{
      company: string
      position: string
      duration: string
      description: string
    }>
    education: Array<{
      institution: string
      degree: string
      field: string
      year: string
    }>
    summary: string
    achievements: string[]
    certifications: string[]
    languages: string[]
    projects: string[]
  } | null>(null)

  const [salaryData, setSalaryData] = useState({
    role: "",
    location: "",
    experience: "",
    skills: "",
  })

  const [salaryPrediction, setSalaryPrediction] = useState<{
    min: number
    max: number
    average: number
    factors: string[]
  } | null>(null)


  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', event.target.files)
    const file = event.target.files?.[0]
    
    // Only proceed if a file is actually selected and it's a valid file
    if (file && file.size > 0 && file.name) {
      // Prevent multiple simultaneous API calls
      if (isAnalyzing) {
        console.log('Analysis already in progress, ignoring new file selection')
        return
      }
      
      console.log('File selected:', file.name, file.size, file.type)
      setResumeFile(file)
      setIsAnalyzing(true)
      setAnalysisError(null)
      setAnalysisSuccess(false)
      setResumeAnalysis(null)

      try {
        console.log('Starting resume analysis for file:', file.name)
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/resume-parser-v2', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(errorData.details || errorData.error || `Failed to analyze resume (Status: ${response.status})`)
        }

        const analysisData = await response.json()
        setResumeAnalysis(analysisData)
        
        // Save to resume context for dashboard integration
        setResumeData({
          atsScore: analysisData.atsScore,
          skills: analysisData.skills,
          analysis: analysisData.analysis,
          personalInfo: analysisData.personalInfo,
          experience: analysisData.experience,
          education: analysisData.education,
          summary: analysisData.summary || '',
          achievements: analysisData.achievements || [],
          certifications: analysisData.certifications || [],
          languages: analysisData.languages || [],
          projects: analysisData.projects || [],
          lastUpdated: new Date().toISOString()
        })
        
      // Save to Supabase if user is authenticated (optional)
      if (user?.id) {
        try {
          await saveResumeData(user.id, {
            atsScore: analysisData.atsScore,
            skills: analysisData.skills,
            analysis: analysisData.analysis,
            personalInfo: analysisData.personalInfo,
            experience: analysisData.experience,
            education: analysisData.education,
            summary: analysisData.summary || '',
            achievements: analysisData.achievements || [],
            certifications: analysisData.certifications || [],
            languages: analysisData.languages || [],
            projects: analysisData.projects || []
          })
          console.log('✅ Resume data saved to Supabase successfully')
        } catch (error) {
          console.warn('⚠️ Supabase save failed (data still saved locally):', error)
          // Don't show error to user as the analysis still worked
          // The data is still saved in context and localStorage
        }
      } else {
        console.log('ℹ️ User not authenticated, data saved locally only')
      }
        
        console.log('Resume analysis completed and saved:', analysisData)
        setAnalysisSuccess(true)
        // Clear success message after 3 seconds
        setTimeout(() => setAnalysisSuccess(false), 3000)
      } catch (error) {
        console.error('Resume analysis error:', error)
        // Show error to user instead of mock data
        setAnalysisError(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setResumeAnalysis(null)
      } finally {
        setIsAnalyzing(false)
        // Reset the file input to allow selecting the same file again
        event.target.value = ''
      }
    } else {
      console.log('No valid file selected or file is empty')
    }
  }

  const handleSalaryPrediction = () => {
    // Simulate salary prediction
    setTimeout(() => {
      setSalaryPrediction({
        min: 450000,
        max: 850000,
        average: 650000,
        factors: [
          "Location: Bangalore (+15%)",
          "Experience: 2 years",
          "Skills: React, Node.js (+10%)",
          "Market demand: High",
        ],
      })
    }, 1500)
  }


  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString()}`
  }

  const handleDownloadReport = () => {
    if (!resumeAnalysis) return

    // Create HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Resume Analysis Report</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #10b981;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #10b981;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #666;
                margin: 5px 0 0 0;
                font-size: 14px;
            }
            .score-section {
                background: linear-gradient(135deg, #dc2626, #b91c1c);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 30px;
            }
            .score-section h2 {
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .score-number {
                font-size: 48px;
                font-weight: bold;
                margin: 0;
            }
            .section {
                margin-bottom: 25px;
                page-break-inside: avoid;
            }
            .section h2 {
                color: #10b981;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 5px;
                margin-bottom: 15px;
                font-size: 20px;
            }
            .section h3 {
                color: #374151;
                margin: 20px 0 10px 0;
                font-size: 16px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            .info-item {
                background: #f9fafb;
                padding: 10px;
                border-radius: 5px;
                border-left: 4px solid #10b981;
            }
            .info-label {
                font-weight: bold;
                color: #374151;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .info-value {
                color: #6b7280;
                margin-top: 2px;
            }
            .skills-container {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 10px 0;
            }
            .skill-tag {
                background: #d1fae5;
                color: #065f46;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            .analysis-list {
                list-style: none;
                padding: 0;
            }
            .analysis-list li {
                background: #f3f4f6;
                margin: 8px 0;
                padding: 12px;
                border-radius: 6px;
                border-left: 4px solid #10b981;
            }
            .experience-item, .education-item {
                background: #f9fafb;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                border-left: 4px solid #10b981;
            }
            .item-title {
                font-weight: bold;
                color: #374151;
                margin-bottom: 5px;
            }
            .item-company, .item-institution {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 5px;
            }
            .item-duration, .item-year {
                color: #9ca3af;
                font-size: 12px;
                font-style: italic;
            }
            .item-description {
                color: #4b5563;
                margin-top: 8px;
                line-height: 1.5;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 12px;
            }
            @media print {
                body { margin: 0; padding: 15px; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Resume Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
        </div>

        <div class="score-section">
            <h2>ATS Score</h2>
            <p class="score-number">${resumeAnalysis.atsScore}/100</p>
        </div>

        <div class="section">
            <h2>Personal Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${resumeAnalysis.personalInfo.name || 'Not provided'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${resumeAnalysis.personalInfo.email || 'Not provided'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${resumeAnalysis.personalInfo.phone || 'Not provided'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Address</div>
                    <div class="info-value">${resumeAnalysis.personalInfo.address || 'Not provided'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Skills Detected</h2>
            <div class="skills-container">
                ${resumeAnalysis.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>

        <div class="section">
            <h2>Analysis</h2>
            
            <h3>Strengths</h3>
            <ul class="analysis-list">
                ${resumeAnalysis.analysis.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>

            <h3>Areas for Improvement</h3>
            <ul class="analysis-list">
                ${resumeAnalysis.analysis.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
            </ul>

            <h3>Overall Analysis</h3>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <p style="margin: 0; color: #0c4a6e;">${resumeAnalysis.analysis.overall}</p>
            </div>
        </div>

        <div class="section">
            <h2>Work Experience</h2>
            ${resumeAnalysis.experience.length > 0 ? 
                resumeAnalysis.experience.map(exp => `
                    <div class="experience-item">
                        <div class="item-title">${exp.position}</div>
                        <div class="item-company">${exp.company}</div>
                        <div class="item-duration">${exp.duration}</div>
                        <div class="item-description">${exp.description}</div>
                    </div>
                `).join('') : 
                '<p style="color: #6b7280; font-style: italic;">No work experience detected</p>'
            }
        </div>

        <div class="section">
            <h2>Education</h2>
            ${resumeAnalysis.education.length > 0 ? 
                resumeAnalysis.education.map(edu => `
                    <div class="education-item">
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-institution">${edu.institution}</div>
                        <div class="item-year">${edu.year}</div>
                        ${edu.field ? `<div class="item-description">Field: ${edu.field}</div>` : ''}
                    </div>
                `).join('') : 
                '<p style="color: #6b7280; font-style: italic;">No education information detected</p>'
            }
        </div>

        ${resumeAnalysis.summary ? `
        <div class="section">
            <h2>Summary</h2>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #374151;">${resumeAnalysis.summary}</p>
            </div>
        </div>
        ` : ''}

        ${resumeAnalysis.achievements.length > 0 ? `
        <div class="section">
            <h2>Achievements</h2>
            <ul class="analysis-list">
                ${resumeAnalysis.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${resumeAnalysis.certifications.length > 0 ? `
        <div class="section">
            <h2>Certifications</h2>
            <ul class="analysis-list">
                ${resumeAnalysis.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${resumeAnalysis.languages.length > 0 ? `
        <div class="section">
            <h2>Languages</h2>
            <div class="skills-container">
                ${resumeAnalysis.languages.map(lang => `<span class="skill-tag">${lang}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        ${resumeAnalysis.projects.length > 0 ? `
        <div class="section">
            <h2>Projects</h2>
            <ul class="analysis-list">
                ${resumeAnalysis.projects.map(project => `<li>${project}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        <div class="footer">
            <p>Report generated by SkillZen Resume Analyzer</p>
            <p>For more career tools and insights, visit our platform</p>
        </div>
    </body>
    </html>
    `

    // Create a new window with the HTML content
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          // Close the window after a delay
          setTimeout(() => {
            printWindow.close()
          }, 1000)
        }, 500)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
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
          <h1 className="text-3xl font-bold text-white mb-2">Career Tools</h1>
          <p className="text-gray-300">Resume analysis and salary prediction</p>
        </div>

        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="resume" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span>Resume Parser</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center space-x-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4" />
              <span>Salary Predictor</span>
            </TabsTrigger>
          </TabsList>

          {/* Resume Parser */}
          <TabsContent value="resume" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <FileText className="w-5 h-5 mr-2 text-red-600" />
                  Resume Parser & Analyzer
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload your resume to get AI-powered analysis and improvement suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => {
                    console.log('Upload area clicked')
                    document.getElementById('resume-upload')?.click()
                  }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload your resume</p>
                  <p className="text-sm text-gray-500 mb-4">Supports PDF, DOC, DOCX, TXT, RTF (Max 5MB)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    className="cursor-pointer bg-transparent hover:bg-gray-50"
                    onClick={() => {
                      console.log('Choose File button clicked')
                      document.getElementById('resume-upload')?.click()
                    }}
                  >
                    Choose File
                  </Button>
                </div>
                
                {resumeFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {resumeFile.name} uploaded successfully</p>
                )}
                
                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span>Analyzing your resume...</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Success Message */}
            {analysisSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">Resume analyzed successfully!</p>
                    <p className="text-green-600 text-sm">Your skills and score have been updated in the dashboard.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <p className="text-red-800 font-medium">Analysis failed</p>
                    <p className="text-red-600 text-sm">{analysisError}</p>
                  </div>
                </div>
              </div>
            )}

            {resumeAnalysis && !isAnalyzing && (
                  <div className="space-y-6">
                    {/* ATS Score */}
                    <Card className="bg-white border-gray-200">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">ATS Score</CardTitle>
                        <CardDescription className="text-gray-600">
                          Applicant Tracking System Compatibility
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="relative inline-block">
                          {/* Circular Progress */}
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                              {/* Background circle */}
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                              />
                              {/* Progress circle */}
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - resumeAnalysis.atsScore / 100)}`}
                                className={`transition-all duration-1000 ease-out ${
                                  resumeAnalysis.atsScore >= 80 ? 'text-red-600' :
                                  resumeAnalysis.atsScore >= 60 ? 'text-red-500' :
                                  resumeAnalysis.atsScore >= 40 ? 'text-orange-500' : 'text-red-400'
                                }`}
                                strokeLinecap="round"
                              />
                            </svg>
                            {/* Score text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className={`text-3xl font-bold ${
                                  resumeAnalysis.atsScore >= 80 ? 'text-red-600' :
                                  resumeAnalysis.atsScore >= 60 ? 'text-red-500' :
                                  resumeAnalysis.atsScore >= 40 ? 'text-orange-600' : 'text-red-500'
                                }`}>
                                  {resumeAnalysis.atsScore}
                                </div>
                                <div className="text-sm text-gray-500">/ 100</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Score interpretation */}
                          <div className="space-y-2">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                              resumeAnalysis.atsScore >= 80 ? 'bg-red-100 text-red-800' :
                              resumeAnalysis.atsScore >= 60 ? 'bg-red-50 text-red-700' :
                              resumeAnalysis.atsScore >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {resumeAnalysis.atsScore >= 80 ? 'Excellent' :
                               resumeAnalysis.atsScore >= 60 ? 'Good' :
                               resumeAnalysis.atsScore >= 40 ? 'Fair' : 'Needs Improvement'}
                            </div>
                            <p className="text-sm text-gray-600 max-w-md mx-auto">
                              {resumeAnalysis.atsScore >= 80 ? 'Your resume is highly optimized for ATS systems and should pass most screening filters.' :
                               resumeAnalysis.atsScore >= 60 ? 'Your resume has good ATS compatibility with room for minor improvements.' :
                               resumeAnalysis.atsScore >= 40 ? 'Your resume needs significant improvements to pass ATS screening effectively.' :
                               'Your resume requires major optimization to be ATS-compatible.'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Name</p>
                            <p className="text-sm text-gray-700">{resumeAnalysis.personalInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Email</p>
                            <p className="text-sm text-gray-700">{resumeAnalysis.personalInfo.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Phone</p>
                            <p className="text-sm text-gray-700">{resumeAnalysis.personalInfo.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Address</p>
                            <p className="text-sm text-gray-700">{resumeAnalysis.personalInfo.address}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Analysis */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-white border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-red-600">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {resumeAnalysis.analysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                                <span className="text-sm text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-red-600">Areas for Improvement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {resumeAnalysis.analysis.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                                <span className="text-sm text-gray-700">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Overall Analysis */}
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">Overall Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{resumeAnalysis.analysis.overall}</p>
                      </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-800">Extracted Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {resumeAnalysis.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Experience */}
                    {resumeAnalysis.experience.length > 0 && (
                      <Card className="bg-white border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-800">Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {resumeAnalysis.experience.map((exp, index) => (
                              <div key={index} className="border-l-4 border-red-600 pl-4">
                                <h4 className="font-semibold text-sm text-gray-800">{exp.position}</h4>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                                <p className="text-xs text-gray-500">{exp.duration}</p>
                                <p className="text-sm mt-2 text-gray-700">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Education */}
                    {resumeAnalysis.education.length > 0 && (
                      <Card className="bg-white border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-800">Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {resumeAnalysis.education.map((edu, index) => (
                              <div key={index} className="border-l-4 border-red-600 pl-4">
                                <h4 className="font-semibold text-sm text-gray-800">{edu.degree}</h4>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                                <p className="text-xs text-gray-500">{edu.field} • {edu.year}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-center">
                      <Button onClick={handleDownloadReport} className="bg-red-600 hover:bg-red-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF Report
                      </Button>
                    </div>
                  </div>
                )}
          </TabsContent>

          {/* Salary Predictor */}
          <TabsContent value="salary" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <DollarSign className="w-5 h-5 mr-2 text-red-600" />
                  Salary Predictor
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Get salary insights based on your profile, location, and market trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Role</label>
                    <Input
                      placeholder="e.g., Software Engineer"
                      value={salaryData.role}
                      onChange={(e) => setSalaryData((prev) => ({ ...prev, role: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      placeholder="e.g., Bangalore"
                      value={salaryData.location}
                      onChange={(e) => setSalaryData((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience (years)</label>
                    <Input
                      placeholder="e.g., 2"
                      value={salaryData.experience}
                      onChange={(e) => setSalaryData((prev) => ({ ...prev, experience: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Skills</label>
                    <Input
                      placeholder="e.g., React, Node.js, Python"
                      value={salaryData.skills}
                      onChange={(e) => setSalaryData((prev) => ({ ...prev, skills: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSalaryPrediction} className="w-full bg-red-600 hover:bg-red-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Predict Salary
                </Button>

                {salaryPrediction && (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Salary Prediction</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{formatSalary(salaryPrediction.min)}</p>
                          <p className="text-sm text-gray-600">Minimum</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-blue-600">{formatSalary(salaryPrediction.average)}</p>
                          <p className="text-sm text-gray-600">Average</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{formatSalary(salaryPrediction.max)}</p>
                          <p className="text-sm text-gray-600">Maximum</p>
                        </div>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Factors Affecting Your Salary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {salaryPrediction.factors.map((factor, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">💡 Tips to Increase Your Salary</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Learn in-demand skills like cloud computing or AI/ML</li>
                        <li>• Get relevant certifications in your field</li>
                        <li>• Build a strong portfolio with real projects</li>
                        <li>• Consider relocating to high-paying cities</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
