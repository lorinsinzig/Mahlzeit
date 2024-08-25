import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { TextInput, View, StyleSheet, Pressable, Text } from 'react-native';

import { globalUserId } from '@/components/GlobalUser';

const theme = {
  primaryColor: '#007AFF',
  secondaryColor: '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: theme.secondaryColor,
  },
  button: {
    backgroundColor: theme.primaryColor,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function SettingsScreen() {
  const [title, setTitle] = useState('');
  const [rezept, setRezept] = useState('');
  const [anweisungen, setAnweisungen] = useState('');
  const [dauer, setDauer] = useState('');

  const handleCreateAndInsert = () => {
    const db = SQLite.openDatabaseSync('mahlzeit');

    const ersteller = globalUserId ? globalUserId : '1';

    db.execSync(`
      INSERT INTO rezepte (title, rezept, anweisungen, dauer, ersteller) 
      VALUES ('${title.replace(/'/g, "''")}', '${rezept.replace(/'/g, "''")}', 
      '${anweisungen.replace(/'/g, "''")}', '${dauer.replace(/'/g, "''")}', 
      '${ersteller.replace(/'/g, "''")}');
    `);

    console.log('Inserted:', title, rezept, anweisungen, dauer, ersteller);
  };

  const handleRead = () => {
    const db = SQLite.openDatabaseSync('mahlzeit');

    try {
      const rows: any[] = db.getAllSync(`
        SELECT * FROM rezepte;
      `);

      for (const row of rows) {
        console.log(row.id, row.title, row.rezept, row.anweisungen, row.dauer, row.ersteller);
      }
    } catch (error) {
      console.error('Read failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name des Gerichts"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="1 Stunde"
        value={dauer}
        onChangeText={setDauer}
      />
      <TextInput
        style={styles.input}
        placeholder="Beschreibung des Gerichts"
        value={rezept}
        onChangeText={setRezept}
      />
      <TextInput
        style={styles.input}
        placeholder="Anweisungen zum Zubereiten des Gerichts"
        value={anweisungen}
        onChangeText={setAnweisungen}
      />
      <Pressable onPress={handleCreateAndInsert} style={styles.button}>
        <Text style={styles.buttonText}>CREATE</Text>
      </Pressable>
      <Pressable onPress={handleRead} style={styles.button}>
        <Text style={styles.buttonText}>READ</Text>
      </Pressable>
    </View>
  );
}
