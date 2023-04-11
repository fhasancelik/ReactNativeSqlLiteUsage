import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, Alert, List, Avatar,FAB,Menu,Divider, Provider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core';
import * as SQLite from 'expo-sqlite';







export default function AddContact() {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);
  const [currentSurname, setCurrentSurname] = useState(undefined);
  const [currentNumber, setCurrentNumber] = useState(undefined);





  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT , number INTEGER)')
    });


    db.transaction(tx => {
      tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    setIsLoading(false)

  }, [])


  if (isLoading) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading names...</Text>
        </View>
      </SafeAreaView>

    )
  }

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO names (name) values (?) ', [currentName],
        (txObj, resultSet) => {
          let existingNames = [...names];
          existingNames.push({ id: resultSet.insertId, name: currentName });
          setNames(existingNames);
          setCurrentName(undefined);
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  const deleteName = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM names WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter(name => name.id !== id);
            setNames(existingNames);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };
  const updateName = (id) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE names SET name = ? WHERE id = ?', [currentName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(name => name.id === id);
            existingNames[indexToUpdate].name = currentName;
            setNames(existingNames);
            setCurrentName(undefined);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

function Mymenu(props){
  return(
    <View style={{flexDirection:"row"}}>
          <FAB
              icon="delete"
              style={styles.fab}
              onPress={() => deleteName(props.nameid)}
            />
                <FAB
              icon="update"
              style={styles.fab}
              onPress={() => updateName(props.nameid)}
            />
    </View>
  )
}

  const showNames = () => {
    return names.map((name, index) => {
      return (


      
         <View key={index}>

<List.Item
  title={name.name}
  description="Item description"
  left={() => (
    <Avatar.Text
      label="XD"
      size={56}
    />
  )}
  right={() => (

 <Mymenu nameid={name.id}/>
  )}




/>
</View>
      





      );
    });
  };


  return (
  
     <SafeAreaView>
      <View style={{ margin: 16 }}>
        <TextInput label="Name" value={currentName} onChangeText={setCurrentName} />
        <TextInput label="Surname" value={currentSurname} onChangeText={setCurrentSurname} />
        <TextInput label="Number" value={currentNumber} onChangeText={setCurrentNumber} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
          <Button mode="contained" onPress={addName}>Add Name</Button>
  
        </View>
      
        {showNames()}
      </View>
    </SafeAreaView>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  },
  fab: {
    alignItems:"center",
    justifyContent:"center",
  width:40,
  height:40,
  marginLeft:6
  },
});

