'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './sheet';
import { CSSProperties, ReactNode } from 'react';
import styles from './ActionDialog.module.css';

export interface ActionDialogButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

export interface ActionDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title - can be dynamic for multi-step dialogs */
  title?: string;
  /** Dialog description - can be dynamic for multi-step dialogs */
  description?: string;
  /** Dialog content */
  children: ReactNode;
  /** Size of the dialog */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  /** Whether to show the header */
  showHeader?: boolean;
  /** Header alignment */
  headerAlign?: 'left' | 'center';
  /** Background color */
  backgroundColor?: string;
  /** Background gradient */
  backgroundGradient?: string;
  /** Additional class for the modal container */
  className?: string;
  /** Additional class for the content area */
  contentClassName?: string;

  // Single-page mode props (when variant is 'single')
  /** Dialog variant - 'single' for simple forms, 'multi' for wizards */
  variant?: 'single' | 'multi';
  /** Primary action button (for single-page mode) */
  primaryAction?: ActionDialogButton;
  /** Secondary action button (for single-page mode) */
  secondaryAction?: ActionDialogButton;
  /** Custom footer content - overrides primaryAction and secondaryAction */
  footer?: ReactNode;
  /** Whether to show the footer (for single-page mode) */
  showFooter?: boolean;
  /** Additional class for the footer */
  footerClassName?: string;
}

const sizeMap = {
  sm: '28rem', // 448px
  md: '32rem', // 512px
  lg: '36rem', // 576px
  xl: '42rem', // 672px
  '2xl': '48rem', // 768px
  '3xl': '52rem', // 832px
  '4xl': '56rem', // 896px
};

/**
 * A unified dialog component for both single-page forms and multi-step wizards.
 *
 * @example Single-page form dialog
 * ```tsx
 * <ActionDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   variant="single"
 *   title="Add Availability"
 *   description="Set your unavailable time slots"
 *   primaryAction={{
 *     label: 'Save',
 *     onClick: handleSave,
 *     disabled: !isValid,
 *   }}
 *   secondaryAction={{
 *     label: 'Cancel',
 *     onClick: () => setIsOpen(false),
 *   }}
 * >
 *   <form>{...}</form>
 * </ActionDialog>
 * ```
 *
 * @example Multi-step wizard dialog
 * ```tsx
 * <ActionDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   variant="multi"
 *   title={getStepTitle()}
 *   description={getStepDescription()}
 *   showHeader={step !== 'success'}
 * >
 *   {step === 'amount' && <AmountStep />}
 *   {step === 'confirm' && <ConfirmStep />}
 *   {step === 'success' && <SuccessStep />}
 * </ActionDialog>
 * ```
 */
export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = '2xl',
  showHeader = true,
  headerAlign = 'left',
  backgroundColor = '#ffffff',
  backgroundGradient,
  className = '',
  contentClassName = '',
  variant = 'single',
  primaryAction,
  secondaryAction,
  footer,
  showFooter = true,
  footerClassName = '',
}: ActionDialogProps) {
  const isSinglePage = variant === 'single';
  const hasFooter =
    isSinglePage && showFooter && (footer || primaryAction || secondaryAction);

  const getButtonVariantClasses = (
    btnVariant: ActionDialogButton['variant']
  ) => {
    switch (btnVariant) {
      case 'destructive':
        return styles['action-dialog-btn-destructive'];
      case 'secondary':
        return styles['action-dialog-btn-secondary'];
      case 'primary':
      default:
        return styles['action-dialog-btn-primary'];
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal>
      <SheetContent
        side="bottom"
        className={`${styles['action-dialog']} ${className}`}
        onPointerDownOutside={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
        style={
          {
            '--modal-max-width': sizeMap[size],
            backgroundColor,
            backgroundImage: backgroundGradient || undefined,
          } as CSSProperties
        }
      >
        <div className={`${styles['dialog-content']} ${contentClassName}`}>
          {showHeader && (title || description) && (
            <SheetHeader
              className={`${styles['dialog-header']} ${headerAlign === 'center' ? styles['dialog-header-center'] : styles['dialog-header-left']}`}
            >
              {title && (
                <SheetTitle className={styles['dialog-title']}>
                  {title}
                </SheetTitle>
              )}
              {description && (
                <SheetDescription className={styles['dialog-description']}>
                  {description}
                </SheetDescription>
              )}
            </SheetHeader>
          )}

          {/* Content area - scrollable for single page, full control for multi */}
          {isSinglePage ? (
            <div className={styles['dialog-body']}>{children}</div>
          ) : (
            children
          )}

          {/* Footer with actions - only for single-page mode */}
          {hasFooter && (
            <div className={`${styles['dialog-footer']} ${footerClassName}`}>
              {footer ? (
                footer
              ) : (
                <>
                  {secondaryAction && (
                    <button
                      type="button"
                      onClick={secondaryAction.onClick}
                      disabled={
                        secondaryAction.disabled || secondaryAction.loading
                      }
                      className={`${styles['action-dialog-btn']} ${getButtonVariantClasses(secondaryAction.variant || 'secondary')} ${secondaryAction.className || ''}`}
                    >
                      {secondaryAction.loading
                        ? secondaryAction.loadingText || 'Loading...'
                        : secondaryAction.label}
                    </button>
                  )}
                  {primaryAction && (
                    <button
                      type="button"
                      onClick={primaryAction.onClick}
                      disabled={primaryAction.disabled || primaryAction.loading}
                      className={`${styles['action-dialog-btn']} ${getButtonVariantClasses(primaryAction.variant || 'primary')} ${primaryAction.className || ''}`}
                    >
                      {primaryAction.loading
                        ? primaryAction.loadingText || 'Processing...'
                        : primaryAction.label}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
