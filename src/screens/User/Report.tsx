import React, { useCallback, useEffect, useState } from 'react'
import { Snackbar, Text } from 'react-native-paper'
import { getAttemptTableService } from '../../database/AttemptTableService'
import { QuestionAttempt } from '../../model/QuestionAttempt'
import { RefreshControl, View } from 'react-native'
import { s as tw } from 'react-native-wind'
import { FlatList } from 'react-native-gesture-handler'
import { COLORS } from '../../constants/theme'
import { useFocusEffect } from '@react-navigation/native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { User } from '../../model/User'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../context/AuthContext'


function Report() {
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([])
  const attemptTableService = getAttemptTableService()
  const { user, logout } = useAuth();

  const fetchQuestionAttemptsData = useCallback(() => {

    attemptTableService.then((service) => {
      setQuestionAttempts([])
      service.fetchQuestionAttemptsByUserId(user?.userId!!).then((data) => {
        setQuestionAttempts(data)
      })
    })

  }, [])

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setQuestionAttempts([])
    attemptTableService.then((service) => {
      service.fetchQuestionAttemptsByUserId(user?.userId!!).then((data) => {
        setQuestionAttempts(data)
        setRefreshing(false)
      })
    })
    
  }, []);

  useFocusEffect(
    fetchQuestionAttemptsData
  );



  let delayCount = 0
  return (
    <View style={tw`flex-1 bg-white justify-center`}>
      {questionAttempts.length > 0 ?

        <FlatList
          data={questionAttempts}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
        />

        : <Text style={tw`text-center text-lg`}>No data Found</Text>}

    </View>
  )
}

export default Report