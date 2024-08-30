  import React, { useEffect, useState } from 'react';
  import { View, TextInput, Text, StyleSheet, Image, ScrollView, Button, Alert, Pressable } from 'react-native';
  import { useLocalSearchParams, router } from 'expo-router';
  import * as SQLite from 'expo-sqlite';
  import { useNavigation } from '@react-navigation/native';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import Rezepte from '@/models/Rezepte';
  import { globalUserId } from '@/components/GlobalUser';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff'
    },
    thumbnail: {
      width: '100%',
      height: 250,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15
    },
    content: {
      padding: 10
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10
    },
    description: {
      fontSize: 16,
      color: '#666',
      marginBottom: 10
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      padding: 10,
      backgroundColor: 'orange',
      borderRadius: 5,
    },
    saveText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold'
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      padding: 10,
      backgroundColor: 'orange',
      borderRadius: 5,
    },
    deleteIcon: {
      fontSize: 24,
      color: '#fff',
      marginRight: 10
    },
    deleteText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold'
    },
  });

  const Details = () => {
    const { id } = useLocalSearchParams(); // Get the route parameter
    const [recipe, setRecipe] = useState<Rezepte | null>(null);
    const [title, setTitle] = useState('');
    const [rezept, setRezept] = useState('');
    const [anweisungen, setAnweisungen] = useState('');
    const [dauer, setDauer] = useState('');
    const [isOwner, setIsOwner] = useState(false); // Track if the user is the owner
    const navigation = useNavigation(); // To customize the header

    useEffect(() => {
      const fetchRecipe = () => {
        if (id && !isNaN(Number(id))) {
          const db = SQLite.openDatabaseSync('mahlzeit');
          const numericId = Number(id); // Convert id to a number

          const result: Rezepte[] = db.getAllSync(`
            SELECT * FROM rezepte WHERE id = ?;
          `, [numericId]);

          if (result.length > 0) {
            const recipeData = result[0];
            setRecipe(recipeData);
            setTitle(recipeData.title);
            setRezept(recipeData.rezept);
            setAnweisungen(recipeData.anweisungen);
            setDauer(recipeData.dauer.toString()); // Assuming dauer is a number

            // Check if the current user is the owner
            if (recipeData.ersteller === Number(globalUserId)) {
              setIsOwner(true);
            }

            // Set the title in the header and customize back button
            navigation.setOptions({
              title: recipeData.title,
              headerBackTitle: 'Back', // This sets the back button text
            });
          }
        }
      };

      fetchRecipe();
    }, [id]);

    const saveChanges = () => {
      if (recipe) {
        const db = SQLite.openDatabaseSync('mahlzeit');
        db.execSync(`UPDATE rezepte SET title = '${title}', rezept = '${rezept}', anweisungen = '${anweisungen}', dauer = ${Number(dauer)} WHERE id = ${recipe.id};`);
        Alert.alert('Erfolg', 'Das Rezept wurde aktualisiert.');
      }
      router.push('(tabs)');
    };

    const deleteRecipe = () => {
      if (recipe) {
        Alert.alert(
          'Löschen bestätigen',
          'Sind Sie sicher, dass Sie dieses Rezept löschen möchten?',
          [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: () => {
                const db = SQLite.openDatabaseSync('mahlzeit');
                db.execSync(`DELETE FROM rezepte WHERE id = ${recipe.id};`);
                Alert.alert('Erfolg', 'Das Rezept wurde gelöscht.');
                router.push('(tabs)');
              }
            },
          ]
        );
      }
    };

    if (!recipe) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {recipe.imageUri && (
          <Image
            source={{ uri: recipe.imageUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <TextInput
            style={styles.title}
            value={title}
            onChangeText={setTitle}
            editable={isOwner}
          />
          
          <Text style={styles.label}>Beschreibung:</Text>
          <TextInput
            style={styles.description}
            value={rezept}
            onChangeText={setRezept}
            editable={isOwner}
          />
          
          <Text style={styles.label}>Anweisungen:</Text>
          <TextInput
            style={styles.description}
            value={anweisungen}
            onChangeText={setAnweisungen}
            editable={isOwner}
          />

          <Text style={styles.label}>Duration:</Text>
          <TextInput
            style={styles.description}
            value={dauer}
            onChangeText={setDauer}
            keyboardType="numeric"
            editable={isOwner}
          />

          {isOwner && (
            <>
              <Pressable accessibilityLabel="Save Changes" style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveText}>Save Changes</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={deleteRecipe}>
                <Icon name="delete" style={styles.deleteIcon} />
                <Text style={styles.deleteText}>Rezept löschen</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  export default Details;
