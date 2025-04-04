
import { Language } from "@/contexts/BackofficeSettingsContext";

// Define translation keys and their values
interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

// Translations dictionary
const translations: Record<string, Record<string, string>> = {
  // Common
  "dashboard": {
    en: "Dashboard",
    es: "Dashboard"
  },
  "users": {
    en: "User Management",
    es: "Gestión de usuarios"
  },
  "wallets": {
    en: "Wallets",
    es: "Billeteras"
  },
  "transactions": {
    en: "Transactions",
    es: "Transacciones"
  },
  "anti-fraud": {
    en: "Anti-Fraud Rules",
    es: "Reglas Anti-Fraude"
  },
  "audit-logs": {
    en: "Audit Logs",
    es: "Registros de auditoría"
  },
  "backoffice-operators": {
    en: "Backoffice Operators",
    es: "Operadores de Back Office"
  },
  "company-settings": {
    en: "Company Settings",
    es: "Configuración de la compañía"
  },
  "user-field-settings": {
    en: "User Field Settings",
    es: "Configuración de campos de usuario"
  },
  "backoffice-settings": {
    en: "Backoffice Settings",
    es: "Configuración del BackOffice"
  },
  
  // Dashboard specific
  "total-users": {
    en: "Total Users",
    es: "Usuarios Totales"
  },
  "total-registered-users": {
    en: "Total registered users",
    es: "Total de usuarios registrados"
  },
  "active-wallets": {
    en: "Active Wallets",
    es: "Billeteras Activas"
  },
  "wallets-with-activity": {
    en: "Wallets with activity in last 30 days",
    es: "Billeteras con actividad en los últimos 30 días"
  },
  "transactions-7d": {
    en: "Transactions (7d)",
    es: "Transacciones (7d)"
  },
  "transactions-last-7-days": {
    en: "Transactions in the last 7 days",
    es: "Transacciones en los últimos 7 días"
  },
  "flagged-transactions": {
    en: "Flagged Transactions",
    es: "Transacciones Marcadas"
  },
  "transactions-flagged-suspicious": {
    en: "Transactions flagged as suspicious",
    es: "Transacciones marcadas como sospechosas"
  },
  "transaction-overview": {
    en: "Transaction Overview",
    es: "Resumen de Transacciones"
  },
  "transaction-volume-count": {
    en: "Transaction volume and count over time",
    es: "Volumen y recuento de transacciones a lo largo del tiempo"
  },
  "transaction-volume": {
    en: "Transaction Volume ($)",
    es: "Volumen de Transacciones ($)"
  },
  "transaction-count": {
    en: "Transaction Count",
    es: "Recuento de Transacciones"
  },
  "transaction-types": {
    en: "Transaction Types",
    es: "Tipos de Transacciones"
  },
  "distribution-by-category": {
    en: "Distribution by transaction category",
    es: "Distribución por categoría de transacción"
  },
  "user-growth": {
    en: "User Growth",
    es: "Crecimiento de Usuarios"
  },
  "new-user-registrations": {
    en: "New user registrations over time",
    es: "Nuevos registros de usuarios a lo largo del tiempo"
  },
  "new-users": {
    en: "New Users",
    es: "Nuevos Usuarios"
  },
  "recent-alerts": {
    en: "Recent Alerts",
    es: "Alertas Recientes"
  },
  "security-system-alerts": {
    en: "Security and system alerts",
    es: "Alertas de seguridad y sistema"
  },
  "day": {
    en: "Day",
    es: "Día"
  },
  "week": {
    en: "Week",
    es: "Semana"
  },
  "month": {
    en: "Month",
    es: "Mes"
  },
  "year": {
    en: "Year",
    es: "Año"
  },
  
  // Settings page
  "language": {
    en: "Language",
    es: "Idioma"
  },
  "language-description": {
    en: "Select the language for the backoffice interface",
    es: "Seleccione el idioma para la interfaz del back office"
  },
  "select-language": {
    en: "Select language",
    es: "Seleccionar idioma"
  },
  "timezone": {
    en: "Time Zone",
    es: "Zona horaria"
  },
  "timezone-description": {
    en: "All dates will be displayed in this timezone",
    es: "Todas las fechas se mostrarán en esta zona horaria"
  },
  "select-timezone": {
    en: "Select timezone",
    es: "Seleccionar zona horaria"
  },
  "save-settings": {
    en: "Save Settings",
    es: "Guardar configuración"
  },
  "settings-saved": {
    en: "Settings saved successfully",
    es: "Configuración guardada exitosamente"
  },
  "error-saving-settings": {
    en: "Error saving settings",
    es: "Error al guardar la configuración"
  },
  "date-time-preview": {
    en: "Date & Time Preview",
    es: "Vista previa de fecha y hora"
  },
  "date-time-preview-description": {
    en: "Preview how dates will be displayed with current settings",
    es: "Vista previa de cómo se mostrarán las fechas con la configuración actual"
  },
  "current-date-time": {
    en: "Current date and time:",
    es: "Fecha y hora actual:"
  },
  
  // Management section
  "management": {
    en: "Management",
    es: "Gestión"
  },
  "security": {
    en: "Security",
    es: "Seguridad"
  },
  "settings": {
    en: "Settings",
    es: "Configuración"
  },
  
  // Status and actions
  "active": {
    en: "Active",
    es: "Activo"
  },
  "pending": {
    en: "Pending",
    es: "Pendiente"
  },
  "blocked": {
    en: "Blocked",
    es: "Bloqueado"
  },
  "frozen": {
    en: "Frozen",
    es: "Congelado"
  },
  "status": {
    en: "Status",
    es: "Estado"
  },
  "actions": {
    en: "Actions",
    es: "Acciones"
  },
  "view": {
    en: "View",
    es: "Ver"
  },
  "edit": {
    en: "Edit",
    es: "Editar"
  },
  "delete": {
    en: "Delete",
    es: "Eliminar"
  },
  "save": {
    en: "Save",
    es: "Guardar"
  },
  "cancel": {
    en: "Cancel",
    es: "Cancelar"
  },
  "search": {
    en: "Search",
    es: "Buscar"
  },
  "refresh": {
    en: "Refresh",
    es: "Actualizar"
  },
  
  // Transaction related
  "transaction-id": {
    en: "Transaction ID",
    es: "ID de transacción"
  },
  "reference": {
    en: "Reference",
    es: "Referencia"
  },
  "date": {
    en: "Date",
    es: "Fecha"
  },
  "type": {
    en: "Type", 
    es: "Tipo"
  },
  "amount": {
    en: "Amount",
    es: "Monto"
  },
  "currency": {
    en: "Currency",
    es: "Moneda"
  },
  "completed": {
    en: "Completed",
    es: "Completado"
  },
  "cancelled": {
    en: "Cancelled",
    es: "Cancelado"
  },
  "failed": {
    en: "Failed", 
    es: "Fallido"
  },
  "deposit": {
    en: "Deposit",
    es: "Depósito"
  },
  "withdrawal": {
    en: "Withdrawal",
    es: "Retiro"
  },
  "transfer": {
    en: "Transfer",
    es: "Transferencia"
  },
  "compensation": {
    en: "Compensation",
    es: "Compensación"
  },
  
  // Wallet related
  "balance": {
    en: "Balance",
    es: "Saldo"
  },
  "available-balance": {
    en: "Available Balance",
    es: "Saldo disponible"
  },
  "wallet-id": {
    en: "Wallet ID",
    es: "ID de billetera"
  },
  "no-wallets-found": {
    en: "No wallets found",
    es: "No se encontraron billeteras"
  },
  "no-transactions-found": {
    en: "No transactions found",
    es: "No se encontraron transacciones"
  },
  "user-wallets": {
    en: "User Wallets",
    es: "Billeteras del usuario"
  },
  "wallet-transactions": {
    en: "Wallet Transactions",
    es: "Transacciones de billetera"
  },
  "wallet": {
    en: "Wallet",
    es: "Billetera"
  },
  "all-wallets": {
    en: "All Wallets",
    es: "Todas las Billeteras"
  },
  "manage-wallets-for-all-users": {
    en: "Manage wallets for all users",
    es: "Administrar billeteras para todos los usuarios"
  },
  "search-wallets": {
    en: "Search wallets...",
    es: "Buscar billeteras..."
  },
  "across-all-users": {
    en: "Across all users",
    es: "A través de todos los usuarios"
  },
  "currently-active": {
    en: "Currently active",
    es: "Actualmente activas"
  },
  "total-balance": {
    en: "Total Balance",
    es: "Saldo Total"
  },
  "usd-equivalent": {
    en: "USD equivalent",
    es: "Equivalente en USD"
  },
  "users-with-wallets": {
    en: "Users with Wallets",
    es: "Usuarios con Billeteras"
  },
  "total-users-with-wallets": {
    en: "Total users with wallets",
    es: "Total de usuarios con billeteras"
  },
  
  // Additional UI text
  "back-to-wallets": {
    en: "Back to Wallets",
    es: "Volver a Billeteras"
  },
  "loading": {
    en: "Loading...",
    es: "Cargando..."
  },
  "unknown": {
    en: "Unknown",
    es: "Desconocido"
  },
  "error": {
    en: "Error",
    es: "Error"
  },
  "success": {
    en: "Success",
    es: "Éxito"
  },
  
  // Export related
  "export-csv": {
    en: "Export CSV",
    es: "Exportar CSV"
  },
  "no-data-to-export": {
    en: "No data to export",
    es: "No hay datos para exportar"
  },
  "export-successful": {
    en: "Export Successful",
    es: "Exportación Exitosa"
  },
  "data-exported-successfully": {
    en: "The data has been exported to CSV successfully",
    es: "Los datos han sido exportados a CSV exitosamente"
  },
  "user-id": {
    en: "User ID",
    es: "ID de usuario"
  },
  "transactions-found": {
    en: "transactions found",
    es: "transacciones encontradas"
  },
  "monitor-and-manage-payment-transactions": {
    en: "Monitor and manage payment transactions",
    es: "Monitorear y gestionar transacciones de pagos"
  },
  "income": {
    en: "Income",
    es: "Ingreso"
  },
  "outcome": {
    en: "Outcome",
    es: "Egreso"
  },
  "transaction-cancellation-not-implemented": {
    en: "Transaction cancellation not implemented for",
    es: "Cancelación de transacción no implementada para"
  },
  "cancel-transaction": {
    en: "Cancel Transaction",
    es: "Cancelar Transacción"
  },
  "compensate": {
    en: "Compensate",
    es: "Compensar"
  },
  "customer": {
    en: "Customer",
    es: "Cliente"
  },
  "details": {
    en: "Details",
    es: "Detalles"
  },
  "transactions-for-wallet": {
    en: "Transactions for wallet",
    es: "Transacciones para la billetera"
  },
  "user-transactions": {
    en: "User Transactions",
    es: "Transacciones de Usuario"
  },
  "view-wallet-transactions": {
    en: "View wallet transactions",
    es: "Ver transacciones de billetera"
  },
  "found": {
    en: "found",
    es: "encontradas"
  },
  "click-wallet-view-transactions": {
    en: "Click on a wallet to view its transactions",
    es: "Haga clic en una billetera para ver sus transacciones"
  },
  "missing-transaction-wallet-info": {
    en: "Missing transaction or wallet information",
    es: "Falta información de transacción o billetera"
  },
  "compensation-processed": {
    en: "Compensation Processed",
    es: "Compensación Procesada"
  },
  "compensation-transaction-created": {
    en: "Compensation transaction has been created successfully",
    es: "La transacción de compensación ha sido creada exitosamente"
  },
  "compensation-failed": {
    en: "Compensation Failed",
    es: "Compensación Fallida"
  },
  "compensation-error": {
    en: "An error occurred during the compensation process",
    es: "Ocurrió un error durante el proceso de compensación"
  },
  
  // Audit log related
  "audit-log-details": {
    en: "Audit Log Details",
    es: "Detalles del Registro de Auditoría"
  },
  "detailed-info-audit-log": {
    en: "Detailed information about the selected audit log entry",
    es: "Información detallada sobre la entrada de registro de auditoría seleccionada"
  },
  "timestamp": {
    en: "Timestamp",
    es: "Marca de tiempo"
  },
  "user": {
    en: "User",
    es: "Usuario"
  },
  "operation-type": {
    en: "Operation Type",
    es: "Tipo de Operación"
  },
  "entity": {
    en: "Entity",
    es: "Entidad"
  },
  "previous-value": {
    en: "Previous Value",
    es: "Valor Anterior"
  },
  "new-value": {
    en: "New Value",
    es: "Nuevo Valor"
  },
  "start-date": {
    en: "Start Date",
    es: "Fecha de Inicio"
  },
  "end-date": {
    en: "End Date",
    es: "Fecha de Fin"
  },
  "search-by-user": {
    en: "Search by user",
    es: "Buscar por usuario"
  },
  "all-operations": {
    en: "All operations",
    es: "Todas las operaciones"
  },
  "operation-types": {
    en: "Operation Types",
    es: "Tipos de Operación"
  },
  "reset-filters": {
    en: "Reset Filters",
    es: "Restablecer Filtros"
  },
  "date-time": {
    en: "Date & Time",
    es: "Fecha y Hora"
  },
  "operation": {
    en: "Operation",
    es: "Operación"
  },
  "no-log-entries-found": {
    en: "No log entries found",
    es: "No se encontraron entradas de registro"
  },
  "adjust-filters": {
    en: "Try adjusting your filters or checking back later",
    es: "Intente ajustar sus filtros o vuelva más tarde"
  },
  "view-details": {
    en: "View Details",
    es: "Ver Detalles"
  },
  
  // Backoffice users
  "block-backoffice-user": {
    en: "Block Backoffice User",
    es: "Bloquear Usuario de Backoffice"
  },
  "block-confirmation": {
    en: "Are you sure you want to block",
    es: "¿Está seguro de que desea bloquear"
  },
  "block-warning": {
    en: "They will no longer be able to access the backoffice system",
    es: "Ya no podrán acceder al sistema de backoffice"
  },
  "user-blocked-success": {
    en: "User blocked successfully",
    es: "Usuario bloqueado exitosamente"
  },
  "failed-block-user": {
    en: "Failed to block user",
    es: "Error al bloquear usuario"
  },
  "user-not-found-may-be-deleted": {
    en: "User not found. The user may have been deleted",
    es: "Usuario no encontrado. Es posible que el usuario haya sido eliminado"
  },
  "cannot-block-without-id": {
    en: "Cannot block user without an ID",
    es: "No se puede bloquear al usuario sin un ID"
  },
  "blocking": {
    en: "Blocking...",
    es: "Bloqueando..."
  },
  "block-user": {
    en: "Block User",
    es: "Bloquear Usuario"
  },
  
  // User Detail Page
  "user-detail": {
    en: "User Details",
    es: "Detalles del Usuario"
  },
  "view-manage-user-info": {
    en: "View and manage user information",
    es: "Ver y gestionar información del usuario"
  },
  "back": {
    en: "Back",
    es: "Atrás"
  },
  "personal-info": {
    en: "Personal Info",
    es: "Información Personal"
  },
  "user-not-found": {
    en: "User not found",
    es: "Usuario no encontrado"
  },
  "requested-user-not-found": {
    en: "The requested user could not be found",
    es: "El usuario solicitado no pudo ser encontrado"
  },
  "back-to-user-management": {
    en: "Back to User Management",
    es: "Volver a Gestión de Usuarios"
  },
  
  // User Management Page
  "user-management": {
    en: "User Management",
    es: "Gestión de Usuarios"
  },
  "manage-monitor-customer-accounts": {
    en: "Manage and monitor customer accounts",
    es: "Gestionar y monitorear cuentas de clientes"
  },
  "search-users": {
    en: "Search Users",
    es: "Buscar Usuarios"
  },
  "search-history": {
    en: "Search History",
    es: "Historial de Búsqueda"
  },
  "search-users-button": {
    en: "Search Users",
    es: "Buscar Usuarios"
  },
  "users-found": {
    en: "users found",
    es: "usuarios encontrados"
  },
  "no-users-found": {
    en: "No users found",
    es: "No se encontraron usuarios"
  },
  "recent-searches": {
    en: "Recent Searches",
    es: "Búsquedas Recientes"
  },
  "your-recent-user-searches": {
    en: "Your recent user searches",
    es: "Sus búsquedas recientes de usuarios"
  },
  "clear-all": {
    en: "Clear All",
    es: "Borrar Todo"
  },
  "no-recent-searches": {
    en: "No recent searches",
    es: "No hay búsquedas recientes"
  },
  "search-again": {
    en: "Search Again",
    es: "Buscar Nuevamente"
  },
  
  // Backoffice Operators Page
  "backoffice-operators-management": {
    en: "Backoffice Operators Management",
    es: "Gestión de Operadores de Back Office"
  },
  "add-new-operator": {
    en: "Add New Operator",
    es: "Agregar Nuevo Operador"
  },
  "search-by-name-id-email-role": {
    en: "Search by name, ID, email, or role...",
    es: "Buscar por nombre, ID, correo electrónico o rol..."
  },
  "error-loading-operators": {
    en: "Error Loading Operators",
    es: "Error al Cargar Operadores"
  },
  "failed-load-backoffice-operators": {
    en: "Failed to load backoffice operators. Please try again.",
    es: "Error al cargar los operadores de back office. Por favor, inténtelo de nuevo."
  },
  "retry": {
    en: "Retry",
    es: "Reintentar"
  },
  
  // User Field Settings Page
  "configure-user-fields-backoffice": {
    en: "Configure which user fields are visible and editable in the backoffice",
    es: "Configurar qué campos de usuario son visibles y editables en el back office"
  },
  "saving": {
    en: "Saving...",
    es: "Guardando..."
  },
  "user-field-configuration": {
    en: "User Field Configuration",
    es: "Configuración de Campos de Usuario"
  },
  "toggle-visibility-editability": {
    en: "Toggle visibility and editability for each user field in the backoffice. Changes will apply to the User Detail pages.",
    es: "Active/desactive la visibilidad y la editabilidad de cada campo de usuario en el back office. Los cambios se aplicarán a las páginas de Detalle de Usuario."
  },
  "field": {
    en: "Field",
    es: "Campo"
  },
  "visible": {
    en: "Visible",
    es: "Visible"
  },
  "editable": {
    en: "Editable",
    es: "Editable"
  },
  "user-field-settings-updated": {
    en: "User field settings have been updated successfully.",
    es: "La configuración de campos de usuario se ha actualizado exitosamente."
  },
  "access-denied": {
    en: "Access Denied",
    es: "Acceso Denegado"
  },
  "no-permission-access-user-field-settings": {
    en: "You don't have permission to access User Field Settings.",
    es: "No tiene permiso para acceder a la Configuración de Campos de Usuario."
  },
  "required-role": {
    en: "Required role:",
    es: "Rol requerido:"
  },
  
  // Anti-Fraud Rules Page
  "anti-fraud-rules": {
    en: "Anti-Fraud Rules",
    es: "Reglas Anti-Fraude"
  },
  "manage-transaction-limits-security": {
    en: "Manage transaction limits and security rules",
    es: "Gestionar límites de transacción y reglas de seguridad"
  },
  "add-new-rule": {
    en: "Add New Rule",
    es: "Agregar Nueva Regla"
  },
  "add-new-anti-fraud-rule": {
    en: "Add New Anti-Fraud Rule",
    es: "Agregar Nueva Regla Anti-Fraude"
  },
  "create-new-rule": {
    en: "Create a new rule to limit transaction amounts over a specific time period.",
    es: "Crear una nueva regla para limitar los montos de transacción durante un período de tiempo específico."
  },
  "time-period": {
    en: "Time Period",
    es: "Período de Tiempo"
  },
  "limit-amount": {
    en: "Limit Amount",
    es: "Monto Límite"
  },
  "enter-transaction-type": {
    en: "Enter transaction type",
    es: "Ingrese tipo de transacción"
  },
  "add": {
    en: "Add",
    es: "Agregar"
  },
  "save-rule": {
    en: "Save Rule",
    es: "Guardar Regla"
  },
  "rules-limit-transaction-amounts": {
    en: "Rules that limit transaction amounts over specific time periods",
    es: "Reglas que limitan los montos de transacción durante períodos de tiempo específicos"
  },
  "no-anti-fraud-rules-configured": {
    en: "No anti-fraud rules configured yet.",
    es: "Aún no hay reglas anti-fraude configuradas."
  },
  "add-your-first-rule": {
    en: "Add Your First Rule",
    es: "Agregar Su Primera Regla"
  },
  "rule-id": {
    en: "Rule ID",
    es: "ID de Regla"
  },
  "application-period": {
    en: "Application Period",
    es: "Período de Aplicación"
  },
  "daily": {
    en: "Daily",
    es: "Diario"
  },
  "monthly": {
    en: "Monthly",
    es: "Mensual"
  },
  "yearly": {
    en: "Yearly",
    es: "Anual"
  },
  "edit-anti-fraud-rule": {
    en: "Edit Anti-Fraud Rule",
    es: "Editar Regla Anti-Fraude"
  },
  "modify-existing-rule": {
    en: "Modify the existing rule parameters.",
    es: "Modificar los parámetros de la regla existente."
  },
  "update-rule": {
    en: "Update Rule",
    es: "Actualizar Regla"
  },
  "rule-added-success": {
    en: "Anti-fraud rule has been added successfully.",
    es: "La regla anti-fraude ha sido agregada exitosamente."
  },
  "failed-add-rule": {
    en: "Failed to add anti-fraud rule. Please try again.",
    es: "Error al agregar la regla anti-fraude. Por favor, inténtelo de nuevo."
  },
  "rule-updated-success": {
    en: "Anti-fraud rule has been updated successfully.",
    es: "La regla anti-fraude ha sido actualizada exitosamente."
  },
  "failed-update-rule": {
    en: "Failed to update anti-fraud rule. Please try again.",
    es: "Error al actualizar la regla anti-fraude. Por favor, inténtelo de nuevo."
  },
  "rule-deleted-success": {
    en: "Anti-fraud rule has been deleted successfully.",
    es: "La regla anti-fraude ha sido eliminada exitosamente."
  },
  "failed-delete-rule": {
    en: "Failed to delete anti-fraud rule. Please try again.",
    es: "Error al eliminar la regla anti-fraude. Por favor, inténtelo de nuevo."
  },
  "confirm-delete-rule": {
    en: "Are you sure you want to delete this rule?",
    es: "¿Está seguro de que desea eliminar esta regla?"
  },
  
  // Company Settings Page
  "manage-company-info-config": {
    en: "Manage company information and configuration",
    es: "Gestionar información y configuración de la compañía"
  },
  "company-information": {
    en: "Company Information",
    es: "Información de la Compañía"
  },
  "notifications": {
    en: "Notifications",
    es: "Notificaciones"
  },
  "financial": {
    en: "Financial",
    es: "Financiero"
  },
  "update-company-info-branding": {
    en: "Update your company information and branding settings",
    es: "Actualizar información de la compañía y configuración de marca"
  },
  "notification-settings": {
    en: "Notification Settings",
    es: "Configuración de Notificaciones"
  },
  "configure-how-when-notifications": {
    en: "Configure how and when notifications are sent to users",
    es: "Configurar cómo y cuándo se envían notificaciones a los usuarios"
  },
  "financial-settings": {
    en: "Financial Settings",
    es: "Configuración Financiera"
  },
  "configure-tax-rates-commissions": {
    en: "Configure tax rates and commission percentages",
    es: "Configurar tasas de impuestos y porcentajes de comisión"
  },
  "company-information-updated": {
    en: "Company information updated",
    es: "Información de la compañía actualizada"
  },
  "changes-saved-successfully": {
    en: "Your changes have been saved successfully.",
    es: "Sus cambios se han guardado exitosamente."
  },
  "notification-settings-updated": {
    en: "Notification settings updated",
    es: "Configuración de notificaciones actualizada"
  },
  "financial-settings-updated": {
    en: "Financial settings updated",
    es: "Configuración financiera actualizada"
  },
  
  // Compensation related translations
  "compensate-customer": {
    en: "Compensate Customer",
    es: "Compensar Cliente"
  },
  "provide-compensation-description": {
    en: "Provide compensation to the customer related to this transaction.",
    es: "Proporcionar compensación al cliente relacionada con esta transacción."
  },
  "compensation-type": {
    en: "Compensation Type",
    es: "Tipo de Compensación"
  },
  "credit": {
    en: "Credit",
    es: "Abono"
  },
  "adjustment": {
    en: "Adjustment",
    es: "Ajuste"
  },
  "credit-description": {
    en: "Credit only allows positive amounts that increase the customer's balance.",
    es: "El abono solo permite montos positivos que aumentan el saldo del cliente."
  },
  "adjustment-description": {
    en: "Adjustment allows both positive and negative amounts for balance corrections.",
    es: "El ajuste permite montos positivos y negativos para correcciones de saldo."
  },
  "compensation-amount": {
    en: "Compensation Amount",
    es: "Monto de Compensación"
  },
  "reason-for-compensation": {
    en: "Reason for Compensation",
    es: "Motivo de la Compensación"
  },
  "explain-compensation-reason": {
    en: "Explain why this compensation is being provided...",
    es: "Explique por qué se proporciona esta compensación..."
  },
  "create-new-compensation-transaction": {
    en: "This will create a new compensation transaction in the customer's wallet.",
    es: "Esto creará una nueva transacción de compensación en la billetera del cliente."
  },
  "process-compensation": {
    en: "Process Compensation",
    es: "Procesar Compensación"
  },
  "please-enter-valid-amount": {
    en: "Please enter a valid amount",
    es: "Por favor, ingrese un monto válido"
  },
  "credit-must-be-positive": {
    en: "Credit amount must be positive",
    es: "El monto del abono debe ser positivo"
  },
  "please-select-compensation-type": {
    en: "Please select a compensation type",
    es: "Por favor, seleccione un tipo de compensación"
  },
  "please-provide-reason": {
    en: "Please provide a reason for compensation",
    es: "Por favor, proporcione un motivo para la compensación"
  },
  
  // Reset password translations
  "reset-password": {
    en: "Reset Password",
    es: "Restablecer Contraseña"
  },
  "reset-password-for-user": {
    en: "Reset password for user",
    es: "Restablecer contraseña para usuario"
  },
  "reset-password-warning": {
    en: "This action will generate a new temporary password.",
    es: "Esta acción generará una nueva contraseña temporal."
  },
  "reason-for-reset": {
    en: "Reason for password reset",
    es: "Motivo para restablecer la contraseña"
  },
  "reason-required": {
    en: "Reason is required",
    es: "El motivo es obligatorio"
  },
  "reason-placeholder": {
    en: "Provide a reason for resetting this user's password",
    es: "Proporcione un motivo para restablecer la contraseña de este usuario"
  },
  "resetting": {
    en: "Resetting...",
    es: "Restableciendo..."
  },
  "password-reset-success": {
    en: "Password Reset Successful",
    es: "Restablecimiento de Contraseña Exitoso"
  },
  "password-reset-success-description": {
    en: "A temporary password has been generated.",
    es: "Se ha generado una contraseña temporal."
  },
  "password-reset-error": {
    en: "Password Reset Failed",
    es: "Error al Restablecer la Contraseña"
  },
  "password-reset-unknown-error": {
    en: "An unknown error occurred while resetting the password.",
    es: "Ocurrió un error desconocido al restablecer la contraseña."
  },
  "important": {
    en: "Important",
    es: "Importante"
  },
  "reset-password-audit-notice": {
    en: "This action will be logged in the audit trail.",
    es: "Esta acción se registrará en el historial de auditoría."
  },
  "password-reset-complete": {
    en: "Password Reset Complete",
    es: "Restablecimiento de Contraseña Completado"
  },
  "password-reset-complete-description": {
    en: "The user's password has been reset. Please share the temporary password with the user securely.",
    es: "La contraseña del usuario ha sido restablecida. Por favor, comparta la contraseña temporal con el usuario de forma segura."
  },
  "temporary-password": {
    en: "Temporary Password",
    es: "Contraseña Temporal"
  },
  "password-copied": {
    en: "Password Copied",
    es: "Contraseña Copiada"
  },
  "password-copied-description": {
    en: "Temporary password copied to clipboard.",
    es: "Contraseña temporal copiada al portapapeles."
  },
  "password-share-securely": {
    en: "Share this temporary password with the user through a secure channel. The user will be required to change this password on their first login.",
    es: "Comparta esta contraseña temporal con el usuario a través de un canal seguro. El usuario deberá cambiar esta contraseña en su primer inicio de sesión."
  },
  "close": {
    en: "Close",
    es: "Cerrar"
  }
};

// Get translation for a key
export const translate = (key: string, language: Language): string => {
  if (translations[key]) {
    return translations[key][language];
  }
  
  // Return the key itself if no translation is found
  console.warn(`Translation not found for key: ${key}`);
  return key;
};

// Function to be used in components
export const useTranslation = (language: Language) => {
  return (key: string): string => translate(key, language);
};

