
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Save } from "lucide-react";

import BackofficeLayout from "@/components/BackofficeLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  language: z.enum(["en", "es"]),
});

type FormValues = z.infer<typeof formSchema>;

const BackofficeSettings = () => {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    setLanguage(data.language);
    toast({
      title: t("settingsSaved"),
      description: `${new Date().toLocaleTimeString()}`,
    });
  };
  
  return (
    <BackofficeLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{t("backofficeSettings")}</h1>
          <p className="text-muted-foreground">
            {t("languageSettings")}
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("languageSettings")}</CardTitle>
              <CardDescription>
                {t("selectLanguage")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="en" id="en" />
                              </FormControl>
                              <FormLabel htmlFor="en" className="font-normal cursor-pointer">
                                {t("english")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="es" id="es" />
                              </FormControl>
                              <FormLabel htmlFor="es" className="font-normal cursor-pointer">
                                {t("spanish")}
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {t("save")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default BackofficeSettings;
