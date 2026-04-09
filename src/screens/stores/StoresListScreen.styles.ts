import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'visible',
  },
  imageWrap: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: 'hidden',
    height: 200,
  },
  image: { width: '100%', height: '100%' },
  viewStoreBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 55,
    paddingVertical: 15,
    borderRadius: 25,
  },
  viewStoreText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  name: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  cat: { fontSize: 14, color: COLORS.placeholder, marginTop: 4 },
});

