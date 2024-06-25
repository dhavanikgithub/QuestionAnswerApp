import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { FAB } from 'react-native-paper'
import { s as tw } from 'react-native-wind'
import { Question } from '../../model/Question'
import Animated, { BounceIn, FadeInRight, FlipInEasyX } from 'react-native-reanimated'
import QuestionItem from '../../components/QuestionItem'
import { getQuestionTableService } from '../../database/QuestionTableService'
import { COLORS } from '../../constants/theme'

function QuestionList({ navigation }: { navigation: NavigationProp<ParamListBase> }): React.JSX.Element {
  const [questionList, setQuestionList] = useState<Question[]>([])
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    questionTableService.then((service) =>
      service.fetchAll().then((questions) => {
        setQuestionList(questions)
        setRefreshing(false);
      })
    )
  }, []);
  const questionTableService = getQuestionTableService()
  useFocusEffect(
    useCallback(() => {
      
      questionTableService.then((service) =>
        service.fetchAll().then((questions) => setQuestionList(questions))
      )
    }, [])
  );

  const handleDeleteOperation = (quiestionId:number) => {
    questionTableService.then((service) => service.delete(quiestionId).then(() => onRefresh()))
  }
  let delayCount = 0
  return (
    <View style={tw`flex-1 bg-white`}>
      {questionList && questionList.length > 0 ? <FlatList style={tw`mt-2`} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } data={questionList} renderItem={({ item }) => {
        delayCount += 100
        return (
          <Animated.View entering={FadeInRight.delay(delayCount).duration(1000).springify()}>
            <QuestionItem question={item} navigation={navigation} deleteOperation={handleDeleteOperation} />
          </Animated.View>
        )
      }} /> :
        <View style={tw`w-full h-full flex-col justify-center items-center`}>
          <Text style={tw` text-center text-gray-500`}>No questions found</Text>
        </View>
      }
      <Animated.View entering={FlipInEasyX.delay(200).duration(1000).springify()}>

        <FAB
          style={[tw`absolute bottom-5 right-5`, { backgroundColor: COLORS.lightDynamic31_33.primary }]}
          icon="plus"
          color={COLORS.white}
          onPress={() => navigation.navigate('Add Question')}
        />
      </Animated.View>
    </View>
  )
}

export default QuestionList