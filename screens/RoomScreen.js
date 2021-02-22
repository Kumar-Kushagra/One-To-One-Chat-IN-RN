import React, { useState, useContext, useEffect, } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RoomScreen({ route }) {

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const oppositeUserId = route.params.item.email;
    const [messages, setMessages] = useState("");
    const [input, setInput] = useState("")

    // Storing
    async function handleSend(message) {
        const text = message
        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        var newId = array1[0] + array1[1];

        await firestore()
            .collection('Chats')
            .doc(newId)
            .collection('Chat')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email,
                }
            })

    }
    // Fetching
    useEffect(() => {
        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        var newId = array1[0] + array1[1];
        const messagesListener = firestore()
            .collection('Chats')
            .doc(newId)
            .collection('Chat')
            .orderBy('createdAt', 'asc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data();
                    const data = {
                        _id: doc.id,
                        ...firebaseData
                    };
                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.email
                        };
                    }
                    return data;
                });

                setMessages(messages);
            });

        return () => messagesListener();
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: "darkseagreen" }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={(itemData) => {
                        return (
                            currentUser.email == itemData.item.user.email ?
                                <View style={styles.rightView}>
                                    <Text style={styles.msgText}>{itemData.item.text}</Text>
                                </View>
                                :
                                <View style={styles.leftView}>
                                    <Text style={styles.msgText}>{itemData.item.text}</Text>
                                </View>
                           
                        )
                    }}
                />

            </View>
            <View style={styles.sendingContainer}>
                <TextInput
                    style={{ padding: 10, borderRadius: 20, backgroundColor: "white", borderWidth: 2, width: "90%", right: 4 }}
                    placeholder="Type message....."
                    placeholderTextColor="black"
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={(text) => setInput(text)}
                />
                <TouchableOpacity onPress={() => {
                    handleSend(input);
                }} >
                    <Ionicons name='send' size={32} color="black" style={{ bottom: 3, right: 2 }} />
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    sendingContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    systemMessageText: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    rightView:{
        backgroundColor: "darkgreen", 
        padding: 5, 
        borderRadius: 10, 
        alignSelf: 'flex-end', 
        alignItems: 'center', 
        justifyContent: 'center', 
        right: 3, 
        top: 3, 
        margin: 2
    },
    leftView:{
        backgroundColor: 'purple', 
        padding: 5, 
        borderRadius: 10, 
        alignSelf: "flex-start", 
        alignItems: 'center', 
        justifyContent: 'center', 
        left: 3, 
        top: 3, 
        margin: 2
    },
    msgText:{
        fontSize:20,
        color:"white",
        fontWeight:"600"
    }
});
