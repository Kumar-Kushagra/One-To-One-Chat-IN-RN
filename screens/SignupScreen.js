import React, { useState, useContext } from 'react';
import { View, StyleSheet,SafeAreaView } from 'react-native';
import { Title } from 'react-native-paper';
import { AuthContext } from '../Navigation/AuthProvider';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore'

const SignupScreen = ({ navigation }) => {

  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hours = new Date().getHours();
  var min = new Date().getMinutes();

  var lastSeen = hours + ':' + min + ' hour';
  var currentDate = date + '/' + month + '/' + year;

  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  function addUser() {
    const unsubscribe = firestore()
      .collection('Users')
      .add({
        name: name,
        createdAt: currentDate,
        email: email,
        lastSeen:lastSeen,
      })
    return () => unsubscribe();
  }

  return (
    <SafeAreaView style = {{flex:1,backgroundColor:"lightslategrey"}}>
    <View style={styles.container}>
      <Title style={styles.titleText}>Register to chat</Title>
      <FormInput
        labelName='Name'
        value={name}
        autoCapitalize='none'
        onChangeText={nameData => setName(nameData)}
      />

      <FormInput
        labelName='Email'
        value={email}
        autoCapitalize='none'
        onChangeText={userEmail => setEmail(userEmail)}
      />
      <FormInput
        labelName='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={userPassword => setPassword(userPassword)}
      />
      <FormButton
        title='Signup'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={async () => {
          await register(email, password);
          addUser();

        }}
      />
      <FormButton
        title='Already Registered? Login here'
        modeValue='text'
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.goBack()}
      />
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'darkseagreen',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize:30,
    marginBottom:20,
    color:"blue"
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 18
  },
  navButton: {
    marginTop: 10
  }
});

export default SignupScreen;