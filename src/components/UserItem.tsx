import React from 'react'
import { User } from '../model/User'
import { Alert, Text, View } from 'react-native'
import { s as tw } from 'react-native-wind'
import { Avatar, Card } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS } from '../constants/theme'

function UserItem({ user, navigation, deleteUser }: { user: User, navigation: NavigationProp<ParamListBase>, deleteUser: any }) {


    return (
        <View style={[tw`p-3 mx-3 my-1 rounded-lg`, { backgroundColor: COLORS.lightDynamic31_33.primaryContainer }]}>
            <View style={tw`flex-row items-center`}>
                <View style={tw`flex-.5 align-middle`}>
                    <Avatar.Image size={50} source={{ uri: `data:${user.imageMIME};base64,${user.profileImage}` }} />
                </View>
                <View style={tw`flex-1 ml-4 flex-col`}>
                    <Text style={[tw`text-black`, { color: COLORS.lightDynamic31_33.primary }]}>Id: {user.userId}</Text>
                    <Text style={[tw`text-black`, { color: COLORS.lightDynamic31_33.primary }]}>Username: {user.userName}</Text>
                    <Text style={[tw`text-black`, { color: COLORS.lightDynamic31_33.primary }]}>Phone No: {user.phoneNo}</Text>
                </View>
                <TouchableOpacity style={tw`flex-.5 align-middle mr-5`} onPress={() => { navigation.navigate('Add User', { user }) }}>
                    <MaterialCommunityIcons name='pencil-outline' size={24} color={COLORS.lightDynamic31_33.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex-.5 align-middle`} onPress={() => {
                    Alert.alert('Delete User', 'Do you want sure to delete this user? This operation will not be undo.', [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Delete', onPress: () => {
                                deleteUser(user.userId)
                            }
                        },
                    ])

                }}>
                    <MaterialCommunityIcons name='trash-can' size={24} color={COLORS.lightDynamic31_33.primary} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UserItem