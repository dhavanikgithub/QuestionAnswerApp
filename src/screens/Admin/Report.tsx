import React, { useCallback, useState } from 'react'
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { s as tw } from 'react-native-wind'
import { COLORS } from '../../constants/theme'
import { User } from '../../model/User'
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native'
import { getAttemptTableService } from '../../database/AttemptTableService'
import { Avatar } from 'react-native-paper'

function Report({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: any }) {

  const [users, setUsers] = useState<User[]>([]);
  const attemptTableService = getAttemptTableService();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    attemptTableService.then((service) => {
      service.fetchUserDetailsFromAttempts().then((data) => {
        setUsers(data);
        setRefreshing(false);
      })
    })
  }, []);

  useFocusEffect(
    useCallback(() => {
      attemptTableService.then((service) => {
        service.fetchUserDetailsFromAttempts().then((data) => {
          setUsers(data);
        })
      })
    }, [])
  );

  const userItemRender = (userData: User, key: number) => {
    return (
      <View key={key} style={[tw`flex-row p-3 mx-3 mb-2 rounded-lg items-center`, { backgroundColor: '#f4f2f0' }]}>
        <Avatar.Image size={50} source={{ uri: `data:${userData.imageMIME};base64,${userData.profileImage}` }} />
        <Text style={[tw`text-lg flex-1 ml-2`, { color: COLORS.warning }]}>{userData.userName}</Text>
        <TouchableOpacity style={[tw`flex-.5 rounded-lg p-2`, { backgroundColor: COLORS.warning }]} onPress={() => {
          navigation.navigate('User Report Details', { 'user': userData })
        }}>
          <Text style={tw`text-center text-white font-bold`}>View Report</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {users && users.length > 0 ? <FlatList style={tw`mt-2`} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } data={users} renderItem={({ item, index }) => userItemRender(item, index)} /> :
        (
          <View style={tw`w-full h-full flex-col justify-center items-center`}>
            <Text style={tw` text-center text-gray-500`}>No data found</Text>
          </View>
        )}


    </View>
  )
}

export default Report