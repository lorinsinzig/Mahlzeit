import { useState } from 'react';
import { Button, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

import { globalUserId, setGlobalUserId } from '@/components/GlobalUser';

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
    height: 50,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default function LoginScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAndInsert = async () => {
    const db = SQLite.openDatabaseSync('mahlzeit', {});

    db.execSync(`INSERT INTO user(name, password) VALUES ('${name}', '${password}');`)

    const result: { id: number }[] = db.getAllSync(`SELECT last_insert_rowid() as id;`);

    const UserId = result[0].id;

    console.log('Inserted:', UserId, name, password);
    
    setGlobalUserId(UserId.toString());
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
        <Text style={styles.buttonText}>Anmelden</Text>
        </Pressable>
    </View>
  );
};