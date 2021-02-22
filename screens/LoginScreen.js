import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import { AuthContext } from '../Navigation/AuthProvider';
import Loading from "../components/Loading";

export default function Login({ navigation }) {

  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Welcome to Chat app!!</Title>
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
        title='Login'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={() => login(email, password)}
        
       
      />
      <FormButton
        title='New user? Join here'
        modeValue='text'
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 30,
    marginBottom:30,
    color: 'white'
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 16
  }
});