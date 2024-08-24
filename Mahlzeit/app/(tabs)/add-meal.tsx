
import { Button, View } from "react-native";
import * as SQLite from 'expo-sqlite';
export default function SettingsScreen() {

    //USER
    const handleUserCreateAndInsert = () => {
        const db = SQLite.openDatabaseSync('lmao')
        db.execSync(`
            INSERT INTO user (name, password) VALUES ('test', 'test');  
        `)

        console.log('New Test data inserted');
    };
    const handleUserRead = () => {
        const db = SQLite.openDatabaseSync('lmao')
        const a: any[] = db.getAllSync(`
            SELECT * FROM user; 
        `)
        for (const row of a) {
            console.log(row.id, row.name, row.password);
          }        
    };

    const handleUserDelete = () => {
        const db = SQLite.openDatabaseSync('lmao')
        db.execSync(`
            DELETE FROM user; 
        `)
    };
    
    //RECIPE
    const handleRecipeCreateAndInsert = () => {
      const db = SQLite.openDatabaseSync('lmao')
      db.execSync(`
          INSERT INTO rezepte (title, rezept, anweisungen, dauer, ersteller_id) VALUES ('Rezept1', "Beschreibung1", "Anweisungen1", 1, 1);  
      `)

      console.log('New Test Recipe inserted');
  };
  const handleRecipeRead = () => {
      const db = SQLite.openDatabaseSync('lmao')
      const a: any[] = db.getAllSync(`
          SELECT * FROM rezepte; 
      `)
      for (const row of a) {
          console.log(row.id, row.title, row.rezept, row.anweisungen, row.dauer, row.ersteller_id);
        }        
  };

  const handleRecipeDelete = () => {
      const db = SQLite.openDatabaseSync('lmao')
      db.execSync(`
          DELETE FROM rezepte; 
      `)
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="CREATE USER" onPress={handleUserCreateAndInsert} />
          <Button title="READ USER" onPress={handleUserRead} />
          <Button title="DELETE USER" onPress={handleUserDelete} />

          <Button title="CREATE RECIPE" onPress={handleRecipeCreateAndInsert} />
          <Button title="READ RECIPE" onPress={handleRecipeRead} />
          <Button title="DELETE RECIPE" onPress={handleRecipeDelete} />
      </View>
    );
}
 