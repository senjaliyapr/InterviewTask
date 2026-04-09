import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  hero: {
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  heroImage: {
    width: '100%',
    height: 260,
    maxWidth: 340,
  },
  form: {
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  fieldShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
  },
  iconLeading: {
    marginRight: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  fieldInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

