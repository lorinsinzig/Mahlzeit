import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, TextInput, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as SQLite from 'expo-sqlite';

import Thumbnail from '@/components/Thumbnail';

export default function Index() {

  const db = SQLite.openDatabaseSync('lmao')
        db.execSync(`
            CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS rezepte (id INTEGER PRIMARY KEY NOT NULL, title CHAR(300) NOT NULL,
            rezept CHAR(1000) NOT NULL, anweisungen CHAR(1000) NOT NULL, dauer INTEGER NOT NULL, ersteller_id INTEGER NOT NULL);
        `)

        console.log('New Test data inserted');

  const [data, setData] = useState<{ id: number; title: string }[]>([]);
  const [filteredData, setFilteredData] = useState<{ id: number; title: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getRecipes = () => {
    return db.getAllSync(`
      SELECT id, title FROM rezepte;
    `) as { id: number; title: string }[];
  };

  const arraysEqual = (a: number[], b: number[]) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  useEffect(() => {
    const rows: { id: number; title: string }[] = getRecipes();
    setData(rows);
    setFilteredData(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const rows: { id: number; title: string }[] = getRecipes();
      if (!arraysEqual(rows.map(r => r.id), data.map(r => r.id))) {
        setData(rows);
        setFilteredData(rows);
      }
    }, [data])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const newFilteredData = data.filter(item =>
      item.title.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredData(newFilteredData);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredData.map((item) => (
        <View key={item.id}>
          <Thumbnail id={item.id} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
