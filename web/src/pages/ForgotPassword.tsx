import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { authApi } from "@/lib/requests";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await authApi.forgotPassword({ email });

            if (response.success) {
                setIsSubmitted(true);
                toast({
                    title: "Reset link sent!",
                    description: "Check your email for password reset instructions.",
                });
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to send reset link. Please try again.",
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

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo and Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Check Your Email</h1>
                            <p className="text-muted-foreground">We've sent you a password reset link</p>
                        </div>
                    </div>

                    <Card className="card-elevated">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Reset link sent!</h3>
                                    <p className="text-muted-foreground mb-4">
                                        We've sent a password reset link to <strong>{email}</strong>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        If you don't see the email, check your spam folder or try again.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setIsSubmitted(false)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Send another link
                                    </Button>
                                    <Link to="/login">
                                        <Button variant="ghost" className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo and Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-2xl">A</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Forgot Password?</h1>
                        <p className="text-muted-foreground">Enter your email to reset your password</p>
                    </div>
                </div>

                <Card className="card-elevated">
                    <CardHeader className="space-y-2">
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            We'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
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
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Remember your password? </span>
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 