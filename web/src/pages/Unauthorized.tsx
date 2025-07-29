import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo and Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Access Denied</h1>
                        <p className="text-muted-foreground">You don't have permission to access this page</p>
                    </div>
                </div>

                <Card className="card-elevated">
                    <CardHeader className="text-center">
                        <CardTitle>Unauthorized Access</CardTitle>
                        <CardDescription>
                            Sorry, you don't have the required permissions to view this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                                <p className="text-muted-foreground">
                                    This page requires specific permissions that your account doesn't have.
                                    Please contact your administrator if you believe this is an error.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link to="/dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Back
                                </Link>
                            </Button>
                            <Button className="flex-1" asChild>
                                <Link to="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go Home
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">Need Help?</h3>
                            <p className="text-muted-foreground">
                                If you believe you should have access to this page, please contact support.
                            </p>
                            <Button variant="outline" size="sm">
                                Contact Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 