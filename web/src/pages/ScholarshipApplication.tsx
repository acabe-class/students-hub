import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { scholarshipApi } from "@/lib/requests";
import { ScholarshipFormData, Track } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const tracks: Track[] = [
  { 
    value: "fullstack", 
    label: "Full Stack Development", 
    duration: "6 months", 
    description: "Learn both frontend and backend development",
    examDuration: 60
  },
  { 
    value: "frontend", 
    label: "Frontend Development", 
    duration: "4 months", 
    description: "Master React, Vue, and modern UI/UX",
    examDuration: 45
  },
  { 
    value: "backend", 
    label: "Backend Development", 
    duration: "4 months", 
    description: "Focus on server-side programming and databases",
    examDuration: 45
  },
  { 
    value: "mobile", 
    label: "Mobile Development", 
    duration: "5 months", 
    description: "Build iOS and Android applications",
    examDuration: 60
  },
  { 
    value: "devops", 
    label: "DevOps Engineering", 
    duration: "3 months", 
    description: "Learn cloud infrastructure and deployment",
    examDuration: 45
  },
];

const educationLevels = [
  "High School",
  "Some College",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other"
];

const occupations = [
  "Student",
  "Unemployed",
  "Part-time Worker",
  "Full-time Worker",
  "Freelancer",
  "Entrepreneur",
  "Other"
];

export default function ScholarshipApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ScholarshipFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    track: "",
    educationLevel: "",
    currentOccupation: "",
    monthlyIncome: 0,
    familySize: 1,
    motivation: "",
    previousExperience: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitApplication();
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    try {
      const { agreeToTerms, ...applicationData } = formData;
      const response = await scholarshipApi.submitApplication(applicationData);
      
      if (response.success) {
        toast({
          title: "Application Submitted!",
          description: "We've received your scholarship application. You'll receive an email with exam details soon.",
        });
        navigate("/application-status", { 
          state: { email: formData.email } 
        });
      } else {
        toast({
          title: "Submission Failed",
          description: response.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
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
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1234567890"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Your Learning Track *</Label>
        <Select value={formData.track} onValueChange={(value) => handleSelectChange('track', value)}>
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
            <Badge variant="outline">Exam: {tracks.find(t => t.value === formData.track)?.examDuration} minutes</Badge>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Education Level *</Label>
        <Select value={formData.educationLevel} onValueChange={(value) => handleSelectChange('educationLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your education level" />
          </SelectTrigger>
          <SelectContent>
            {educationLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Current Occupation *</Label>
        <Select value={formData.currentOccupation} onValueChange={(value) => handleSelectChange('currentOccupation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your current occupation" />
          </SelectTrigger>
          <SelectContent>
            {occupations.map((occupation) => (
              <SelectItem key={occupation} value={occupation}>
                {occupation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthlyIncome">Monthly Income (USD) *</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="monthlyIncome"
            name="monthlyIncome"
            type="number"
            value={formData.monthlyIncome}
            onChange={handleChange}
            placeholder="0"
            className="pl-10"
            min="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="familySize">Family Size *</Label>
        <div className="relative">
          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="familySize"
            name="familySize"
            type="number"
            value={formData.familySize}
            onChange={handleChange}
            placeholder="1"
            className="pl-10"
            min="1"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">Why do you want this scholarship? *</Label>
        <Textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          placeholder="Tell us about your motivation and goals..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousExperience">Previous Programming Experience</Label>
        <Textarea
          id="previousExperience"
          name="previousExperience"
          value={formData.previousExperience}
          onChange={handleChange}
          placeholder="Describe any previous programming or technical experience..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Review Your Application</h3>
        <p className="text-muted-foreground">Please review your information before submitting</p>
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
          <span className="text-muted-foreground">Phone:</span>
          <span className="font-medium">{formData.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Track:</span>
          <span className="font-medium">{tracks.find(t => t.value === formData.track)?.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Education:</span>
          <span className="font-medium">{formData.educationLevel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Occupation:</span>
          <span className="font-medium">{formData.currentOccupation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monthly Income:</span>
          <span className="font-medium">${formData.monthlyIncome}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Family Size:</span>
          <span className="font-medium">{formData.familySize}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
          required
        />
        <Label htmlFor="agreeToTerms" className="text-sm">
          I agree to the{" "}
          <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          {" "}and{" "}
          <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Scholarship Application</h1>
            <p className="text-muted-foreground">Apply for ACA's need-based scholarship program</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
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
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Academic & Professional Background"}
              {currentStep === 3 && "Financial Information & Motivation"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Share your educational and work background"}
              {currentStep === 3 && "Help us understand your financial situation and motivation"}
              {currentStep === 4 && "Review your application before submitting"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="flex-1" 
                  size="lg"
                  disabled={
                    isSubmitting || 
                    (currentStep === 4 && !formData.agreeToTerms)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === 4 ? "Submit Application" : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <Separator />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <a href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 