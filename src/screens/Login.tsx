import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated'
import { s as tw } from 'react-native-wind'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { SegmentedButtons } from 'react-native-paper';
import { getUserService } from '../database/UserService';
import { ScrollView } from 'react-native-gesture-handler';
import { Spacer } from '@react-native-material/core';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { User } from '../model/User';


function Login({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
    const [role, setRole] = React.useState<string>('user');
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { login } = useAuth();
    const userService = getUserService();

    const doLogin = () => {
        if (username !== '' && password !== '') {
            if (role === 'admin' && username === 'admin' && password === 'admin') {
                const adminData:User = {
                    userId: 0,
                    userName: "admin",
                    password: "admin",
                    imageMIME: "",
                    profileImage: "",
                    phoneNo: ""
                }
                login(adminData);
                AsyncStorage.setItem(role, JSON.stringify({username:"admin"}));
                navigation.reset({ index: 0, routes: [{ name: 'AdminHome' }], });
            }
            else {
                userService.then((service) => service.loginUser(username, password).then((user) => {
                    if (user) {
                        login(user);
                        AsyncStorage.setItem(role, JSON.stringify(user));
                        navigation.reset({ index: 0, routes: [{ name: 'UserHome' }], });
                    }
                }))
            }
        }

    }

    return (
        <ScrollView style={tw`bg-white`}>
            <View>
                <Image style={tw`h-full w-full absolute`} source={require('../assets/images/background.png')} />
                <View style={tw`flex-row justify-around w-full absolute`}>
                    <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify().damping(3)} style={tw`bottom-20 h-58`} source={require('../assets/images/light.png')} />
                    <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify().damping(3)} style={tw`bottom-20 w-16 h-40`} source={require('../assets/images/light.png')} />
                </View>
                <View style={tw`h-full w-full flex justify-around`}>
                    <View style={tw`flex items-center mt-10`}></View>
                    <View style={tw`flex items-center mt-32`}>
                        <Animated.Text entering={FadeInUp.duration(1000).springify()} style={tw`text-white font-bold tracking-wider text-4xl`}>Login</Animated.Text>
                    </View>
                    <View style={tw`flex items-center mx-4 mt-32`}>
                        <Animated.View entering={FadeInDown.duration(1000).springify()} style={tw`w-full text-left mb-1 p-1`}>
                            <Text style={tw`text-gray-500 font-bold`}>Username <Text style={tw`text-red-500`}>*</Text></Text>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.duration(1000).springify()} style={tw`bg-gray-200 px-4 rounded-2xl w-full mb-2`}>
                            <TextInput placeholder='Username' placeholderTextColor={'gray'} style={tw`text-black`} value={username} onChangeText={(text) => setUsername(text)} />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={tw`w-full text-left mb-1 p-1`}>
                            <Text style={tw`text-gray-500 font-bold`}>Password <Text style={tw`text-red-500`}>*</Text></Text>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={tw`bg-gray-200 px-4 rounded-2xl w-full mb-3`}>
                            <TextInput placeholder='Password' placeholderTextColor={'gray'} style={tw`text-black`} secureTextEntry value={password} onChangeText={(text) => setPassword(text)} />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={tw`w-full items-start mb-3`}>
                            <SegmentedButtons
                                style={[tw`w-1/2`]}
                                value={role}
                                onValueChange={setRole}
                                buttons={[
                                    {
                                        value: 'user',
                                        label: 'User',
                                        checkedColor: 'white',
                                        uncheckedColor: COLORS.lightDynamic31_33.primary,
                                        style: {
                                            backgroundColor: role === 'user' ? COLORS.lightDynamic31_33.primary : 'white',
                                            borderColor: COLORS.lightDynamic31_33.primary,
                                        },
                                        

                                    },
                                    {
                                        value: 'admin',
                                        label: 'Admin',
                                        checkedColor: 'white',
                                        uncheckedColor: COLORS.lightDynamic31_33.primary,
                                        style: {
                                            backgroundColor: role === 'admin' ? COLORS.lightDynamic31_33.primary : 'white',
                                            borderColor: COLORS.lightDynamic31_33.primary,
                                        }
                                    },
                                ]}
                            />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={tw`w-full`}>
                            <TouchableOpacity style={[tw`p-3 rounded-2xl mb-3`,{backgroundColor:COLORS.lightDynamic31_33.primary}]} onPress={doLogin}>
                                <Text style={tw`text-xl font-bold text-white text-center`}>Login</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Login