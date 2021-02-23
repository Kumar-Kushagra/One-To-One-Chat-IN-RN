import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import RoomScreen from '../screens/RoomScreen';
import { View } from 'react-native';
import { AuthContext } from './AuthProvider';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

function ChatApp() {
  const { logout } = useContext(AuthContext);
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor:"darkslategrey",
        },
        headerTintColor:"white",
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
    >
      <ChatAppStack.Screen
        name='Home'
        component={HomeScreen}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Entypo
                style={{ marginRight: 10, }}
                name='log-out'
                size={24}
                color='#ffffff'
                onPress={() => logout()}
              />
            </View>
          ),
        })}
      />
      <ChatAppStack.Screen name='Room'
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.item.name,
        })}
      />
    </ChatAppStack.Navigator>
  );
}

const HomeStack = () => {
  return (
    <ModalStack.Navigator mode='modal' headerMode='none'>
      <ModalStack.Screen name='ChatApp' component={ChatApp} />
      <ModalStack.Screen
        name="RoomChat"
        component={RoomScreen}
      />
    </ModalStack.Navigator>
  );
}
export default HomeStack;