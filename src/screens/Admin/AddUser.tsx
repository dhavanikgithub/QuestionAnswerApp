import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, LogBox, ScrollView, Text } from 'react-native'
import { Avatar, TextInput } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { s as tw } from 'react-native-wind'
import ImagePicker from 'react-native-image-crop-picker';
import { getUserService } from '../../database/UserService'
import { User } from '../../model/User'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS } from '../../constants/theme'

export function cleanUsername(username: string): string {
  // Trim leading and trailing spaces
  let trimmedUsername = username.trim();

  // Replace multiple spaces with a single space
  trimmedUsername = trimmedUsername.replace(/\s+/g, ' ');

  return trimmedUsername;
}

function AddUser({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: any }) {
  let user = null
  try {
    user = route.params.user;
  } catch (error) {
  }

  LogBox.ignoreLogs(['[Reanimated]']);
  LogBox.ignoreLogs(['Possible unhandled promise']);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '55%'], []);

  const userService = getUserService();

  const renderBackDrop = (props: any) => {
    return (<BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} />)
  }

  const [username, setUsername] = useState<string>(user ? user.userName : '')
  const [phone, setPhone] = useState<string>(user ? user.phoneNo : '')
  const [password, setPassword] = useState<string>('')
  const [image, setImage] = useState<string>(user ? user.profileImage : '')
  const [imageMIME, setImageMIME] = useState<string>(user ? user.imageMIME : '')
  const [passwordUppercase, setPasswordUpperCase] = useState<boolean>(false);
  const [passwordLowercase, setPasswordLowerCase] = useState<boolean>(false);
  const [passwordNumber, setPasswordNumber] = useState<boolean>(false);
  const [passwordLength, setPasswordLength] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean | null>(null);
  const [isUserNameValid, setIsUsernameValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (user) {
      setUsername(user.userName)
      setPhone(user.phoneNo)
      setImage(user.profileImage)
      setImageMIME(user.imageMIME)
    }

  }, [user])

  
  const validatePhoneNumber = useCallback(() => {
    const isValid = /^[6789]\d{9}$/.test(phone);
    console.log(isValid)
    setIsPhoneNumberValid(isValid);
  }, [phone, setPhone])

  const validateUserName = useCallback(() => {
    const isValid = /^[a-zA-Z][a-zA-Z-_\s]{4,15}$/.test(username);
    setIsUsernameValid(isValid);
  }, [username, setUsername]);
  
  const validatePassword = useCallback(() => {
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const length = password.length >= 8 && password.length <= 20;
    
    setPasswordUpperCase(uppercase);
    setPasswordLowerCase(lowercase);
    setPasswordNumber(number);
    setPasswordLength(length);
    setIsPasswordValid(uppercase && lowercase && number && length);
    
  }, [password, setPassword]);
  
  const validationCheck = useEffect(() => {
    
    validatePassword()
    validatePhoneNumber()
    validateUserName()
  }, [phone, setPhone, password, setPassword, username, setUsername, validatePhoneNumber, validatePassword, validateUserName])
  const formSubmit = async () => {
    console.log(imageMIME)
    if (username !== '' && phone !== '' && image !== '' && isPhoneNumberValid && isUserNameValid) {

      if (user) {
        const userData: User = {
          userId: user.userId,
          profileImage: image,
          imageMIME: imageMIME,
          userName: cleanUsername(username),
          phoneNo: phone,
          password: user?.password
        }
        userService.then((service) => {
          service.updateUser(userData).then(() => {
            navigation.goBack()
          })
        })
      }
      else {
        if (!isPasswordValid) return
        const userData: User = {
          userId: 0,
          profileImage: image,
          imageMIME: imageMIME,
          userName: cleanUsername(username),
          phoneNo: phone,
          password: password
        }
        console.log(userData)
        userService.then((service) => {
          service.insertUser(userData).then(() => {
            navigation.goBack()
          })
        })
      }
    }
  }



  return (
    <View style={tw`h-full w-full flex-col`}>
      <ScrollView style={tw`bg-white`}>
        <View style={tw`h-full w-full flex-col`}>
          <TouchableOpacity style={tw`flex-row justify-center mt-5`} onPress={() => { bottomSheetRef.current?.snapToIndex(1) }}>
            <Avatar.Image size={100} source={image ? { uri: `data:${imageMIME};base64,${image}` } : require('../../assets/images/avatar.png')} />
          </TouchableOpacity>
          <View style={tw`flex items-center mx-4 mt-2`}>
            <Animated.View entering={FadeInDown.duration(1000).springify()} style={tw`w-full text-left mb-1 p-1`}>
              <Text style={tw`text-gray-500 font-bold`}>Username <Text style={tw`text-red-500`}>*</Text></Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(1000).springify()} style={tw` rounded-2xl w-full mb-2`}>
              <TextInput
                error={isUserNameValid === false}
                theme={{ colors: { primary: COLORS.lightDynamic31_33.primary } }}
                mode='outlined'
                label="Username"
                placeholder='Username'
                placeholderTextColor={'gray'}
                style={[tw`text-black`, { backgroundColor: 'white' }]}
                value={username}
                left={'account'}
                onChangeText={(value) => {
                  setUsername(value)
                }} />
              <Text>alphabet , - , _ , space is valid min 5 to 15</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={tw`w-full text-left mb-1 p-1`}>
              <Text style={tw`text-gray-500 font-bold`}>Phone No <Text style={tw`text-red-500`}>*</Text></Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={tw` rounded-2xl w-full mb-2`}>
              <TextInput
                error={isPhoneNumberValid === false}
                theme={{ colors: { primary: COLORS.lightDynamic31_33.primary } }}
                mode='outlined'
                label="Phone No"
                placeholder='Phone No'
                placeholderTextColor={'gray'}
                style={[tw`text-black`, { backgroundColor: 'white' }]}
                value={phone}
                keyboardType="numeric"
                onChangeText={(value) => {
                  setPhone(value.trim())
                }} />
              <Text>Example: +91 7854963210</Text>
            </Animated.View>
            {!user ? (
              <>
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={tw`w-full text-left mb-1 p-1`}>
                  <Text style={tw`text-gray-500 font-bold`}>Password <Text style={tw`text-red-500`}>*</Text></Text>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={tw` rounded-2xl w-full mb-2`}>
                  <TextInput
                    error={isPasswordValid === false}
                    theme={{ colors: { primary: COLORS.lightDynamic31_33.primary } }}
                    mode='outlined'
                    label="Password"
                    placeholder='Password'
                    placeholderTextColor={'gray'}
                    style={[tw`text-black`, { backgroundColor: 'white' }]}
                    secureTextEntry
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                    }} />
                  <View style={tw`flex-row`}>
                    <Text style={[passwordUppercase ? styles.valid : styles.invalid]}>Upper | </Text>
                    <Text style={[passwordLowercase ? styles.valid : styles.invalid]}>Lower | </Text>
                    <Text style={[passwordNumber ? styles.valid : styles.invalid]}>Number | </Text>
                    <Text style={[passwordLength ? styles.valid : styles.invalid]}>8 to 20</Text>
                  </View>
                </Animated.View>
              </>
            ) : null}
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={tw`w-full mt-3`}>
              <TouchableOpacity style={[tw`p-3 rounded-2xl mb-3`, { backgroundColor: COLORS.lightDynamic31_33.primary }]} onPress={formSubmit}>
                <Text style={[tw`text-xl font-bold text-center`, { color: 'white' }]}>{user ? 'Update User' : 'Add User'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

        </View>

      </ScrollView>
      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        backdropComponent={renderBackDrop}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.panelTitle}>Upload Photo</Text>
              <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>
            <TouchableOpacity style={styles.panelButton}>
              <Text style={styles.panelButtonTitle} onPress={() => {
                bottomSheetRef.current?.close();
                ImagePicker.openCamera({
                  width: 300,
                  height: 400,
                  cropping: true,
                  mediaType: 'photo',
                  includeBase64: true
                }).then(image => {
                  setImage(image.data!!);
                  setImageMIME(image.mime!!);
                  bottomSheetRef.current?.close();
                });
              }}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={() => {
              bottomSheetRef.current?.close();
              try {
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                  mediaType: 'photo',
                  includeBase64: true
                }).then(image => {
                  setImage(image.data!!);
                  setImageMIME(image.mime!!);
                  bottomSheetRef.current?.close();
                });
              }
              catch (e) {
                console.log(e);
              }
            }}>
              <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => bottomSheetRef.current?.close()}>
              <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: COLORS.lightDynamic31_33.primary,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  valid: {
    color: 'green',
    fontWeight: 'bold',
  },
  invalid: {
    color: 'gray',
  },
});
export default AddUser