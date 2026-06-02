import { create } from 'zustand';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'confirmation' | 'destructive';

interface FeedbackState {
  open: boolean;
  type: FeedbackType;
  title: string;
  message: string;
  buttonText?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showFeedback: (type: FeedbackType, title: string, message: string, buttonText?: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, options?: { confirmText?: string; cancelText?: string }) => void;
  showDelete: (title: string, message: string, onConfirm: () => void) => void;
  hideFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  open: false,
  type: 'success',
  title: '',
  message: '',
  buttonText: undefined,
  confirmText: undefined,
  cancelText: undefined,
  onConfirm: undefined,

  showFeedback: (type, title, message, buttonText) =>
    set({ open: true, type, title, message, buttonText, onConfirm: undefined }),

  showConfirm: (title, message, onConfirm, options) =>
    set({
      open: true,
      type: 'confirmation',
      title,
      message,
      confirmText: options?.confirmText ?? 'Confirmar',
      cancelText: options?.cancelText ?? 'Cancelar',
      onConfirm,
    }),

  showDelete: (title, message, onConfirm) =>
    set({
      open: true,
      type: 'destructive',
      title,
      message,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm,
    }),

  hideFeedback: () =>
    set({
      open: false,
      type: 'success',
      title: '',
      message: '',
      buttonText: undefined,
      confirmText: undefined,
      cancelText: undefined,
      onConfirm: undefined,
    }),
}));
