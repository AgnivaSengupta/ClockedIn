import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';

export default function Splash() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Load fonts and wait at least 2 seconds before navigating
        await Promise.all([
          Font.loadAsync({
            'Quantico-Regular': require('../../assets/fonts/Quantico-Regular.ttf'),
            'Quantico-Bold': require('../../assets/fonts/Quantico-Bold.ttf'),
          }),
          new Promise(resolve => setTimeout(resolve, 2000)),
        ]);

        setFontsLoaded(true);
        router.replace('/onboarding/username');
      } catch (e) {
        console.warn('Failed to load fonts or navigate:', e);
      }
    }

    prepareApp();
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.splashText}>Welcome to Attendify 🚀</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashText: {
    fontSize: 24,
    fontFamily: 'Quantico-Bold', // Fixed font name
  },
});
