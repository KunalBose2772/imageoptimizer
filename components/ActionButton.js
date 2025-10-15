import React from 'react';
import { Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react';

const ActionButton = ({
  children,
  onClick,
  loading = false,
  success = false,
  error = false,
  disabled = false,
  variant = 'primary',
  size = 'default',
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-gray-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const getIcon = () => {
    if (loading) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }
    if (success) {
      return <CheckCircle className="w-5 h-5" />;
    }
    if (error) {
      return <AlertCircle className="w-5 h-5" />;
    }
    if (icon) {
      return icon;
    }
    return null;
  };

  const getTextColor = () => {
    if (success) return 'text-green-600';
    if (error) return 'text-red-600';
    return '';
  };

  const getVariantClasses = () => {
    if (success) return variants.success;
    if (error) return variants.danger;
    return variants[variant];
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${sizes[size]}
        ${className}
        ${loading ? 'cursor-wait' : ''}
        ${success ? 'transform scale-105' : ''}
        ${error ? 'animate-pulse' : ''}
        hover:transform hover:scale-105
      `}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {getIcon() && (
        <span className={children ? 'mr-2' : ''}>
          {getIcon()}
        </span>
      )}
      {children}
    </button>
  );
};

// Specialized button components
export const ConvertButton = ({ onClick, loading, disabled, fileType, outputFormat }) => (
  <ActionButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    variant="primary"
    size="lg"
    className="w-full sm:w-auto"
    icon={<Download className="w-5 h-5" />}
  >
    {loading ? 'Converting...' : `Convert to ${outputFormat || 'Output'}`}
  </ActionButton>
);

export const CompressButton = ({ onClick, loading, disabled, targetSize }) => (
  <ActionButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    variant="primary"
    size="lg"
    className="w-full sm:w-auto"
    icon={<Download className="w-5 h-5" />}
  >
    {loading ? 'Compressing...' : `Compress ${targetSize ? `to ${targetSize}` : 'File'}`}
  </ActionButton>
);

export const DownloadButton = ({ onClick, loading, disabled, filename }) => (
  <ActionButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    variant="success"
    size="lg"
    className="w-full sm:w-auto"
    icon={<Download className="w-5 h-5" />}
  >
    {loading ? 'Preparing...' : `Download ${filename || 'File'}`}
  </ActionButton>
);

export const ProcessButton = ({ onClick, loading, disabled, action = 'Process' }) => (
  <ActionButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    variant="primary"
    size="lg"
    className="w-full sm:w-auto"
  >
    {loading ? `${action}ing...` : action}
  </ActionButton>
);

export default ActionButton;
