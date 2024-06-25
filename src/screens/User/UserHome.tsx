import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text } from '@react-native-material/core'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import { s as tw } from 'react-native-wind'
import { User } from '../../model/User'
import { ProgressBar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS } from '../../constants/theme'
import { getAttemptTableService } from '../../database/AttemptTableService'
import { clearQAList } from '../../database/StorageService'
import Animated, { FadeInDown } from 'react-native-reanimated'

function UserHome({ navigation }: { navigation: NavigationProp<ParamListBase> }) {

    const [user, setUser] = useState<User | null>(null)
    const attemptTableService = getAttemptTableService();


    useEffect(() => {
        AsyncStorage.getItem('user').then((as) => {
            setUser(JSON.parse(as as string) as User)
        })
    }, [])

    const attemptQuizHandle = () => {
        if (user) {

            attemptTableService.then((service) => {
                service.fetchByUserId(user?.userId!!).then((attempts) => {
                    if (attempts.length > 0) {
                        Alert.alert("Already Attempted", 'Please Reset Quiz and Try Again')
                    }
                    else {
                        navigation.navigate('Quiz', { 'user': user })
                    }
                })
            })
        }

    }

    const resetQuizHandle = () => {
        clearQAList().then(() => {
            attemptTableService.then((service) => {
                service.deleteByUserId(user?.userId!!).then(() => {
                    Alert.alert("Quiz Reset Successfully", 'Please Attempt Quiz Again')
                })
            })
        })
    }

    return (
        <View style={tw`flex-1 w-full h-full bg-white`}>
            <Animated.View entering={FadeInDown.duration(1000).springify()}>
                <TouchableOpacity style={[tw`rounded-lg h-100 p-5 m-5`, { backgroundColor: COLORS.lightDynamic31_33.primaryContainer }]} onPress={attemptQuizHandle}>
                    <MaterialCommunityIcons name='alpha-q-box' size={24} color={COLORS.lightDynamic31_33.primary} style={tw`mb-3`} />
                    <Text>Attempt Quiz</Text>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} >
                <TouchableOpacity style={[tw`rounded-lg h-100 p-5 mx-5`, { backgroundColor: COLORS.lightDynamic31_33.primaryContainer }]} onPress={resetQuizHandle}>
                    <MaterialCommunityIcons name='refresh-circle' size={24} color={COLORS.lightDynamic31_33.primary} style={tw`mb-3`} />
                    <Text>Reset Quiz</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default UserHome

