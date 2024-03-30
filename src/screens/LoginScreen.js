import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {Button, Input, Image} from '@rneui/base';
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {auth} from '../../firebase';
import {onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import {CommonActions} from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    console.log('Running useEffect hook');
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      console.log('Auth state changed:');
      //   , authUser);
      if (authUser) {
        console.log('Navigating to Home');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [auth, navigation]);
  //   useEffect(() => {
  //     console.log("Running useEffect hook");
  //     const unsubscribe = onAuthStateChanged(auth, (authUser) => {
  //       console.log("Auth state changed:", authUser);
  //       if (authUser) {
  //         console.log("Navigating to Home");
  //         navigation.replace("Home");
  //       }
  //     });
  //     return () => {
  //       unsubscribe();
  //     };
  //   }, [auth, navigation]);

  //   auth, navigation
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch(error =>
      alert(error),
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar style="light" />
          <Image
            source={require('../../assets/images/gptlogo_noBackgroud.png')}
            style={styles.logo}
          />
          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              autoComplete="off"
              autoCapitalize="none"
              autoFocus
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              autoComplete="off"
              keyboardType="default"
              value={password}
              onChangeText={text => setPassword(text)}
              onSubmitEditing={signIn}
            />
          </View>
          <Button
            containerStyle={styles.button}
            onPress={signIn}
            title="Login"
          />
          <Button
            onPress={() => navigation.navigate('Register')}
            containerStyle={styles.button}
            type="outline"
            title="Register"
          />
          <View style={{height: hp(15)}} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  logo: {
    width: wp(20),
    height: hp(10),
    resizeMode: 'contain',
  },
  button: {
    width: wp(50),
    marginTop: hp(1),
    height: hp(7),
  },
  inputContainer: {
    width: wp(75),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 0 : hp(3),
  },
});
