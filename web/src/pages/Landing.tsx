import { ArrowRight, GraduationCap, Users, Award, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Comprehensive Learning",
    description: "Master modern web development with hands-on projects and real-world applications."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Expert Mentorship",
    description: "Learn from industry professionals with years of experience in software development."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Career Support",
    description: "Get job placement assistance and career guidance to launch your tech career."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Flexible Schedule",
    description: "Study at your own pace with 24/7 access to course materials and support."
  }
];

const tracks = [
  {
    name: "Full Stack Development",
    duration: "6 months",
    description: "Learn both frontend and backend development",
    popular: true
  },
  {
    name: "Frontend Development",
    duration: "4 months",
    description: "Master React, Vue, and modern UI/UX"
  },
  {
    name: "Backend Development",
    duration: "4 months",
    description: "Focus on server-side programming and databases"
  },
  {
    name: "Mobile Development",
    duration: "5 months",
    description: "Build iOS and Android applications"
  }
];

const stats = [
  { number: "500+", label: "Students Enrolled" },
  { number: "95%", label: "Completion Rate" },
  { number: "80%", label: "Job Placement" },
  { number: "4.9/5", label: "Student Rating" }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-foreground text-lg">ACA Student Hub</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/scholarship-application">Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              🎓 Scholarship Program Open
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              Launch Your Tech Career with
              <span className="text-primary"> ACA</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your future with our comprehensive coding bootcamp. 
              Get up to 80% scholarship and learn from industry experts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/scholarship-application">
                Apply for Scholarship
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/application-status">Check Application Status</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Why Choose ACA?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive program is designed to give you the skills and support you need to succeed in the tech industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Learning Tracks</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the specialization that matches your career goals and interests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track, index) => (
              <Card key={index} className="relative">
                {track.popular && (
                  <Badge className="absolute top-4 right-4">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {track.name}
                    <Badge variant="outline">{track.duration}</Badge>
                  </CardTitle>
                  <CardDescription>{track.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Hands-on projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Industry mentorship</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Career support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join hundreds of successful graduates who have transformed their careers with ACA.
              Apply for our scholarship program today!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/scholarship-application">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Already Applied? Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">A</span>
              </div>
              <span className="font-bold">ACA Student Hub</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/application-status" className="hover:text-foreground">Check Status</Link>
              <Link to="/login" className="hover:text-foreground">Sign In</Link>
              <span>© 2024 ACA. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 