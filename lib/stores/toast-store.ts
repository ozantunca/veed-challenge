import { create } from "zustand";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastState = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id =
      t.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`);
    set({ toasts: [...get().toasts, { ...t, id }] });
    setTimeout(() => {
      get().dismiss(id);
    }, 4000);
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
}));
