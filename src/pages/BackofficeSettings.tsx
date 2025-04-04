
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Globe, Languages } from "lucide-react";
import { useForm } from "react-hook-form";
import { 
  useBackofficeSettings, 
  BackofficeSettings as SettingsType 
} from "@/contexts/BackofficeSettingsContext";
import { toast } from "@/hooks/use-toast";
import { translate } from "@/lib/translations";

const BackofficeSettings = () => {
  const { settings, updateSettings } = useBackofficeSettings();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the translate function based on current language
  const getTranslation = (key: string): string => {
    return translate(key, settings.language);
  };
  
  // Form setup with defaults from current settings
  const form = useForm<SettingsType>({
    defaultValues: {
      language: settings.language,
      timezone: settings.timezone
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: SettingsType) => {
    setIsSubmitting(true);
    
    try {
      updateSettings(data);
      
      toast({
        title: getTranslation("settings-saved"),
        variant: "default",
      });
      
      // If language changed, force a reload to apply translations
      if (data.language !== settings.language) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: getTranslation("error-saving-settings"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Comprehensive list of timezones
  const timezones = [
    "UTC",
    // Americas
    "America/New_York", // Eastern Time
    "America/Chicago", // Central Time
    "America/Denver", // Mountain Time
    "America/Los_Angeles", // Pacific Time
    "America/Anchorage", // Alaska
    "America/Adak", // Hawaii-Aleutian
    "Pacific/Honolulu", // Hawaii
    "America/Toronto",
    "America/Vancouver",
    "America/Mexico_City",
    "America/Bogota",
    "America/Lima",
    "America/Santiago",
    "America/Buenos_Aires",
    "America/Sao_Paulo",
    "America/Caracas",
    // Europe
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Madrid",
    "Europe/Rome",
    "Europe/Amsterdam",
    "Europe/Brussels",
    "Europe/Vienna",
    "Europe/Moscow",
    "Europe/Athens",
    "Europe/Istanbul",
    // Asia
    "Asia/Jerusalem",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Bangkok",
    "Asia/Singapore",
    "Asia/Hong_Kong",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Asia/Seoul",
    // Oceania
    "Australia/Sydney",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Brisbane",
    "Pacific/Auckland",
    // Africa
    "Africa/Cairo",
    "Africa/Johannesburg",
    "Africa/Nairobi",
    "Africa/Lagos"
  ];

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {getTranslation("backoffice-settings")}
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <CardTitle>{getTranslation("language")}</CardTitle>
            </div>
            <CardDescription>
              {getTranslation("language-description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("language")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={getTranslation("select-language")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation("timezone")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={getTranslation("select-timezone")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getTranslation("timezone-description")}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {getTranslation("save-settings")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>
                {getTranslation("date-time-preview")}
              </CardTitle>
            </div>
            <CardDescription>
              {getTranslation("date-time-preview-description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="mb-2 text-sm font-medium text-muted-foreground">
                {getTranslation("current-date-time")}
              </div>
              <div className="text-lg font-medium">
                {new Intl.DateTimeFormat(
                  settings.language === "en" ? "en-US" : "es-ES", 
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: form.watch("timezone") || settings.timezone,
                    timeZoneName: "short"
                  }
                ).format(new Date())}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackofficeSettings;
