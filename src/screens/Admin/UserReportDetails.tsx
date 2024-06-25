import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { getAttemptTableService } from '../../database/AttemptTableService';
import { QuestionAttempt } from '../../model/QuestionAttempt';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { s as tw } from 'react-native-wind'
import { COLORS } from '../../constants/theme';
import { User } from '../../model/User';
import Animated, { FadeInDown } from 'react-native-reanimated';


function UserReportDetails({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: any }) {
    const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([])
    const attemptTableService = getAttemptTableService()
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        if (route.params.user != null) {
            setRefreshing(true)
            attemptTableService.then((service) => {
                service.fetchQuestionAttemptsByUserId(route.params.user!!.userId).then((data) => {
                    setQuestionAttempts(data)
                    setRefreshing(false)
                })
            })
        }
    }, []);


    useFocusEffect(
        useCallback(() => {
            attemptTableService.then((service) => {
                service.fetchQuestionAttemptsByUserId(route.params.user!!.userId).then((data) => {
                    setQuestionAttempts(data)
                })
            })
        }, [questionAttempts,setQuestionAttempts])
    );
    useEffect(() => {
        attemptTableService.then((service) => {
            service.fetchQuestionAttemptsByUserId(route.params.user!!.userId).then((data) => {
                setQuestionAttempts(data)
            })
        })
    }, [])

    let delayCount = 0
    return (
        <View style={tw`flex-1 bg-white justify-center`}>

            {questionAttempts.length > 0 ?
                (<FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    data={questionAttempts}
                    renderItem={
                        ({ item, index }) => {
                            delayCount += 100
                            const containerColor = item.isAttemptQuestion ? (item.isCorrectAnswer ? COLORS.successContainer : COLORS.errorContainer) : COLORS.lightDynamic31_33.primaryContainer
                            const contentColor = item.isAttemptQuestion ? (item.isCorrectAnswer ? COLORS.success : COLORS.error) : COLORS.black
                            return (
                                <Animated.View entering={FadeInDown.delay(delayCount).duration(1000).springify()}>
                                    <View style={[tw`flex-col p-3 mx-3 my-2 rounded-lg`, { backgroundColor: containerColor }]}>
                                        <Text style={[tw`text-lg`, { color: contentColor }]}>Q{index + 1}. {item.question}</Text>
                                    </View>
                                </Animated.View>
                            )
                        }
                    }
                />)
                : (<View style={tw`w-full h-full flex-col justify-center items-center`}>
                    <Text style={tw` text-center text-gray-500`}>No data found</Text>
                </View>)}

        </View>
    )
}

export default UserReportDetails