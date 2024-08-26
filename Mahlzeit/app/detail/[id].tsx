import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import Rezepte from '@/models/Rezepte';

const Details = () => {
  const { id } = useLocalSearchParams(); // Get the route parameter
  const [recipe, setRecipe] = useState<Rezepte | null>(null);
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
          setRecipe(result[0]);
          // Set the title in the header and customize back button
          navigation.setOptions({
            title: result[0].title,
            headerBackTitle: 'Back', // This sets the back button text
          });
        }
      }
    };

    fetchRecipe();
  }, [id]);

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
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.rezept}</Text>
        <Text style={styles.description}>{recipe.anweisungen}</Text>
        <Text style={styles.description}>Dauer: {recipe.dauer} hours</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  thumbnail: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default Details;
