"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@skillzen.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Fri, 9 AM - 6 PM IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Bangalore, Karnataka",
      description: "HSR Layout, Sector 1",
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: "24/7 Online Support",
      description: "Live chat available",
    },
  ]

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking 'Forgot Password' on the login page and following the instructions sent to your email.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. Contact our support team to process your refund.",
    },
    {
      question: "How do I upgrade my plan?",
      answer:
        "You can upgrade your plan anytime from your dashboard settings. The changes will be reflected immediately.",
    },
    {
      question: "Do you offer bulk discounts for institutions?",
      answer:
        "Yes, we offer special pricing for educational institutions and corporate training. Contact our sales team for custom quotes.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              SkillZen
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">💬 Get in Touch</Badge>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            We're Here to Help
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about SkillZen? Need technical support? Want to share feedback? We'd love to hear from you
            and help you succeed in your career journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for contacting us. We'll respond to your message within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input
                        type="text"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Multiple ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{info.title}</h4>
                        <p className="text-sm text-gray-600">{info.details}</p>
                        <p className="text-xs text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Quick FAQ</CardTitle>
                <CardDescription>Common questions answered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                    <p className="text-xs text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Need Urgent Help?</CardTitle>
                <CardDescription className="text-red-600">
                  For urgent technical issues or account problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
