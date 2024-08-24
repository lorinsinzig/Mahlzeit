import { useState } from 'react';
import { Button, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAndInsert = async () => {
    const db = SQLite.openDatabaseSync('mahlzeit', {});
    console.log(name)

    db.execSync(`INSERT INTO user(name, password) VALUES ('${name}', '${password}');`)
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
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

        <Pressable style={styles.button} onPress={handleCreateAndInsert} >
          <Text>Anmelden</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});