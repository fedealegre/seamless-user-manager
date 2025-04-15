
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/contexts/CompanySettings";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { LoginRequest } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getDefaultLandingPage } from "@/App";
import { translate } from "@/lib/translations";

const loginSchema = z.object({
  userName: z.string().min(1, "username-required"),
  password: z.string().min(1, "password-required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { isAuthenticated, login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { settings: companySettings } = useCompanySettings();
  const { settings } = useBackofficeSettings();
  
  const t = (key: string) => translate(key, settings.language);

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
    
    const loginRequest: LoginRequest = {
      userName: credentials.userName,
      password: credentials.password,
      appPlatform: navigator.platform,
      appVersion: navigator.appVersion,
    };
    
    try {
      await login(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-scale-in glass-card">
        <CardHeader className="space-y-1 text-center">
          {companySettings.backofficeIcon ? (
            <div className="mx-auto w-12 h-12 overflow-hidden rounded-xl">
              <img 
                src={companySettings.backofficeIcon} 
                alt={companySettings.backofficeTitle || t('login-title')}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2">
              <span className="text-primary-foreground font-bold text-xl">
                {(companySettings.backofficeTitle || t('login-title')).charAt(0)}
              </span>
            </div>
          )}
          <CardTitle className="text-2xl font-bold">
            {companySettings.backofficeTitle || t('login-title')}
          </CardTitle>
          <CardDescription>{t('login-description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="username" className="glass-input" />
                    </FormControl>
                    <FormMessage>{t(form.formState.errors.userName?.message || '')}</FormMessage>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        autoComplete="current-password" 
                        className="glass-input" 
                      />
                    </FormControl>
                    <FormMessage>{t(form.formState.errors.password?.message || '')}</FormMessage>
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
                      <FormLabel className="text-sm cursor-pointer">{t('remember-me')}</FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button variant="link" className="text-sm p-0 h-auto" type="button">
                  {t('forgot-password')}
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('signing-in') : t('sign-in')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          {t('admin-contact')}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
