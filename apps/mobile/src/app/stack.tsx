import { ScrollView, StyleSheet, Text, View } from 'react-native';

const items = [
  'Expo SDK 55 + React Native 0.83',
  'Expo Router cho navigation va deep linking',
  'TanStack React Query cho server state',
  'Zustand cho local state',
  'expo-secure-store cho auth token',
  '@ve_xe_nhanh_ts/api-client dung chung voi web',
  '@ve_xe_nhanh_ts/shared-types de dong bo typing',
];

export default function StackScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mobile foundation</Text>
      <Text style={styles.description}>
        Day la bo khung de bat dau xay dung app dat ve, chua include feature nghiep vu nhung da san
        sang de them auth, tim chuyen va dat cho.
      </Text>

      <View style={styles.list}>
        {items.map((item) => (
          <View key={item} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    color: '#1f1b16',
    fontSize: 30,
    fontWeight: '800',
  },
  description: {
    color: '#5a4c41',
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: 12,
  },
  listItem: {
    alignItems: 'flex-start',
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcd',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  bullet: {
    color: '#1f7a5a',
    fontSize: 18,
    fontWeight: '700',
  },
  itemText: {
    color: '#2b241f',
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
