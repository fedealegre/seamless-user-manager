
import React from "react";
import { Check } from "lucide-react";

interface PasswordRequirementsProps {
  value: string;
  t: (key: string) => string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ value, t }) => {
  // Password validation checks
  const hasMinLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  return (
    <div className="rounded-md border p-4">
      <p className="mb-2 text-sm font-medium">{t("password-requirements")}</p>
      <ul className="space-y-1">
        <li className="flex items-center text-sm">
          <span className={`mr-2 ${hasMinLength ? "text-green-500" : "text-muted-foreground"}`}>
            {hasMinLength ? <Check className="h-4 w-4" /> : "•"}
          </span>
          {t("password-min-length")}
        </li>
        <li className="flex items-center text-sm">
          <span className={`mr-2 ${hasUppercase ? "text-green-500" : "text-muted-foreground"}`}>
            {hasUppercase ? <Check className="h-4 w-4" /> : "•"}
          </span>
          {t("password-uppercase")}
        </li>
        <li className="flex items-center text-sm">
          <span className={`mr-2 ${hasLowercase ? "text-green-500" : "text-muted-foreground"}`}>
            {hasLowercase ? <Check className="h-4 w-4" /> : "•"}
          </span>
          {t("password-lowercase")}
        </li>
        <li className="flex items-center text-sm">
          <span className={`mr-2 ${hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
            {hasNumber ? <Check className="h-4 w-4" /> : "•"}
          </span>
          {t("password-number")}
        </li>
        <li className="flex items-center text-sm">
          <span className={`mr-2 ${hasSpecial ? "text-green-500" : "text-muted-foreground"}`}>
            {hasSpecial ? <Check className="h-4 w-4" /> : "•"}
          </span>
          {t("password-special")}
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
