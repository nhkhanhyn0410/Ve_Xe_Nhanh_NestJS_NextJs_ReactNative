import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/auth-store';

export default function HomeScreen() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Expo Mobile Workspace</Text>
          <Text style={styles.title}>Ve Xe Nhanh Mobile</Text>
          <Text style={styles.description}>
            Nền tảng mobile đã được dựng với Expo Router, React Query, Zustand và api-client dùng
            chung cho web/mobile.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trạng thái hiện tại</Text>
          <Text style={styles.cardText}>
            Auth storage: {session.accessToken ? 'ready' : 'not signed in'}
          </Text>
          <Text style={styles.cardText}>App version: {appVersion}</Text>
        </View>

        <Pressable style={styles.button} onPress={() => router.push('/stack')}>
          <Text style={styles.buttonText}>Xem stack da setup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f4ed',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  hero: {
    gap: 16,
    marginTop: 24,
  },
  eyebrow: {
    color: '#8c5e34',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1f1b16',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  description: {
    color: '#5a4c41',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcd',
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  cardTitle: {
    color: '#1f1b16',
    fontSize: 20,
    fontWeight: '700',
  },
  cardText: {
    color: '#5a4c41',
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1f7a5a',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
