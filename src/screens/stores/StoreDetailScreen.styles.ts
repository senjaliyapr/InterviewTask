import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';

const { width: W } = Dimensions.get('window');
const HEADER_H = 260;

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: {
    height: HEADER_H,
    width: W,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  heroTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
  },
  heroTopBarRow: {
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  heroTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  catRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  cat: { color: '#E5E7EB', fontSize: 14 },
  sheet: {
    marginTop: -28,
    backgroundColor: COLORS.background,
  
    padding: 20,
    minHeight: 400,
  },
  sectionLabel: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  addrRow: { flexDirection: 'row', marginTop: 10, alignItems: 'flex-start' },
  pinIcon: { marginRight: 8, marginTop: 2 },
  addr: { flex: 1, color: COLORS.placeholder, fontSize: 15, lineHeight: 22 },
  mapWrap: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
  },
  map: { flex: 1 },
});

