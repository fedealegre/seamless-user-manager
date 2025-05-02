
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface PasswordFieldProps {
  name: "currentPassword" | "newPassword" | "confirmPassword";
  label: string;
  form: UseFormReturn<any>;
  autoComplete?: string;
  showMessage?: boolean;
  t: (key: string) => string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  name, 
  label, 
  form, 
  autoComplete = "current-password",
  showMessage = true,
  t 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            {...form.register(name)}
            type={showPassword ? "text" : "password"}
            autoComplete={autoComplete}
            className="pr-10"
          />
        </FormControl>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? t("hide-password") : t("show-password")}
          </span>
        </Button>
      </div>
      {showMessage && form.formState.errors[name]?.message && (
        <FormMessage>
          {t(form.formState.errors[name]?.message as string || "")}
        </FormMessage>
      )}
    </FormItem>
  );
};

export default PasswordField;
