import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, DollarSign, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    track: "",
    scholarshipInterest: false,
    agreeToTerms: false,
  });
  const navigate = useNavigate();

  const tracks = [
    { value: "fullstack", label: "Full Stack Development", duration: "6 months", description: "Learn both frontend and backend development" },
    { value: "frontend", label: "Frontend Development", duration: "4 months", description: "Master React, Vue, and modern UI/UX" },
    { value: "backend", label: "Backend Development", duration: "4 months", description: "Focus on server-side programming and databases" },
    { value: "mobile", label: "Mobile Development", duration: "5 months", description: "Build iOS and Android applications" },
    { value: "devops", label: "DevOps Engineering", duration: "3 months", description: "Learn cloud infrastructure and deployment" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Registration data:", formData);
      navigate("/welcome");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Your Learning Track</Label>
        <Select value={formData.track} onValueChange={(value) => setFormData(prev => ({ ...prev, track: value }))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your specialization" />
          </SelectTrigger>
          <SelectContent>
            {tracks.map((track) => (
              <SelectItem key={track.value} value={track.value}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{track.label}</div>
                    <div className="text-sm text-muted-foreground">{track.description}</div>
                  </div>
                  <Badge variant="outline" className="ml-2">{track.duration}</Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.track && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">
            {tracks.find(t => t.value === formData.track)?.label}
          </h4>
          <p className="text-sm text-muted-foreground mb-2">
            {tracks.find(t => t.value === formData.track)?.description}
          </p>
          <div className="flex items-center gap-2">
            <Badge>{tracks.find(t => t.value === formData.track)?.duration}</Badge>
            <Badge variant="outline">Certificate included</Badge>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="scholarshipInterest"
          name="scholarshipInterest"
          checked={formData.scholarshipInterest}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, scholarshipInterest: checked as boolean }))}
        />
        <Label htmlFor="scholarshipInterest" className="text-sm">
          I'm interested in scholarship opportunities
        </Label>
      </div>

      {formData.scholarshipInterest && (
        <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-accent" />
            <h4 className="font-semibold">Scholarship Program</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            We offer need-based scholarships covering up to 80% of tuition fees. 
            Applications are reviewed on a case-by-case basis.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Almost Ready!</h3>
        <p className="text-muted-foreground">Review your information and complete registration</p>
      </div>

      <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium">{formData.firstName} {formData.lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium">{formData.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Track:</span>
          <span className="font-medium">{tracks.find(t => t.value === formData.track)?.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Scholarship:</span>
          <span className="font-medium">{formData.scholarshipInterest ? 'Interested' : 'Not interested'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
          required
        />
        <Label htmlFor="agreeToTerms" className="text-sm">
          I agree to the{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">A</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Join ACA</h1>
            <p className="text-muted-foreground">Start your coding journey today</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <Card className="card-elevated">
          <CardHeader className="space-y-2">
            <CardTitle>
              {currentStep === 1 && "Create Account"}
              {currentStep === 2 && "Choose Your Path"}
              {currentStep === 3 && "Confirm Details"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter your basic information to get started"}
              {currentStep === 2 && "Select your learning track and preferences"}
              {currentStep === 3 && "Review and complete your registration"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="flex-1" 
                  size="lg"
                  disabled={currentStep === 3 && !formData.agreeToTerms}
                >
                  {currentStep === 3 ? "Complete Registration" : "Continue"}
                </Button>
              </div>
            </form>

            {currentStep === 1 && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}