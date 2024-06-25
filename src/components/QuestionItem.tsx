import React from 'react'
import { User } from '../model/User'
import { Alert, Text, View } from 'react-native'
import { s as tw } from 'react-native-wind'
import { Avatar, Card } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Question } from '../model/Question'
import { COLORS } from '../constants/theme'

function QuestionItem({ question, navigation, deleteOperation }: { question: Question, navigation: NavigationProp<ParamListBase>, deleteOperation: any }) {


    return (
        <View style={[tw`p-3 mx-3 my-2 rounded-lg`, { backgroundColor: COLORS.lightDynamic31_33.primaryContainer }]}>
            <View style={tw`flex-row`}>
                <View style={tw`flex-col flex-1 justify-center`}>
                    <Text style={[tw`font-bold text-lg`, { color: COLORS.lightDynamic31_33.primary }]}>
                        {question.question}
                    </Text>
                    <Text style={tw`text-green-500`}>Answer: {question.correctAnswer}</Text>
                </View>
                <View style={tw`flex-col flex-.5`}>
                    <TouchableOpacity style={tw`align-middle mb-5`} >
                        <MaterialCommunityIcons name='pencil-outline' size={24} color={COLORS.lightDynamic31_33.primary} onPress={() => {
                            let temp = null
                            question.options.map((option, index) => {
                                if (option === question.correctAnswer) {
                                    temp = index
                                }
                            })
                            navigation.navigate('Add Question', { question: question, selectedOptionPos: temp })
                        }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`align-middle`}>
                        <MaterialCommunityIcons name='trash-can' size={24} color={COLORS.lightDynamic31_33.primary}
                            onPress={() => {
                                Alert.alert('Delete Question', 'Do you want sure to delete this question? This operation will not be undo.', [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Delete', onPress: () => {
                                            deleteOperation(question.id)
                                        }
                                    },
                                ])
                            }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default QuestionItem