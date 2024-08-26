import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { TextInput, View, StyleSheet, Pressable, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { globalUserId } from '@/components/GlobalUser';

const theme = {
  primaryColor: '#007AFF',
  secondaryColor: '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    height: 50,
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default function AddScreen() {
  const [title, setTitle] = useState('');
  const [rezept, setRezept] = useState('');
  const [anweisungen, setAnweisungen] = useState('');
  const [dauer, setDauer] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCreateAndInsert = () => {
    const db = SQLite.openDatabaseSync('mahlzeit');

    const ersteller = globalUserId ? globalUserId : '1';

    db.execSync(`
      INSERT INTO rezepte (title, rezept, anweisungen, dauer, ersteller, imageUri) 
      VALUES ('${title.replace(/'/g, "''")}', '${rezept.replace(/'/g, "''")}', 
      '${anweisungen.replace(/'/g, "''")}', '${dauer.replace(/'/g, "''")}', 
      '${ersteller.replace(/'/g, "''")}', '${imageUri.replace(/'/g, "''")}');
    `);

    console.log('Inserted:', title, rezept, anweisungen, dauer, ersteller, imageUri);
  };

  const handleRead = () => {
    const db = SQLite.openDatabaseSync('mahlzeit');

    try {
      const rows = db.getAllSync(`
        SELECT * FROM rezepte;
      `);

      for (const row of rows) {
        console.log(row.id, row.title, row.rezept, row.anweisungen, row.dauer, row.ersteller, row.imageUri);
      }
    } catch (error) {
      console.error('Read failed:', error);
    }
  };

  const pickImage = async () => {
    // Request permission to access camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    // Open the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1], // Aspect ratio for cropping
      quality: 1,
    });

    if (!result.canceled) {
      // Crop the image to 1:1 ratio
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500 } }, { crop: { originX: 0, originY: 0, width: 500, height: 500 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      setImageUri(manipResult.uri);
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

      <Pressable onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </Pressable>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Pressable onPress={handleCreateAndInsert} style={styles.button}>
        <Text style={styles.buttonText}>CREATE</Text>
      </Pressable>
      <Pressable onPress={handleRead} style={styles.button}>
        <Text style={styles.buttonText}>READ</Text>
      </Pressable>
    </View>
  );
}
