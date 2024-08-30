import { useState, useEffect } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { setGlobalUserId } from '@/components/GlobalUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 10,
    height: 50,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  eyeIcon: {
    paddingHorizontal: 10,
    position: 'absolute',
    right: 5,
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
  },
});

export default function LoginScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const db = SQLite.openDatabaseSync('mahlzeit');

  useEffect(() => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL);
        INSERT OR IGNORE INTO user (id, name, password) VALUES (1, 'Admin', 'admin');
        INSERT OR IGNORE INTO user (name, password) VALUES ('Ivo', 'ivo');
      `);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }, []);

  const handleSignIn = () => {
    const query = `
      SELECT id FROM user WHERE name = ? AND password = ?
    `;

    try {
      const result: { id: number }[] = db.getAllSync(query, [name, password]);

      if (result.length > 0) {
        const userId = result[0].id;
        setGlobalUserId(userId.toString());
        router.push('./(tabs)');
      } else {
        Alert.alert('Fehler', 'Ungültiger Benutzername oder Passwort');
      }
    } catch (error) {
      console.error('Database query error:', error);
      Alert.alert('Fehler', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nutzername"
        value={name}
        onChangeText={setName}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
          testID="toggle-password-visibility" // Add testID here
        >
          <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Anmelden</Text>
      </Pressable>
    </View>
  );
}
