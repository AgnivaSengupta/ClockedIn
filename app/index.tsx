import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Defer navigation till next tick to ensure layout is mounted
    const timeout = setTimeout(() => {
      router.replace('/splash');
    }, 50); // even 0ms works in some cases

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
