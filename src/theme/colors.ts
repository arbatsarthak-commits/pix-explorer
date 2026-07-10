export type AppColors = {
  background: string; surface: string; primary: string; primaryDark: string;
  text: string; textSecondary: string; border: string; error: string;
  success: string; card: string; skeleton: string; overlay: string;
};

export const lightColors: AppColors = {
  background: '#F0F4F8', surface: '#FFFFFF', primary: '#2563EB', primaryDark: '#1D4ED8',
  text: '#0F172A', textSecondary: '#64748B', border: '#E2E8F0', error: '#DC2626',
  success: '#16A34A', card: '#FFFFFF', skeleton: '#E2E8F0', overlay: 'rgba(15,23,42,0.55)',
};

export const darkColors: AppColors = {
  background: '#0F172A', surface: '#1E293B', primary: '#3B82F6', primaryDark: '#2563EB',
  text: '#F8FAFC', textSecondary: '#94A3B8', border: '#334155', error: '#F87171',
  success: '#4ADE80', card: '#1E293B', skeleton: '#334155', overlay: 'rgba(0,0,0,0.65)',
};
