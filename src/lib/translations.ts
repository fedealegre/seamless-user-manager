export const translate = (key: string, language: string = 'en'): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      // Common
      'dashboard': 'Dashboard',
      'users': 'User Management',
      'wallets': 'Wallets',
      'transactions': 'Transactions',
      'management': 'Management',
      'security': 'Security',
      'anti-fraud': 'Anti-Fraud Rules',
      'audit-logs': 'Audit Logs',
      'backoffice-operators': 'Backoffice Operators',
      'settings': 'Settings',
      'company-settings': 'Company Settings',
      'user-field-settings': 'User Field Settings',
      'backoffice-settings': 'Backoffice Settings',
      'all-operations': 'All Operations',
      'user': 'User',
      'operation-type': 'Operation Type',
      'search-by-user': 'Search by user',
      'operation-types': 'Operation Types',
      'reset-filters': 'Reset Filters',
      'start-date': 'Start Date',
      'end-date': 'End Date',
      'cancel': 'Cancel',
      'close': 'Close',
      'save': 'Save',
      'edit': 'Edit',
      'delete': 'Delete',
      'save-changes': 'Save Changes',
      'submit': 'Submit',
      'success': 'Success',
      'error': 'Error',
      'important': 'Important',
      'user-must-have-one-role': 'User must have at least one role',
      
      // Roles
      'configurador': 'Configurator',
      'compensador': 'Compensator',
      'operador': 'Operator',
      'analista': 'Analyst',
      'backoffice-operators-management': 'Backoffice Operators Management',
      'add-new-operator': 'Add New Operator',
      'error-loading-operators': 'Error Loading Operators',
      'failed-load-backoffice-operators': 'Failed to load backoffice operators. Please try again.',
      'retry': 'Retry',
      'search-by-name-id-email-role': 'Search by name, ID, email, or role...',
      
      // Transaction status dialog
      'change-transaction-status': 'Change Transaction Status',
      'change-status-description': 'Update the status of this transaction',
      'new-status': 'New Status',
      'select-new-status': 'Select new status',
      'confirmed': 'Confirmed',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled',
      'reason-for-status-change': 'Reason for Status Change',
      'status-change-reason-placeholder': 'Enter reason for changing the status...',
      'update-status': 'Update Status',
      
      // Anti-fraud rules
      'anti-fraud-rules': 'Anti-Fraud Rules',
      'manage-transaction-limits-security': 'Manage transaction limits and security rules',
      'add-new-rule': 'Add New Rule',
      'add-new-anti-fraud-rule': 'Add New Anti-Fraud Rule',
      'create-new-rule': 'Create a new anti-fraud rule to limit transactions',
      'time-period': 'Time Period',
      'limit-amount': 'Limit Amount',
      'transaction-types': 'Transaction Types',
      'enter-transaction-type': 'Enter transaction type',
      'add': 'Add',
      'save-rule': 'Save Rule',
      'rule-id': 'Rule ID',
      'application-period': 'Application Period',
      'actions': 'Actions',
      'daily': 'Daily',
      'monthly': 'Monthly',
      'yearly': 'Yearly',
      'edit-anti-fraud-rule': 'Edit Anti-Fraud Rule',
      'modify-existing-rule': 'Modify existing anti-fraud rule',
      'update-rule': 'Update Rule',
      'rule-added-success': 'Rule added successfully',
      'rule-updated-success': 'Rule updated successfully',
      'rule-deleted-success': 'Rule deleted successfully',
      'failed-add-rule': 'Failed to add rule',
      'failed-update-rule': 'Failed to update rule',
      'failed-delete-rule': 'Failed to delete rule',
      'confirm-delete-rule': 'Are you sure you want to delete this rule?',
      'no-anti-fraud-rules-configured': 'No anti-fraud rules configured',
      'add-your-first-rule': 'Add your first rule',
      'rules-limit-transaction-amounts': 'Rules to limit transaction amounts by type and period',
      
      // Password reset
      'reset-password': 'Reset Password',
      'reset-password-for-user': 'Reset password for user',
      'reset-password-warning': 'This will generate a temporary password for the user. They will be required to change it on next login.',
      'reason-for-reset': 'Reason for Reset',
      'reason-placeholder': 'Enter the reason for resetting the password...',
      'reason-required': 'Reason is required',
      'resetting': 'Resetting...',
      'reset-password-audit-notice': 'This action will be logged in the audit trail with your details and the reason provided.',
      'password-reset-success': 'Password Reset Successful',
      'password-reset-success-description': 'A temporary password has been generated for the user.',
      'password-reset-error': 'Password Reset Error',
      'password-reset-unknown-error': 'An unknown error occurred',
      'password-reset-complete': 'Password Reset Complete',
      'password-reset-complete-description': 'Please share the temporary password with the user securely.',
      'temporary-password': 'Temporary Password',
      'password-copied': 'Password Copied',
      'password-copied-description': 'Password copied to clipboard',
      'password-share-securely': 'Share this password securely with the user. It will not be displayed again after you close this dialog.',
      
      // New translations for role-based permissions
      'only-compensator-can-cancel-transaction': 'Only users with the compensator role can cancel transactions',
      'only-compensator-can-change-status': 'Only users with the compensator role can change transaction status'
    },
    es: {
      // Common
      'dashboard': 'Panel de Control',
      'users': 'Gestión de Usuarios',
      'wallets': 'Billeteras',
      'transactions': 'Transacciones',
      'management': 'Gestión',
      'security': 'Seguridad',
      'anti-fraud': 'Reglas Anti-Fraude',
      'audit-logs': 'Registros de Auditoría',
      'backoffice-operators': 'Operadores de Backoffice',
      'settings': 'Configuración',
      'company-settings': 'Configuración de Compañía',
      'user-field-settings': 'Configuración de Campos de Usuario',
      'backoffice-settings': 'Configuración de Backoffice',
      'all-operations': 'Todas las Operaciones',
      'user': 'Usuario',
      'operation-type': 'Tipo de Operación',
      'search-by-user': 'Buscar por usuario',
      'operation-types': 'Tipos de Operación',
      'reset-filters': 'Restablecer Filtros',
      'start-date': 'Fecha de Inicio',
      'end-date': 'Fecha de Fin',
      'cancel': 'Cancelar',
      'close': 'Cerrar',
      'save': 'Guardar',
      'edit': 'Editar',
      'delete': 'Eliminar',
      'save-changes': 'Guardar Cambios',
      'submit': 'Enviar',
      'success': 'Éxito',
      'error': 'Error',
      'important': 'Importante',
      'user-must-have-one-role': 'El usuario debe tener al menos un rol',
      
      // Roles
      'configurador': 'Configurador',
      'compensador': 'Compensador',
      'operador': 'Operador',
      'analista': 'Analista',
      'backoffice-operators-management': 'Gestión de Operadores de Backoffice',
      'add-new-operator': 'Agregar Nuevo Operador',
      'error-loading-operators': 'Error al Cargar Operadores',
      'failed-load-backoffice-operators': 'Error al cargar operadores de backoffice. Intente nuevamente.',
      'retry': 'Reintentar',
      'search-by-name-id-email-role': 'Buscar por nombre, ID, email o rol...',
      
      // Transaction status dialog
      'change-transaction-status': 'Cambiar Estado de Transacción',
      'change-status-description': 'Actualizar el estado de esta transacción',
      'new-status': 'Nuevo Estado',
      'select-new-status': 'Seleccionar nuevo estado',
      'confirmed': 'Confirmada',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
      'cancelled': 'Cancelada',
      'reason-for-status-change': 'Razón del Cambio de Estado',
      'status-change-reason-placeholder': 'Ingrese la razón para cambiar el estado...',
      'update-status': 'Actualizar Estado',
      
      // Anti-fraud rules
      'anti-fraud-rules': 'Reglas Anti-Fraude',
      'manage-transaction-limits-security': 'Gestionar límites de transacciones y reglas de seguridad',
      'add-new-rule': 'Agregar Nueva Regla',
      'add-new-anti-fraud-rule': 'Agregar Nueva Regla Anti-Fraude',
      'create-new-rule': 'Crear una nueva regla anti-fraude para limitar transacciones',
      'time-period': 'Período de Tiempo',
      'limit-amount': 'Monto Límite',
      'transaction-types': 'Tipos de Transacción',
      'enter-transaction-type': 'Ingrese tipo de transacción',
      'add': 'Agregar',
      'save-rule': 'Guardar Regla',
      'rule-id': 'ID de Regla',
      'application-period': 'Período de Aplicación',
      'actions': 'Acciones',
      'daily': 'Diario',
      'monthly': 'Mensual',
      'yearly': 'Anual',
      'edit-anti-fraud-rule': 'Editar Regla Anti-Fraude',
      'modify-existing-rule': 'Modificar regla anti-fraude existente',
      'update-rule': 'Actualizar Regla',
      'rule-added-success': 'Regla agregada exitosamente',
      'rule-updated-success': 'Regla actualizada exitosamente',
      'rule-deleted-success': 'Regla eliminada exitosamente',
      'failed-add-rule': 'Error al agregar regla',
      'failed-update-rule': 'Error al actualizar regla',
      'failed-delete-rule': 'Error al eliminar regla',
      'confirm-delete-rule': '¿Está seguro de que desea eliminar esta regla?',
      'no-anti-fraud-rules-configured': 'No hay reglas anti-fraude configuradas',
      'add-your-first-rule': 'Agregar su primera regla',
      'rules-limit-transaction-amounts': 'Reglas para limitar montos de transacciones por tipo y período',
      
      // Password reset
      'reset-password': 'Restablecer Contraseña',
      'reset-password-for-user': 'Restablecer contraseña para el usuario',
      'reset-password-warning': 'Esto generará una contraseña temporal para el usuario. Se le requerirá cambiarla en el próximo inicio de sesión.',
      'reason-for-reset': 'Razón del Restablecimiento',
      'reason-placeholder': 'Ingrese la razón para restablecer la contraseña...',
      'reason-required': 'La razón es requerida',
      'resetting': 'Restableciendo...',
      'reset-password-audit-notice': 'Esta acción será registrada en la auditoría con sus detalles y la razón proporcionada.',
      'password-reset-success': 'Restablecimiento de Contraseña Exitoso',
      'password-reset-success-description': 'Se ha generado una contraseña temporal para el usuario.',
      'password-reset-error': 'Error de Restablecimiento de Contraseña',
      'password-reset-unknown-error': 'Ocurrió un error desconocido',
      'password-reset-complete': 'Restablecimiento de Contraseña Completado',
      'password-reset-complete-description': 'Por favor comparta la contraseña temporal con el usuario de manera segura.',
      'temporary-password': 'Contraseña Temporal',
      'password-copied': 'Contraseña Copiada',
      'password-copied-description': 'Contraseña copiada al portapapeles',
      'password-share-securely': 'Comparta esta contraseña de forma segura con el usuario. No se mostrará nuevamente después de cerrar este diálogo.',
      
      // New translations for role-based permissions
      'only-compensator-can-cancel-transaction': 'Solo los usuarios con rol de compensador pueden cancelar transacciones',
      'only-compensator-can-change-status': 'Solo los usuarios con rol de compensador pueden cambiar el estado de las transacciones'
    }
  };

  // If the key doesn't exist in the selected language, try to get it from English
  if (!translations[language][key] && language !== 'en') {
    return translations['en'][key] || key;
  }

  // Return the translated string or the key itself if no translation is found
  return translations[language][key] || key;
};

export default { translate };
