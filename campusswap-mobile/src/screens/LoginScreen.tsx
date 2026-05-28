import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 💡 İlerleyen adımda burayı NestJS /auth/login endpoint'ine bağlayacağız
    if (email && password) {
      Alert.alert('Giriş Başarılı', `Hoş geldin: ${email}`);
      navigation.navigate('Home'); // Giriş başarılıysa Ana Sayfaya yönlendir
    } else {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 CampusSwap</Text>
      <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta Adresi"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 36, fontWeight: '900', color: '#1B4332', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 32 },
  input: { height: 50, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, fontSize: 16 },
  button: { height: 50, backgroundColor: '#1B4332', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});