export const COLORS = {
  background: '#FFFFFF',
  primary: '#1E4E79',
  // Greys
  text: '#111827',
  textMuted: '#6B7280',
  textSecondary: '#374151',
  placeholder: '#9CA3AF',
  border: '#E5E7EB',
  cardBorder: '#E5E7EB',
  icon: '#B8BCC4',
  dotInactive: '#D1D5DB',
  // Charts / accents
  chartPalette: ['#22C55E', '#60A5FA', '#A78BFA', '#FB923C', '#EF4444', '#14B8A6', '#F472B6'] as const,
};

export type ColorKeys = keyof typeof COLORS;

