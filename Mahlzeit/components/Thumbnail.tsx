import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Link } from 'expo-router';

import Rezepte from '@/models/Rezepte';
import User from '@/models/User';

const Thumbnail = ({ id }: { id: number }) => {
  const [rezept, setRezept] = useState<Rezepte | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const db = SQLite.openDatabaseSync('mahlzeit');

  useEffect(() => {
    // Fetch the recipe data
    const a: Rezepte[] = db.getAllSync(`
      SELECT * FROM rezepte WHERE id = ?;
    `, [id]);

    const rezept = a.length > 0 ? a[0] : null;
    setRezept(rezept);

    console.log('rezept:', rezept);

    // Fetch the user data only if rezept exists
    if (rezept && rezept.ersteller !== null) {
      const userResult: User[] = db.getAllSync(`
        SELECT * FROM user WHERE id = ?;
      `, [rezept.ersteller]);

      const user = userResult.length > 0 ? userResult[0] : null;
      setUser(user);
    }
  }, [id]);

  if (!rezept) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Link
      href={{
        pathname: '/detail/[id]',
        params: { id: id.toString() }
      }}
      asChild
    >
      <Pressable style={styles.container}>
        <Image source={{ uri: rezept.imageUri }} style={styles.thumbnail} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{rezept.title}</Text>
          <Text style={styles.description}>{rezept.rezept}</Text>
          <Text style={styles.description}>{rezept.anweisungen}</Text>
          <Text style={styles.description}>Dauer: {rezept.dauer} hours</Text>
          <Text style={styles.description}>Ersteller: {user ? user.name : 'Unknown'}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    padding: 10,
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10, // Space between image and text
  },
  textContainer: {
    flex: 1, // Take up the remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default Thumbnail;
