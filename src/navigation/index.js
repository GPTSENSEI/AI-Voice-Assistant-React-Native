import * as React from 'react';
import {View, Text} from 'react-native';
import {useState, useEffect} from 'react'; // Added useState and useEffect

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {auth} from '../../firebase';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import AddChat from '../components/AddChat';
import LoadingScreen from '../screens/LoadingScreen';
const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: {backgroundColor: '#3F4BFD'},
  headerTitleStyle: {color: 'white'},
  headerTintColor: 'white',
  headerShown: true,
};
function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user); // Set true if user exists, otherwise false
    });

    return () => unsubscribe();
  }, []);

  // Render a loading indicator while auth state is being confirmed
  if (isAuthenticated === null) {
    return <LoadingScreen />; // Replace with your actual loading component/screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        initialRouteName={'Login'}
        screenOptions={globalScreenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AddChat" component={AddChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigation;
