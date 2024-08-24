import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Import useSearchParams
import * as SQLite from 'expo-sqlite';
import Rezepte from '@/models/Rezepte';

const Details = () => {
  const { id } = useLocalSearchParams(); // Get the route parameter
  const [recipe, setRecipe] = useState<Rezepte | null>(null);

  useEffect(() => {
    const fetchRecipe = () => {
      if (id && !isNaN(Number(id))) {
        const db = SQLite.openDatabaseSync('lmao');
        const numericId = Number(id); // Convert id to a number

        const result: Rezepte[] = db.getAllSync(`
          SELECT * FROM rezepte WHERE id = ?;
        `, [numericId]);

        if (result.length > 0) {
          setRecipe(result[0]);
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
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.rezept}</Text>
      <Text style={styles.description}>{recipe.anweisungen}</Text>
      <Text style={styles.description}>Dauer: {recipe.dauer} hours</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});

export default Details;
