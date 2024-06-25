import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, ScrollView, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { s as tw } from 'react-native-wind';
import { getQuestionTableService } from '../../database/QuestionTableService';
import { Question } from '../../model/Question';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Animated, { StretchInX, StretchInY, ZoomInEasyUp } from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation']);

const AddQuestion = ({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: any }) => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const questionTableService = getQuestionTableService();

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
    if (text === correctAnswer) {
      setCorrectAnswer('');
    }
  };

  const handleAddQuestion = () => {
    if (question.trim() === '' || options.some(option => option.trim() === '') || correctAnswer.trim() === '') return;
    questionTableService.then((service) => {
      const questionData: Question = {
        id: 0,
        question:question.trim(),
        options:[options[0].trim(), options[1].trim(), options[2].trim(), options[3].trim()],
        correctAnswer:correctAnswer.trim()
      };
      service.add(questionData).then(() => {
        navigation.goBack();
      });
    });
  }

  const handleUpdateQuestion = () => {
    if (question.trim() === '' || options.some(option => option.trim() === '') || correctAnswer.trim() === '') return;
    questionTableService.then((service) => {
      const questionData: Question = {
        id: route.params.question.id,
        question:question.trim(),
        options:[options[0].trim(), options[1].trim(), options[2].trim(), options[3].trim()],
        correctAnswer:correctAnswer.trim()
      };
      service.update(route.params.question.id, questionData).then(() => {
        navigation.goBack();
      });
    });
  }

  const handleSubmit = () => {
    if(route.params && route.params.question) {
      handleUpdateQuestion();
    }
    else{
      handleAddQuestion();
    }
  };

  useEffect(() => {
    if (route.params && route.params.question) {
      const temp: Question = route.params.question as Question;
      setOptions(temp.options);
      setCorrectAnswer(temp.correctAnswer);
      setQuestion(temp.question);
    }
  }, [route.params]);



  return (
    <ScrollView style={tw`p-4`}>
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold mb-2 text-gray-500`}>Question:</Text>
        <Animated.View entering={StretchInY.duration(600)}>
          <TextInput
            style={[tw`border border-gray-400 p-2 rounded text-black`, { textAlignVertical: 'top' }]}
            value={question}
            onChangeText={(text) => setQuestion(text)}
            multiline={true}
            placeholderTextColor={'gray'}
            numberOfLines={4}
            placeholder="Enter your question"
          />
        </Animated.View>
      </View>
      {options.map((option, index) => (
        <Animated.View entering={ZoomInEasyUp.delay(index * 100).duration(500)} key={index} style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold mb-2 text-gray-500`}>Option {index + 1}:</Text>
          <TextInput
            style={tw`border border-gray-400 p-2 rounded`}
            value={option}
            onChangeText={(text) => {
              handleOptionChange(text, index)
              if (correctAnswer !== '') {
                setCorrectAnswer('');

              }
            }}
            placeholder={`Option ${index + 1}`}
          />
        </Animated.View>
      ))}
      <Animated.View entering={StretchInX.delay(500).duration(500)} style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold mb-2 text-gray-500`}>Correct Answer:</Text>
        <View style={tw`border border-gray-400 rounded`}>
          <Picker
            selectedValue={correctAnswer}
            onValueChange={(itemValue) => setCorrectAnswer(itemValue)}
          >
            <Picker.Item label="Select Correct Answer" value="" />
            {options.map((option, index) => (
              option !== '' ? (
                <Picker.Item key={index} label={`${index + 1}: ${option}`} value={option} />
              ) : null
            ))}
          </Picker>
        </View>
      </Animated.View>
      <Animated.View entering={StretchInY.delay(600).duration(500)}>
        <TouchableOpacity
          style={[tw`p-3 rounded-2xl mb-10`, { backgroundColor: COLORS.lightDynamic31_33.primary }]}
          onPress={handleSubmit}
        >
          <Text style={tw`text-xl font-bold text-white text-center`}>Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

export default AddQuestion;
