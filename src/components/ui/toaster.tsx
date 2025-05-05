
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext"
import { translate } from "@/lib/translations"

export function Toaster() {
  const { toasts } = useToast()
  const { settings } = useBackofficeSettings()
  const t = (key: string) => translate(key, settings.language)

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Translate title and description if they match translation keys
        const translatedTitle = title && typeof title === 'string' && t(title) !== title ? t(title) : title
        const translatedDescription = description && typeof description === 'string' && t(description) !== description ? t(description) : description
        
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {translatedTitle && <ToastTitle>{translatedTitle}</ToastTitle>}
              {translatedDescription && (
                <ToastDescription>{translatedDescription}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
