import { Text } from '@react-native-material/core'
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { AnimatedFAB, FAB } from 'react-native-paper'
import Animated, { BounceIn, BounceInDown, FadeInRight, FlipInEasyX, FlipOutEasyX } from 'react-native-reanimated'
import { s as tw } from 'react-native-wind'
import { getUserService } from '../../database/UserService'
import { User } from '../../model/User'
import UserItem from '../../components/UserItem'
import { COLORS } from '../../constants/theme'
import { getAttemptTableService } from '../../database/AttemptTableService'

function AdminHome({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const userService = getUserService();
    const attemptTableService = getAttemptTableService()
    const [userList, setUserList] = useState<User[] | null>(null)

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setUserList([]);
        userService.then((service) =>
            service.fetchAllUsers().then((users) => {
                setUserList(users)
                setRefreshing(false);
            })
        )
    }, []);
    useFocusEffect(
        useCallback(() => {
            setUserList([]);
            userService.then((service) =>
                service.fetchAllUsers().then((users) => setUserList(users))
            )
        }, [])
    );

    let delayCount = 0

    const deleteUser = async (userId: number) => {
        attemptTableService.then((service) =>{
            service.deleteByUserId(userId).then(() => 
                userService.then((service) =>
                    service.deleteUser(userId).then(() => {
                        onRefresh()
                    })
                )
            )
        })
        
    }

    return (
        <View style={tw`flex-1 bg-white`} >
            {userList && userList.length > 0 ? <FlatList style={tw`mt-2`} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } data={userList} renderItem={({ item }) => {
                delayCount += 100
                return (
                    <Animated.View entering={FadeInRight.delay(delayCount).duration(1000).springify()}>
                        <UserItem user={item} navigation={navigation} deleteUser={deleteUser} />
                    </Animated.View>
                )
            }} /> :
                <View style={tw`w-full h-full flex-col justify-center items-center`}>
                    <Text style={tw` text-center text-gray-500`}>No users found</Text>
                </View>
            }

            <Animated.View entering={FlipInEasyX.delay(200).duration(1000).springify()}>
                <FAB
                    style={[tw`absolute bottom-5 right-5`, { backgroundColor: COLORS.lightDynamic31_33.primary }]}
                    icon="plus"
                    color={COLORS.white}
                    onPress={() => navigation.navigate('Add User')} />
            </Animated.View>

        </View>

    )
}

export default AdminHome