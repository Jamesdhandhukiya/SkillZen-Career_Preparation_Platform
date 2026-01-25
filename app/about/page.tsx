import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, Users, Target, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { number: "50,000+", label: "Students Trained", icon: Users },
    { number: "85%", label: "Success Rate", icon: Target },
    { number: "500+", label: "Companies Covered", icon: Award },
    { number: "95%", label: "Satisfaction Score", icon: TrendingUp },
  ]

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      description: "Former Google engineer with 8+ years in tech recruitment",
      image: "/placeholder.svg?height=200&width=200&text=PS",
    },
    {
      name: "Rahul Kumar",
      role: "CTO",
      description: "Ex-Microsoft architect, expert in AI and machine learning",
      image: "/placeholder.svg?height=200&width=200&text=RK",
    },
    {
      name: "Anita Patel",
      role: "Head of Content",
      description: "Former HR director at TCS, specializes in interview preparation",
      image: "/placeholder.svg?height=200&width=200&text=AP",
    },
    {
      name: "Vikram Singh",
      role: "Lead Data Scientist",
      description: "PhD in Computer Science, builds our AI-powered assessment tools",
      image: "/placeholder.svg?height=200&width=200&text=VS",
    },
  ]

  const values = [
    {
      title: "Student-First Approach",
      description: "Every decision we make is centered around what's best for our students' career success.",
      icon: Users,
    },
    {
      title: "Quality Content",
      description: "We maintain the highest standards in our practice materials and assessments.",
      icon: Award,
    },
    {
      title: "Innovation",
      description: "We continuously evolve our platform using the latest technology and pedagogical methods.",
      icon: Brain,
    },
    {
      title: "Accessibility",
      description: "Quality career preparation should be accessible to everyone, regardless of background.",
      icon: Target,
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
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">🚀 Our Story</Badge>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Empowering Careers Through Technology
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SkillZen was born from a simple belief: every talented individual deserves the opportunity to succeed in
            their career, regardless of their background or circumstances.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We're on a mission to democratize career preparation by providing world-class resources, personalized
              learning experiences, and AI-powered insights to help students and professionals achieve their career
              goals.
            </p>
            <p className="text-gray-600 mb-6">
              Founded in 2022 by a team of former tech industry professionals and educators, SkillZen combines deep
              industry knowledge with cutting-edge technology to create the most effective career preparation platform.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Personalized learning paths for every career goal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-gray-700">AI-powered assessments and feedback</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Industry-relevant content updated regularly</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-gray-600">
              Our advanced algorithms adapt to your learning style and pace, ensuring maximum efficiency in your
              preparation journey.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Success Story</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the thousands who have transformed their careers with SkillZen. Your success story starts here.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
              Start Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
