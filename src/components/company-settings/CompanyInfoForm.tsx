
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define form schema
const companyInfoSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  backofficeTitle: z.string().min(2, "Backoffice title must be at least 2 characters"),
  // File fields are handled separately
});

type CompanyInfoFormProps = {
  defaultValues: {
    name: string;
    backofficeTitle: string;
    companyLogo: string | null;
    backofficeIcon: string | null;
  };
  onSubmit: (data: any) => void;
  isLoading: boolean;
};

export const CompanyInfoForm = ({ defaultValues, onSubmit, isLoading }: CompanyInfoFormProps) => {
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(defaultValues.companyLogo);
  const [backofficeIcon, setBackofficeIcon] = useState<File | null>(null);
  const [backofficeIconPreview, setBackofficeIconPreview] = useState<string | null>(defaultValues.backofficeIcon);

  const form = useForm<z.infer<typeof companyInfoSchema>>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      name: defaultValues.name,
      backofficeTitle: defaultValues.backofficeTitle,
    },
  });

  // Convert file to Base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompanyLogo(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackofficeIcon(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackofficeIconPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: z.infer<typeof companyInfoSchema>) => {
    // Prepare form data with Base64 encoded images
    const formData: any = {
      ...data,
      companyLogo: companyLogoPreview,
      backofficeIcon: backofficeIconPreview
    };
    
    // Convert new files to Base64 if they exist
    if (companyLogo) {
      formData.companyLogo = await fileToBase64(companyLogo);
    }
    
    if (backofficeIcon) {
      formData.backofficeIcon = await fileToBase64(backofficeIcon);
    }
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your company shown throughout the application.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="backofficeTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backoffice Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter backoffice title" {...field} />
              </FormControl>
              <FormDescription>
                This title will be displayed in the top left corner of the backoffice.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyLogo">Company Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex-shrink-0 w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center bg-sidebar">
                {companyLogoPreview ? (
                  <img 
                    src={companyLogoPreview} 
                    alt="Company Logo Preview" 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">No logo</span>
                )}
              </div>
              <div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('companyLogo')?.click()}
                  className="flex gap-2"
                >
                  <Upload size={16} />
                  Upload Logo
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended size: 200x200px. Max size: 2MB.
                </p>
                <input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="backofficeIcon">Backoffice Icon</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden flex items-center justify-center bg-sidebar">
                {backofficeIconPreview ? (
                  <img 
                    src={backofficeIconPreview} 
                    alt="Backoffice Icon Preview" 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">No icon</span>
                )}
              </div>
              <div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('backofficeIcon')?.click()}
                  className="flex gap-2"
                >
                  <Upload size={16} />
                  Upload Icon
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended size: 32x32px. Max size: 1MB.
                </p>
                <input
                  id="backofficeIcon"
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="flex gap-2">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
