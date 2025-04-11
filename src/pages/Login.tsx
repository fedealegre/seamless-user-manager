
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getDefaultLandingPage } from "@/App";

const loginSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { isAuthenticated, login, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle redirects when authentication status or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultPage = getDefaultLandingPage(user.roles);
      navigate(defaultPage, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    const { rememberMe, ...credentials } = values;
    
    // Build complete LoginRequest as defined in the OpenAPI spec
    const loginRequest: LoginRequest = {
      userName: credentials.userName, // Ensure userName is not optional
      password: credentials.password, // Ensure password is not optional
      // Optional device information for enhanced security
      appPlatform: navigator.platform,
      appVersion: navigator.appVersion,
    };
    
    try {
      await login(loginRequest);
      // Redirection will be handled by the useEffect hook
    } catch (error) {
      // Error is handled by the auth context
      console.error("Login failed:", error);
    }
  };

  // If already authenticated, don't render the login form
  if (isAuthenticated && user) {
    return null; // The useEffect hook will handle the redirection
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-scale-in glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2">
            <span className="text-primary-foreground font-bold text-xl">PB</span>
          </div>
          <CardTitle className="text-2xl font-bold">Payment Backoffice</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="username" className="glass-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        autoComplete="current-password" 
                        className="glass-input" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="text-sm cursor-pointer">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button variant="link" className="text-sm p-0 h-auto" type="button">
                  Forgot password?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Contact your administrator if you're having trouble logging in.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
