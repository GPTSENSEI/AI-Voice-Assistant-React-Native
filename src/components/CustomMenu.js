import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {Entypo, Ionicons} from 'react-native-vector-icons/Ionicons';
import {signOut} from 'firebase/auth';
import {auth} from '../../firebase';

const CustomMenu = ({navigation}) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}>
        <MenuItem onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </MenuItem>
        <MenuDivider />
        {/* Add other menu items here */}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  signOutText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default CustomMenu;
