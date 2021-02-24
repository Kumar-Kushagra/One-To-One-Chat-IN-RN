import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, TextInput, Alert,Image} from 'react-native';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const RoomScreen = ({ route }) => {

    const roomName = route.params.thread;

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const oppositeUserId = route.params.item.email;
    const [messages, setMessages] = useState("");
    const [input, setInput] = useState("")

    const [uploading, setUploading] = useState(false);
    const [fileUri, setFileUri] = useState(null);

    const flatlistRef = useRef();

    // Storing
    async function handleSend(message, type) {
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
                type,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email,
                }
            })
        setInput("");
    }


    // Fetching
    useEffect(() => {
        const array1 = [currentUser.email,oppositeUserId]
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

    const launch = async () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                setFileUri(response.uri)
                uploadImage(source)
            }
        });
    }
    const uploadImage = async (data) => {
        const { uri } = data;
        const filename = uri.substring(uri.lastIndexOf('/') + 1)
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        try {
            await task;
            console.log("Uploading...")
        } catch (e) {
            console.error(e);
        }
        setUploading(false);
        Alert.alert(
            'Photo uploaded !!',
            'Your Photo Is Sent Successfully!'
        );
        const url = await storage()
            .ref(filename)
            .getDownloadURL();
        handleSend(url, 'image')
    };

    return (
        <View style={{ flex: 1, backgroundColor: "darkseagreen" }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={messages}
                    ref={flatlistRef}
                    keyExtractor={(item) => item._id}
                    onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
                    onLayout={() => flatlistRef.current.scrollToEnd()}
                    renderItem={(itemData) => {
                        console.log("itemData", itemData)
                        if (itemData.item.type === "text") {
                            return (
                                currentUser.email == itemData.item.user.email ?
                                    <View style={styles.rightView}>
                                        <Text style={styles.msgText}>{itemData.item.text}</Text>
                                        <Text style={{ alignSelf: 'flex-end', color: "white", fontSize: 12}}>{moment(itemData.item.createdAt).format('MMM D,h:mm a')} </Text>
                                    </View>
                                    :
                                    <View style={styles.leftView}>
                                        <Text style={styles.msgText}>{itemData.item.text}</Text>
                                        <Text style={{ alignSelf: 'flex-start', color: "white", fontSize: 12}}>{moment(itemData.item.createdAt).format('MMM Do,h:mm a')} </Text>
                                    </View>
                            )
                        }
                        else {
                            return (
                                currentUser.email == itemData.item.user.email ?
                                    <View style={styles.rightView}>
                                        <Image 
                                        style = {{width:200,height:200}}
                                            source={{
                                                uri: itemData.item.text,
                                            }}
                                        />
                                        <Text style={{fontWeight:"bold",alignSelf: 'flex-end', color: "white", fontSize: 15 }}>{moment(itemData.item.createdAt).format('MMM D,h:mm a')} </Text>
                                    </View>
                                    :
                                    <View style={styles.leftView}>
                                         <Image
                                        style = {{width:200,height:200}}
                                            source={{
                                                uri: itemData.item.text,
                                            }}
                                        />
                                        <Text style={{ fontWeight:"bold",alignSelf: 'flex-start', color: "white", fontSize:15}}>{moment(itemData.item.createdAt).format('MMM Do,h:mm a')} </Text>
                                    </View>
                            )
                        }
                    }
                    }
                />
            </View>
            <View style={styles.sendingContainer}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Type message....."
                    placeholderTextColor="black"
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={(text) => setInput(text)}
                    value={input}
                />
                <TouchableOpacity onPress={launch}>
                    <Ionicons name='image' size={30} style={styles.add} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (input.trim() === "") {
                        Alert.alert
                            ('ERROR!!',
                                'Please Enter Any Message');
                    }
                    else {
                        handleSend(input, "text");
                    }
                }} >
                    <Ionicons name='send' size={30} style={styles.send} />
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
    rightView: {
        backgroundColor: "darkgreen",
        padding:5,
        borderRadius: 10,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        right: 3,
        top: 3,
        margin: 2
    },
    leftView: {
        backgroundColor: "darkslategrey",
        padding:5,
        borderRadius: 10,
        alignSelf: "flex-start",
        alignItems: 'flex-start',
        left: 3,
        top: 3,
        margin: 2
    },
    msgText: {
        fontSize: 20,
        color: "white",
        fontWeight: "600"
    },
    inputStyle: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: "white",
        borderWidth: 2,
        width: "78%",
        right: 15,
        top: 5
    },
    send: {
        right: 6,
        color: "black",
        bottom: 3
    },
    add: {
        right: 10,
        bottom: 3
    }
});

export default RoomScreen;
