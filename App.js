import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>pit loaded</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
});
