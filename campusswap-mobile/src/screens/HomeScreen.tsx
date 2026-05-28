import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>🎉 CampusSwap'e Hoş Geldin!</Text>
      <Text style={styles.infoText}>Kampüsteki en güncel ilanlar yakında burada listelenecek.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  welcomeText: { fontSize: 24, fontWeight: '800', color: '#1B4332', marginBottom: 12, textAlign: 'center' },
  infoText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 32 },
  logoutButton: { paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: '#DC2626', borderRadius: 8 },
  logoutButtonText: { color: '#DC2626', fontWeight: '600' },
});