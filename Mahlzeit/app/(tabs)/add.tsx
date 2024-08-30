import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { TextInput, View, StyleSheet, Pressable, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { globalUserId } from '@/components/GlobalUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 0,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    height: 50,
  },
  largeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    height: 100,
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageButton: {
    backgroundColor: 'gray',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: -10,
    marginLeft: -10,
    position: 'relative',
    overflow: 'hidden',
  },
  imageButtonImage: {
    width: '100%',
    height: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
  },
  icon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    color: '#fff',
    fontSize: 24,
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
  const [imageUri, setImageUri] = useState<string | null>('http://example.com/default-image.png'); // Default image URI
  
  const navigation = useNavigation();

  const handleCreate = () => {
    if (!title || !rezept || !anweisungen || !dauer) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    const db = SQLite.openDatabaseSync('mahlzeit');
    const ersteller = globalUserId ? globalUserId : '1';

    try {
      db.execSync(`
        INSERT INTO rezepte (title, rezept, anweisungen, dauer, ersteller, imageUri) 
        VALUES ('${title.replace(/'/g, "''")}', '${rezept.replace(/'/g, "''")}', 
        '${anweisungen.replace(/'/g, "''")}', '${dauer.replace(/'/g, "''")}', 
        '${ersteller.replace(/'/g, "''")}', '${imageUri.replace(/'/g, "''")}');
      `);

      setTitle('');
      setRezept('');
      setAnweisungen('');
      setDauer('');
      setImageUri(null);

      navigation.navigate('index');

    } catch (error) {
      console.error('Insert failed:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
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
      <Pressable onPress={pickImage} style={styles.imageButton}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imageButtonImage} />
        ) : (
          <>
            <Text style={styles.buttonText}>Take Photo</Text>
          </>
        )}
        <Icon name="camera-alt" style={styles.icon} />
      </Pressable>
      <TextInput
        style={styles.input}
        placeholder="Name des Gerichts"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.largeInput}
        placeholder="Beschreibung des Gerichts"
        value={rezept}
        onChangeText={setRezept}
        multiline
      />
      <TextInput
        style={styles.largeInput}
        placeholder="Anweisungen zum Zubereiten des Gerichts"
        value={anweisungen}
        onChangeText={setAnweisungen}
        multiline
      />
      <TextInput
        style={styles.input}
        value={dauer}
        placeholder='Dauer in Stunden'
        onChangeText={setDauer}
        keyboardType="numeric"
      />

      <Pressable onPress={handleCreate} style={styles.button}> 
        <Text style={styles.buttonText}>Erstellen</Text>
      </Pressable>
    </View>
  );
}
