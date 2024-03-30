import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useLayoutEffect, useState} from 'react';
import {Button, Input, Text} from '@rneui/base';
import {StatusBar} from 'expo-status-bar';
// import { getAuth } from "firebase/auth";

import {auth} from '../../firebase';

import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';

const RegisterScreen = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  //   const auth = getAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back to Login',
    });
  });

  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const verticalOffset = statusBarHeight;

  const register = async () => {
    // auth
    //   .
    createUserWithEmailAndPassword(auth, email, password)
      .then(authUser => {
        // setIsSignedIn(True);
        // console.log("imageUrl:", imageUrl); // Add console.log statement here
        updateProfile(auth.currentUser, {
          displayName: firstName,
          photoURL:
            imageUrl ||
            'https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png',
        }).then(() => {
          console.log('Profile updated successfully');
          console.log('Updated displayName:', authUser.user.displayName);
          console.log('Updated photoURL:', authUser.user.photoURL);
        });
      })
      .catch(error => alert(error.message));
  };
  //   const register = async () => {
  //     try {
  //       const authUser = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       console.log("User created:", authUser);

  //       const finalImageUrl =
  //         imageUrl ||
  //         "https://cdn-icons-png.flaticon.com/512/149/149071.png?w=1480&t=st=1683111801~exp=1683112401~hmac=465523d016c900850c60b002c9be493014da80d941865d35cd27629fbfa342f1";

  //       console.log("Updating profile...");
  //       await authUser.user.updateProfile({
  //         displayName: firstName,
  //         photoURL: finalImageUrl,
  //       });
  //       console.log("Profile updated successfully");
  //       console.log("Updated displayName:", authUser.user.displayName);
  //       console.log("Updated photoURL:", authUser.user.photoURL);
  //     } catch (error) {
  //       alert(error.message);
  //     }
  //   };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={verticalOffset}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar style="light" />
          <Text h4 style={styles.h3}>
            Create a GPTsensei account
          </Text>
          <View style={styles.inputContainer}>
            <View style={styles.name}>
              <Input
                placeholder="First Name"
                autoFocus
                autoComplete="off"
                type="text"
                value={firstName}
                onChangeText={text => setFirstName(text)}
              />
              <Input
                placeholder="Last Name"
                type="text"
                autoComplete="off"
                value={lastName}
                onChangeText={text => setLastName(text)}
              />
            </View>
            <View>
              <Input
                placeholder="Email"
                type="email"
                autoComplete="off"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Input
                placeholder="Password"
                type="password"
                secureTextEntry
                autoComplete="off"
                keyboardType="default"
                value={password}
                onChangeText={text => setPassword(text)}
              />
              <Input
                placeholder="Profile Picture Url (optional)"
                type="text"
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
                onSubmitEditing={register}
              />
            </View>
            <Button
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              titleStyle={{fontWeight: 'bold'}}
              onPress={register}
              title="Register"
            />
          </View>
          <View style={{height: hp(9)}} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(2.5),
    backgroundColor: 'white',
  },
  h3: {
    marginBottom: hp(2),
  },
  name: {
    width: wp(45),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'black',
    borderWidth: wp(0.5),
    borderColor: 'white',
    borderRadius: wp(8),
  },
  buttonContainer: {
    width: wp(50),
    marginTop: Platform.OS === 'android' ? wp(2.5) : -10,
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: wp(20),
    paddingBottom: Platform.OS === 'android' ? 0 : 10,
  },
  inputContainer: {
    width: wp(75),
  },
});
