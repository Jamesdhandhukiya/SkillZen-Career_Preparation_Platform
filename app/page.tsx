"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Brain, Code, FileText, MessageSquare, TrendingUp, Users, Award, Mail, Phone, MapPin, Clock, Send, CheckCircle, Star, Zap, Building } from "lucide-react"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Show/hide scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const headerHeight = 80 // Approximate header height
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              SkillZen
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => smoothScrollTo('features')} 
              className="text-gray-300 hover:text-white cursor-pointer text-sm font-medium relative group transition-all duration-300"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
            </button>
            <button 
              onClick={() => smoothScrollTo('about')} 
              className="text-gray-300 hover:text-white cursor-pointer text-sm font-medium relative group transition-all duration-300"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
            </button>
            <button 
              onClick={() => smoothScrollTo('contact')} 
              className="text-gray-300 hover:text-white cursor-pointer text-sm font-medium relative group transition-all duration-300"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
            </button>
          </div>
          <div className="flex items-center">
            <Link href="/login">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="container mx-auto text-center">
          <div className={`transform transition-all duration-1000 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}>
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100 text-lg px-4 py-2">Your Career Success Partner</Badge>
          </div>
          
          <div className={`transform transition-all duration-1000 ease-out delay-200 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Master Your Career Journey with <span className="text-red-600">Skill</span>Zen
            </h1>
          </div>
          
          <div className={`transform transition-all duration-1000 ease-out delay-400 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Personalized preparation platform for placement drives, technical interviews, and career success. Practice
              aptitude, coding, communication skills, and get salary insights.
            </p>
          </div>
          
          <div className={`transform transition-all duration-1000 ease-out delay-600 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 px-8"
                >
                  Start Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="min-h-screen flex items-center py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Everything You Need to Succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Aptitude Practice</CardTitle>
                <CardDescription>Quantitative, Logical Reasoning, and Verbal Ability tests</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Code className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Coding Challenges</CardTitle>
                <CardDescription>DSA problems, SQL queries, and API challenges by role</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Interview Prep</CardTitle>
                <CardDescription>Technical and HR questions with communication practice</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Resume Analysis</CardTitle>
                <CardDescription>AI-powered resume parsing and improvement suggestions</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Company Papers</CardTitle>
                <CardDescription>Previous year questions from TCS, Infosys, Wipro & more</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Salary Insights</CardTitle>
                <CardDescription>Predict expected salary based on skills and location</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Mock Tests</CardTitle>
                <CardDescription>Timed tests with real-time scoring and feedback</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle className="text-lg">Personalized Path</CardTitle>
                <CardDescription>Custom learning journey based on your role and skills</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-red-100 text-red-700 hover:bg-red-100 text-lg px-4 py-2">Our Story</Badge>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Empowering Careers Through Technology
            </h2>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">
              SkillZen was born from a simple belief: every talented individual deserves the opportunity to succeed in
              their career, regardless of their background or circumstances.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">50,000+</div>
                <div className="text-sm text-gray-300">Students Trained</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <Award className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">85%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <Building className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-gray-300">Companies Covered</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <TrendingUp className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-gray-300">Satisfaction Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
              <p className="text-sm text-gray-300 mb-3">
                We're on a mission to democratize career preparation by providing world-class resources, personalized
                learning experiences, and AI-powered insights to help students and professionals achieve their career
                goals.
              </p>
              <p className="text-sm text-gray-300 mb-4">
                Founded in 2025 by a team of former tech industry professionals and educators, SkillZen combines deep
                industry knowledge with cutting-edge technology to create the most effective career preparation platform.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm text-gray-300">Personalized learning paths for every career goal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm text-gray-300">AI-powered assessments and feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm text-gray-300">Industry-relevant content updated regularly</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700">
              <Brain className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-white">AI-Powered Learning</h4>
              <p className="text-sm text-gray-300">
                Our advanced algorithms adapt to your learning style and pace, ensuring maximum efficiency in your
                preparation journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-red-100 text-red-700 hover:bg-red-100 text-lg px-4 py-2">Get in Touch</Badge>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              We're Here to Help
            </h2>
            <p className="text-base text-gray-700 max-w-2xl mx-auto">
              Have questions about SkillZen? Need technical support? Want to share feedback? We'd love to hear from you
              and help you succeed in your career journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <Card className="h-full border-2 border-gray-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <MessageSquare className="w-4 h-4 mr-2 text-red-600" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="h-8 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-8 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Subject</label>
                      <Input
                        type="text"
                        placeholder="What is this regarding?"
                        className="h-8 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Message</label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[60px] text-sm"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 text-base"
                    >
                      Send Message
            </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <Card className="h-full border-2 border-gray-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription className="text-sm">Multiple ways to reach us</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base">Email Us</h4>
                      <p className="text-sm text-gray-600">support@skillzen.com</p>
                      <p className="text-xs text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base">Call Us</h4>
                      <p className="text-sm text-gray-600">+91 90232 71511</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-base">Visit Us</h4>
                      <p className="text-sm text-gray-600">Changa, Anand</p>
                      <p className="text-xs text-gray-500">Gujarat</p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">SkillZen</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering careers through personalized preparation platform for placement drives, technical interviews, and career success.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => smoothScrollTo('features')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={() => smoothScrollTo('about')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</button></li>
                <li><button onClick={() => smoothScrollTo('contact')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</button></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Aptitude Practice</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Coding Challenges</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Interview Prep</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Company Papers</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Resume Analysis</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 SkillZen. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  )
}
