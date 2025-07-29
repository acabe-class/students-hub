import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Github, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Login failed",
          description: error || "Please check your credentials and try again.",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">A</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to ACA Student Hub</p>
          </div>
        </div>

        <Card className="card-elevated">
          <CardHeader className="space-y-2">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your learning dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-muted/30 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-center">Demo Accounts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="font-mono">student@aca.edu</span>
              </div>
              <div className="flex justify-between">
                <span>Tutor:</span>
                <span className="font-mono">tutor@aca.edu</span>
              </div>
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono">admin@aca.edu</span>
              </div>
              <div className="text-center text-muted-foreground mt-2">
                Password: demo123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}