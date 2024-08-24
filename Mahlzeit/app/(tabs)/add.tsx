import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Button, TextInput, View, StyleSheet, Pressable, Text } from 'react-native';

// Define your theme (colors, fonts, etc.) here
const theme = {
  primaryColor: '#007AFF',
  secondaryColor: '#333',
  // Add other theme properties...
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Set your background color
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
  const [title, settitle] = useState('');
  const [rezept, setrezept] = useState('');
  const [anweisungen, setanweisungen] = useState('');
  const [dauer, setdauer] = useState('');
  const [ersteller, setErsteller] = useState('');
  

  const handleCreateAndInsert = async () => {
    const db = SQLite.openDatabaseSync('mahlzeit', {});

    db.execSync(`
      INSERT INTO rezepte (title, rezept, anweisungen, dauer, ersteller) VALUES ('${title}', '${rezept}, '${anweisungen}, '${dauer}, '${ersteller}');;  
    `)
    console.log(title, rezept, anweisungen, dauer, ersteller)
  };

  const handleRead = () => {
    const db = SQLite.openDatabaseSync('mahlzeit')

    const a: any[] = db.getAllSync(`
        SELECT * FROM rezepte;`
    )

    for (const row of a) {
        console.log(row.id, row.title, row.rezept, row.anweisungen, row.dauer, row.eresteller);
      }        
};

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name des Gerichts"
        value={title}
        onChangeText={settitle}
      />
      <TextInput
        style={styles.input}
        placeholder="1 Stunde"
        value={dauer}
        onChangeText={setdauer}
      />
      <TextInput
        style={styles.input}
        placeholder="Beschreibung des Gerichts"
        value={rezept}
        onChangeText={setrezept}
      />
      <TextInput
        style={styles.input}
        placeholder="Anweisungen zum Zubereiten des Gerichts"
        value={anweisungen}
        onChangeText={setanweisungen}
      />
      <TextInput
        style={styles.input}
        placeholder="Ersteller"
        value={ersteller}
        onChangeText={setErsteller}
      />
      <Pressable onPress={handleCreateAndInsert} style={styles.button}> 
        <Text>CREATE</Text>
      </Pressable>
      <Pressable onPress={handleRead} style={styles.button}> 
        <Text>READ</Text>
      </Pressable>
    </View>
  );
}
