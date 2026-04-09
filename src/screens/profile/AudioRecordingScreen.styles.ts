import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const LIGHT_RING = '#93C5FD';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  root: {
    flex: 1,
    alignItems: 'center',
  justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  lottieWrap: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: LIGHT_RING,
    borderRadius: 999,
  },
  ringOuter: { width: 210, height: 210, opacity: 0.35 },
  ringMid: { width: 180, height: 180, opacity: 0.55 },
  lottie: { width: 160, height: 160 },
  timer: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
  },
  busy: { marginVertical: 8 },
  actions: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micFab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  row3: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  actionItem: { alignItems: 'center' },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

});

