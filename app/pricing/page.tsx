import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, CheckCircle, Star, Zap } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started with basic preparation",
      features: [
        "50 aptitude questions",
        "10 coding problems",
        "Basic resume analysis",
        "5 interview questions",
        "Community support",
      ],
      limitations: ["Limited practice tests", "No detailed analytics", "Basic feedback only"],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "₹999",
      period: "per month",
      description: "Ideal for serious job seekers and students",
      features: [
        "Unlimited aptitude questions",
        "500+ coding problems",
        "Advanced resume analysis",
        "200+ interview questions",
        "Mock tests with detailed reports",
        "Salary prediction tool",
        "Company-specific papers",
        "Priority support",
        "Progress tracking",
      ],
      limitations: [],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Premium",
      price: "₹1,999",
      period: "per month",
      description: "Complete career preparation with personalized coaching",
      features: [
        "Everything in Pro",
        "1-on-1 mentorship sessions",
        "Personalized study plan",
        "Live doubt clearing sessions",
        "Industry expert reviews",
        "Job referral assistance",
        "Custom mock interviews",
        "Career counseling",
        "Lifetime access to resources",
      ],
      limitations: [],
      buttonText: "Go Premium",
      buttonVariant: "default" as const,
      popular: false,
    },
  ]

  const annualDiscount = 20

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
          <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">💰 Simple Pricing</Badge>
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Choose Your Success Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include our core features with varying levels of access and
            support.
          </p>

          <div className="inline-flex items-center bg-blue-50 rounded-full p-1 mb-8">
            <Badge className="bg-blue-600 text-white mr-2">
              <Zap className="w-3 h-3 mr-1" />
              Save {annualDiscount}%
            </Badge>
            <span className="text-sm text-blue-700 px-3">with annual billing</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-lg transition-shadow ${plan.popular ? "border-2 border-blue-500 scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <div className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                          <span className="text-xs text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/signup">
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                  billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial for paid plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we offer a 7-day free trial for both Pro and Premium plans. No credit card required to start.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer student discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we offer a 30% discount for students with valid student ID. Contact our support team to apply the
                  discount.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful candidates who chose SkillZen for their career preparation.
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
