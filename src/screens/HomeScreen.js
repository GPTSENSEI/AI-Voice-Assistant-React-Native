import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Input} from '@rneui/base';

import Voice from '@react-native-community/voice';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {apiCall, chatvisionApiCall} from '../api/openAI';
import Features from '../components/features';
import Tts from 'react-native-tts';
import {launchImageLibrary} from 'react-native-image-picker'; // Importing Image Picker
import {OPEN_API_KEY} from '@env';

console.log(OPEN_API_KEY); // Outputs: https://example.com

const App = () => {
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const scrollViewRef = useRef();
  const [textInputValue, setTextInputValue] = useState(''); // State for text input
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [textResult, setTextResult] = useState(''); // State for text input

  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    console.log('speech error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      // await Voice.start('en-GB'); // en-US
      await Voice.start('ja-JP'); // en-US
    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('error', error);
    }
  };
  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          startTextToSpeach(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const startTextToSpeach = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      // playing response with the voice id and voice speed
      Tts.speak(message.content, {
        // iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        iosVoiceId: 'com.apple.voice.compact.ja-JP.Kyoko',
        rate: 0.52,
      });
    }
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  useEffect(() => {
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;
    // Tts.voices().then(voices => console.log(voices));

    // text to speech events
    // Tts.setDefaultLanguage('en-IE');
    Tts.setDefaultLanguage('ja');

    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  useEffect(() => {
    if (result.trim().length > 0) {
      fetchResponse(); // Call fetchResponse when result changes
    }
    // Add result as a dependency to this effect. This effect will run when result changes.
  }, [textResult]);
  // Function to handle image selection
  const sendImage = (base64Image, dataType) => {
    console.log('inside send image function');
    if (selectedImageUri) {
      let newMessages = [...messages];
      // scroll to the bottom of the view
      setLoading(true);
      updateScrollView();
      newMessages.push({role: 'user', content: selectedImageUri});
      setMessages([...newMessages]);
      console.log('the image uri is ', selectedImageUri);
      chatvisionApiCall(base64Image, dataType, newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          // now play the response to user
        } else {
          Alert.alert('Error', res.msg);
        }
      });
      // Implement your logic to use the image URI
      console.log('Sending image:', selectedImageUri);
      // For example, upload it to a server, or pass it to another component
    }
  };
  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: true}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = {uri: response.assets[0].uri};
        // console.log('the source is ', source);
        // Assuming single image selection
        const asset = response.assets[0];
        const localImageUri = asset.uri; // This is the local URI
        const base64Image = asset.base64; // This is the base64 string
        const imageType = asset.type || 'image/jpeg';
        console.log('Local image URI:', localImageUri);
        // console.log('Base64 image string:', base64Image);
        console.log('imageType', imageType);
        setSelectedImageUri(localImageUri);
        sendImage(base64Image, imageType); // Store the image URI
      }
    });
  };
  const handleSendText = () => {
    if (textInputValue.trim().length > 0) {
      // Process the text input in the same way as the voice input
      console.log('text input value', textInputValue.trim());
      text_value = textInputValue.trim();
      setResult(text_value);
      console.log('the resul is ', result);
      setTextResult(text_value);
      // fetchResponse();
      setTextInputValue(''); // Clear the input field
    }
  };
  const containsImageFile = content => {
    const imageExtensions = ['.jpeg', '.jpg', '.png']; // You can add more extensions if needed
    return imageExtensions.some(extension => content.includes(extension));
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust as needed
      className="flex-1 bg-white">
      {/* <StatusBar barStyle="dark-content" /> */}
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        {/* <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/bot.png')}
            style={{height: hp(15), width: hp(15)}}
          />
        </View> */}

        {/* features || message history */}
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            {/* <Text
              className="text-gray-700 font-semibold ml-1"
              style={{fontSize: wp(5)}}>
              Assistant
            </Text> */}

            <View
              style={{height: hp(65)}}
              className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role == 'assistant') {
                    if (containsImageFile(message.content)) {
                      // result is an ai image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                            <Image
                              source={{uri: message.content}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // chat gpt response
                      return (
                        <View
                          key={index}
                          style={{width: wp(70)}}
                          className="bg-emerald-100 p-2 rounded-xl rounded-tl-none">
                          <Text
                            className="text-neutral-800"
                            style={{fontSize: wp(4)}}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    if (containsImageFile(message.content)) {
                      // result is an ai image
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View className="p-2 flex rounded-2xl bg-white rounded-tl-none">
                            <Image
                              source={{uri: message.content}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // user input text
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View
                            style={{width: wp(70)}}
                            className="bg-white p-2 rounded-xl rounded-tr-none">
                            <Text style={{fontSize: wp(4)}}>
                              {message.content}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}
      </SafeAreaView>

      {/* recording, clear and stop buttons */}
      <View className="flex justify-center items-center">
        {loading ? (
          <Image
            source={require('../../assets/images/loading.gif')}
            style={{width: hp(10), height: hp(10)}}
          />
        ) : recording ? (
          <TouchableOpacity className="space-y-2" onPress={stopRecording}>
            {/* recording stop button */}
            <Image
              className="rounded-full"
              source={require('../../assets/images/voiceLoading.gif')}
              style={{width: hp(10), height: hp(10)}}
            />
          </TouchableOpacity>
        ) : (
          <View className="flex-row justify-center items-center">
            <TouchableOpacity onPress={selectImage}>
              <Image
                className="rounded-full"
                source={require('../../assets/images/image_button.png')}
                style={{width: hp(8), height: hp(8), marginRight: 10}} // Adjust marginRight as needed
              />
            </TouchableOpacity>

            {/* Mic Button */}
            <TouchableOpacity onPress={startRecording}>
              <Image
                className="rounded-full"
                source={require('../../assets/images/recordingIcon.png')}
                style={{width: hp(10), height: hp(10)}}
              />
            </TouchableOpacity>
          </View>
        )}
        {messages.length > 0 && (
          <TouchableOpacity
            onPress={clear}
            className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
            <Text className="text-white font-semibold">Clear</Text>
          </TouchableOpacity>
        )}
        {speaking && (
          <TouchableOpacity
            onPress={stopSpeaking}
            className="bg-red-400 rounded-3xl p-2 absolute left-10">
            <Text className="text-white font-semibold">Stop</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* ... [Rest of your existing JSX code] */}

      {/* Image Send Button
      <View className="absolute bottom-20 left-20">
        <TouchableOpacity onPress={selectImage}>
          <Image
            className="rounded-full"
            source={require('../../assets/images/image_button.png')} // Replace with your image send icon path
            style={{width: hp(10), height: hp(10)}} // Set your desired style
          />
        </TouchableOpacity>
      </View> */}
      {/* <View className=" bg-white"> */}
      <View
        style={{width: wp(90), height: hp(8)}}
        className="flex-row justify-between items-center p-4">
        <Input
          style={{
            // flex: 1,
            marginRight: -10,
            marginLeft: -20,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            padding: 8,
          }}
          autoComplete="off"
          autoCapitalize="none"
          autoFocus
          keyboardType="email-address"
          placeholder="Type your message"
          value={textInputValue}
          onChangeText={setTextInputValue}
        />
        <TouchableOpacity
          onPress={handleSendText}
          style={{
            marginRight: -10,
            marginBottom: 20,
            // padding: 5,
            backgroundColor: 'blue',
            borderRadius: 5,
            width: wp(14),
            height: hp(7),
            justifyContent: 'center', // centers vertically
            alignItems: 'center', // centers horizontally
          }}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
      {/* </TouchableWithoutFeedback> */}

      {/* ... [Rest of your existing JSX code] */}
    </KeyboardAvoidingView>
  );
};

export default App;
