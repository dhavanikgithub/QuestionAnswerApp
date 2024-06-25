import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, ScrollView } from 'react-native'
import { Avatar, Text, TextInput } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { s as tw } from 'react-native-wind'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { User } from '../../model/User'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Divider } from '@react-native-material/core'
import { COLORS } from '../../constants/theme'



function ProfileDetails({ navigation }: { navigation: NavigationProp<ParamListBase> }) {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    AsyncStorage.getItem('user').then((as) => {
      setUser(JSON.parse(as as string) as User)
    })
  }, [])

  return (
    <ScrollView style={tw`bg-white`}>
      <View style={tw`h-full w-full flex-col`}>
        <TouchableOpacity style={tw`flex-row justify-center mt-5`} >
          <Avatar.Image size={100} source={{ uri: `data:${user?.imageMIME};base64,${user?.profileImage}` }} />
        </TouchableOpacity>
        <View style={[tw`flex-col items-center mx-4 mt-5 p-5 rounded-lg`,{backgroundColor:COLORS.lightDynamic31_33.primaryContainer}]}>
          <Animated.View entering={FadeInDown.duration(1000).springify()} style={[tw`flex-row justify-between w-full mb-3 p-2 rounded-lg`,{backgroundColor:COLORS.lightDynamic31_33.primary}]}>
            <Text style={[{color:'white'}]}>Username</Text>
            <Text style={[{color:'white'}]}>{user?.userName}</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(1000).springify()} style={tw`flex-row justify-between w-full bg-white p-2 rounded-lg`}>
            <Text style={[{color:COLORS.lightDynamic31_33.primary}]}>Phone No</Text>
            <Text>{user?.phoneNo}</Text>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProfileDetails