
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Globe, Languages, Palette } from "lucide-react";
import { useForm } from "react-hook-form";
import { 
  useBackofficeSettings, 
  BackofficeSettings as SettingsType,
  Theme
} from "@/contexts/BackofficeSettingsContext";
import { toast } from "@/hooks/use-toast";
import { translate } from "@/lib/translations";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger
} from "@/components/ui/accordion";
import { ColorPicker } from "@/components/ui/color-picker";

const BackofficeSettings = () => {
  const { settings, updateSettings, applyColorValues } = useBackofficeSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeThemeTab, setActiveThemeTab] = useState<"light" | "dark">("light");
  
  // Get the translate function based on current language
  const getTranslation = (key: string): string => {
    return translate(key, settings.language);
  };
  
  // Check if user is admin - fixing the error by using 'roles' instead of 'role'
  const isAdmin = user?.roles?.includes("admin");
  
  // Form setup with defaults from current settings
  const form = useForm<SettingsType>({
    defaultValues: settings
  });
  
  // Handle form submission
  const onSubmit = async (data: SettingsType) => {
    setIsSubmitting(true);
    
    try {
      updateSettings(data);
      applyColorValues();
      
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
  
  // Update the preview in real-time as form values change
  React.useEffect(() => {
    const subscription = form.watch(() => {
      // Apply the current form values as CSS variables for real-time preview
      const currentValues = form.getValues();
      updateSettings(currentValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
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

  const renderColorField = (name: any, label: string, description?: string) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <FormLabel>{label}</FormLabel>
              <ColorPicker {...field} label={label} />
            </div>
            {description && (
              <FormDescription className="mt-0">
                {description}
              </FormDescription>
            )}
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {getTranslation("backoffice-settings")}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="language-timezone" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="language-timezone">
                {getTranslation("language-timezone")}
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="theme">
                  {getTranslation("theme")}
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* Language and Timezone Tab */}
            <TabsContent value="language-timezone" className="space-y-6">
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
                    <div className="space-y-6">
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
                    </div>
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
            </TabsContent>
            
            {/* Theme Tab - Only visible to admins */}
            {isAdmin && (
              <TabsContent value="theme" className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <CardTitle>{getTranslation("theme-settings")}</CardTitle>
                      </div>
                      <CardDescription>
                        {getTranslation("theme-settings-description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Theme Mode Selector */}
                      <div className="mb-6">
                        <FormField
                          control={form.control}
                          name="defaultTheme"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>{getTranslation("default-theme")}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="light" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {getTranslation("light")}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="dark" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {getTranslation("dark")}
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="system" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {getTranslation("system")}
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormDescription>
                                {getTranslation("default-theme-description")}
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Theme Mode Tabs */}
                      <div className="pb-6">
                        <Tabs 
                          value={activeThemeTab} 
                          onValueChange={(value) => setActiveThemeTab(value as "light" | "dark")}
                          className="w-full"
                        >
                          <TabsList className="mb-4 grid grid-cols-2 w-48">
                            <TabsTrigger value="light">
                              {getTranslation("light")}
                            </TabsTrigger>
                            <TabsTrigger value="dark">
                              {getTranslation("dark")}
                            </TabsTrigger>
                          </TabsList>
                          
                          {/* Light Mode Colors */}
                          <TabsContent value="light" className="space-y-4">
                            <Accordion type="multiple" defaultValue={["primary", "ui-colors"]}>
                              {/* Brand Colors */}
                              <AccordionItem value="primary">
                                <AccordionTrigger className="font-medium">
                                  Brand Colors
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("primaryColor", "Primary", "Main brand color used throughout the interface")}
                                  {renderColorField("primaryForeground", "Primary Foreground", "Text color on primary background")}
                                  {renderColorField("secondaryColor", "Secondary", "Secondary brand color for alternative UI elements")}
                                  {renderColorField("secondaryForeground", "Secondary Foreground", "Text color on secondary background")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* UI Colors */}
                              <AccordionItem value="ui-colors">
                                <AccordionTrigger className="font-medium">
                                  UI Colors
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("backgroundColor", "Background", "Main application background")}
                                  {renderColorField("foregroundColor", "Foreground", "Main text color")}
                                  {renderColorField("cardColor", "Card", "Background for cards and containers")}
                                  {renderColorField("cardForeground", "Card Foreground", "Text color for cards")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* Semantic Colors */}
                              <AccordionItem value="semantic-colors">
                                <AccordionTrigger className="font-medium">
                                  Semantic Colors
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("mutedColor", "Muted", "Background for deemphasized content")}
                                  {renderColorField("mutedForeground", "Muted Foreground", "Text color for deemphasized content")}
                                  {renderColorField("accentColor", "Accent", "Highlight color for UI elements")}
                                  {renderColorField("accentForeground", "Accent Foreground", "Text color on accent backgrounds")}
                                  {renderColorField("destructiveColor", "Destructive", "Color for destructive actions")}
                                  {renderColorField("destructiveForeground", "Destructive Foreground", "Text color on destructive backgrounds")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* Functional Colors */}
                              <AccordionItem value="functional-colors">
                                <AccordionTrigger className="font-medium">
                                  Functional Colors
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("borderColor", "Border", "Color for borders and dividers")}
                                  {renderColorField("inputColor", "Input", "Background color for input fields")}
                                  {renderColorField("ringColor", "Ring", "Focus ring color for interactive elements")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* Sidebar Colors */}
                              <AccordionItem value="sidebar-colors">
                                <AccordionTrigger className="font-medium">
                                  Sidebar Colors
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("sidebarBackground", "Sidebar Background", "Main sidebar background color")}
                                  {renderColorField("sidebarForeground", "Sidebar Foreground", "Sidebar text color")}
                                  {renderColorField("sidebarPrimary", "Sidebar Primary", "Primary color for sidebar elements")}
                                  {renderColorField("sidebarPrimaryForeground", "Sidebar Primary Foreground", "Text color on sidebar primary elements")}
                                  {renderColorField("sidebarAccent", "Sidebar Accent", "Accent color for sidebar elements")}
                                  {renderColorField("sidebarAccentForeground", "Sidebar Accent Foreground", "Text color on sidebar accent elements")}
                                  {renderColorField("sidebarBorder", "Sidebar Border", "Border color for sidebar elements")}
                                  {renderColorField("sidebarRing", "Sidebar Ring", "Focus ring color for sidebar elements")}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </TabsContent>
                          
                          {/* Dark Mode Colors */}
                          <TabsContent value="dark" className="space-y-4">
                            <Accordion type="multiple" defaultValue={["dark-primary", "dark-ui-colors"]}>
                              {/* Brand Colors */}
                              <AccordionItem value="dark-primary">
                                <AccordionTrigger className="font-medium">
                                  Brand Colors (Dark Mode)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("darkPrimaryColor", "Primary", "Main brand color for dark mode")}
                                  {renderColorField("darkPrimaryForeground", "Primary Foreground", "Text color on primary background in dark mode")}
                                  {renderColorField("darkSecondaryColor", "Secondary", "Secondary brand color for dark mode")}
                                  {renderColorField("darkSecondaryForeground", "Secondary Foreground", "Text color on secondary background in dark mode")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* UI Colors */}
                              <AccordionItem value="dark-ui-colors">
                                <AccordionTrigger className="font-medium">
                                  UI Colors (Dark Mode)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("darkBackgroundColor", "Background", "Main application background in dark mode")}
                                  {renderColorField("darkForegroundColor", "Foreground", "Main text color in dark mode")}
                                  {renderColorField("darkCardColor", "Card", "Background for cards and containers in dark mode")}
                                  {renderColorField("darkCardForeground", "Card Foreground", "Text color for cards in dark mode")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* Semantic Colors */}
                              <AccordionItem value="dark-semantic-colors">
                                <AccordionTrigger className="font-medium">
                                  Semantic Colors (Dark Mode)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("darkMutedColor", "Muted", "Background for deemphasized content in dark mode")}
                                  {renderColorField("darkMutedForeground", "Muted Foreground", "Text color for deemphasized content in dark mode")}
                                  {renderColorField("darkAccentColor", "Accent", "Highlight color for UI elements in dark mode")}
                                  {renderColorField("darkAccentForeground", "Accent Foreground", "Text color on accent backgrounds in dark mode")}
                                  {renderColorField("darkDestructiveColor", "Destructive", "Color for destructive actions in dark mode")}
                                  {renderColorField("darkDestructiveForeground", "Destructive Foreground", "Text color on destructive backgrounds in dark mode")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* Functional Colors */}
                              <AccordionItem value="dark-functional-colors">
                                <AccordionTrigger className="font-medium">
                                  Functional Colors (Dark Mode)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("darkBorderColor", "Border", "Color for borders and dividers in dark mode")}
                                  {renderColorField("darkInputColor", "Input", "Background color for input fields in dark mode")}
                                  {renderColorField("darkRingColor", "Ring", "Focus ring color for interactive elements in dark mode")}
                                </AccordionContent>
                              </AccordionItem>
                              
                              {/* Sidebar Colors */}
                              <AccordionItem value="dark-sidebar-colors">
                                <AccordionTrigger className="font-medium">
                                  Sidebar Colors (Dark Mode)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                  {renderColorField("darkSidebarBackground", "Sidebar Background", "Main sidebar background color in dark mode")}
                                  {renderColorField("darkSidebarForeground", "Sidebar Foreground", "Sidebar text color in dark mode")}
                                  {renderColorField("darkSidebarPrimary", "Sidebar Primary", "Primary color for sidebar elements in dark mode")}
                                  {renderColorField("darkSidebarPrimaryForeground", "Sidebar Primary Foreground", "Text color on sidebar primary elements in dark mode")}
                                  {renderColorField("darkSidebarAccent", "Sidebar Accent", "Accent color for sidebar elements in dark mode")}
                                  {renderColorField("darkSidebarAccentForeground", "Sidebar Accent Foreground", "Text color on sidebar accent elements in dark mode")}
                                  {renderColorField("darkSidebarBorder", "Sidebar Border", "Border color for sidebar elements in dark mode")}
                                  {renderColorField("darkSidebarRing", "Sidebar Ring", "Focus ring color for sidebar elements in dark mode")}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <CardTitle>{getTranslation("theme-preview")}</CardTitle>
                      </div>
                      <CardDescription>
                        {getTranslation("theme-preview-description")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Color Palette</h3>
                        <div className="flex flex-wrap gap-2">
                          <div className="p-4 rounded-md bg-primary text-primary-foreground">
                            {getTranslation("primary")}
                          </div>
                          <div className="p-4 rounded-md bg-secondary text-secondary-foreground">
                            {getTranslation("secondary")}
                          </div>
                          <div className="p-4 rounded-md bg-accent text-accent-foreground">
                            {getTranslation("accent")}
                          </div>
                          <div className="p-4 rounded-md bg-muted text-muted-foreground">
                            {getTranslation("muted")}
                          </div>
                          <div className="p-4 rounded-md bg-destructive text-destructive-foreground">
                            {getTranslation("destructive")}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium mt-6">UI Elements</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="default">
                            {getTranslation("default")}
                          </Button>
                          <Button variant="secondary">
                            {getTranslation("secondary")}
                          </Button>
                          <Button variant="destructive">
                            {getTranslation("destructive")}
                          </Button>
                          <Button variant="outline">
                            {getTranslation("outline")}
                          </Button>
                          <Button variant="ghost">
                            {getTranslation("ghost")}
                          </Button>
                        </div>
                        
                        <h3 className="text-lg font-medium mt-6">Form Elements</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Input</label>
                            <Input placeholder="Input example" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Select</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select example" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="option1">Option 1</SelectItem>
                                <SelectItem value="option2">Option 2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium mt-6">Sidebar Preview</h3>
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-sidebar p-4 flex flex-col gap-2 text-sidebar-foreground">
                            <div className="p-2 font-medium">Sidebar Navigation</div>
                            <div className="p-2 bg-sidebar-accent rounded-md text-sidebar-accent-foreground">
                              Dashboard
                            </div>
                            <div className="p-2">Users</div>
                            <div className="p-2">Settings</div>
                            <div className="p-2 mt-2">
                              <Button className="w-full bg-sidebar-primary text-sidebar-primary-foreground">
                                Action Button
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {getTranslation("save-settings")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BackofficeSettings;
