import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import { AuthContext } from '../Navigation/AuthProvider';

export default function HomeScreen({ navigation }) {

  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = firestore()
      .collection('Users')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setUsers(data);

        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, alignSelf: 'center' }}> Welcome !! {user.email}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={(item) => {
          if(user.email!=item.item.email)
          return (
            <TouchableOpacity onPress={() => { navigation.navigate('Room', { item: item.item }) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }}>
                <Image
                  style={{ width: 70, height: 70, borderRadius:50 }}
                  source={{
                    uri: "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y"
                  }}
                />
                <View style={{ padding: 10, width: '100%', }}>
                  <Text style={{ color: 'black', fontSize: 25 }}>{item.item.name}</Text>
                  <Text style={{ fontSize: 15, color: 'grey' }}>{item.item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    color: 'black'
  },
  listDescription: {
    fontSize: 16,
    color: 'black'
  },
});
