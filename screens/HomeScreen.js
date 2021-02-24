import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import { AuthContext } from '../Navigation/AuthProvider';
import thread from "../Navigation/HomeStack";

const HomeScreen = ({navigation }) => {

  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const [threads, setThreads] = useState([]);


  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Threads')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);
        if (loading) {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  //Fetching Users
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
      <Text style={{fontSize: 20,alignSelf:'center',top: 5 }}> Welcome !! {user.email}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={(item) => {
          if (user.email != item.item.email)
            return (
              <TouchableOpacity onPress={() => { navigation.navigate('Room',{ item:item.item})}}>
                <View style={styles.names}>
                  <Image
                    style={{width:"20%",height:'90%',borderRadius:30}}
                    source={{
                      uri: "https://i.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68"
                    }}
                  />
                  <View style={{padding: 10, width: '100%', }}>
                    <Text style={{color: 'black', fontSize: 25 }}>{item.item.name}</Text>
                    <Text style={{fontSize: 15,color: 'grey' }}>{item.item.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, height: 1, backgroundColor:'black' }} />
      </View>
    
        <View style={{ height: "45%", width: "80%" }}>
          <Text style = {{fontWeight:"bold",fontSize:20,left:30,top:5}}>WELCOME TO GROUP CHAT!!!</Text>
          <FlatList
           
            data={threads}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                console.log(item.name),
                <TouchableOpacity onPress={()=> navigation.navigate('Group',{thread:item})}>
                  <View style={styles.names}>
                    <Image
                      style={{width: "20%",height:'100%',borderRadius:30,top:5}}
                      source={{
                        uri:"https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ"
                      }}
                    />
                    <View style={{ padding: 10,width:"100%"}}>
                      <Text style={{ color: 'black', fontSize: 25 }}>{item.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
            )
        }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  names: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "bold"
  },
});

export default HomeScreen;