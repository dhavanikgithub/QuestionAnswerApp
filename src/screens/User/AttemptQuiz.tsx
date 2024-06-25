import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { s as tw } from 'react-native-wind';
import { COLORS } from '../../constants/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getQuestionTableService } from '../../database/QuestionTableService';
import { Question } from '../../model/Question';
import Animated from 'react-native-reanimated';
import { addQAObject, doesQAObjectExist, fetchQAById, QAObject } from '../../database/StorageService';
import { getAttemptTableService } from '../../database/AttemptTableService';
import { Attempt } from '../../model/Attempt';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

function AttemptQuiz({ navigation, route }: { navigation: NavigationProp<ParamListBase>, route: any }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuestionSaved, setIsQuestionSaved] = useState<boolean>(false);

  const questionTableService = useRef(getQuestionTableService()).current;
  const attemptTableService = useRef(getAttemptTableService()).current;

  const QuestionItemRender = () => {
    const options = currentQuestion?.options.map((option, index) => ({
      iconName: `alpha-${String.fromCharCode(97 + index)}-circle`,
      option,
    })) || [];

    return (
      <View>
        <View style={[tw`rounded-lg p-3 mx-3`]}>
          <Text style={tw`text-xl`}>Q. {currentQuestion?.question}</Text>
        </View>
        <View style={tw`flex-col justify-evenly p-3 m-3`}>
          {options.map((item, index) => {
            const isSelected = selectedOption === index;
            const contentColor = isSelected ? COLORS.white : COLORS.lightDynamic31_33.primary;
            const bgColor = isSelected ? COLORS.lightDynamic31_33.primary : COLORS.lightDynamic31_33.primaryContainer;

            return (
              <TouchableOpacity
                key={index}
                style={[tw`flex-row rounded-lg p-4 mb-2 items-center`, { backgroundColor: bgColor }]}
                onPress={() => setSelectedOption(index)}
              >
                <MaterialCommunityIcons name={item.iconName} size={24} color={contentColor} />
                <Text style={[tw`ml-2`, { color: contentColor }]}>{item.option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  useEffect(() => {
    questionTableService.then((service) => {
      service.fetchAll().then((questions) => {
        setQuestions(questions);
        setCurrentQuestion(questions[0]);
      });
    });
  }, [questionTableService]);

  useEffect(() => {
    if (currentQuestion) {
      doesQAObjectExist(currentQuestion.id).then((exists) => {
        if (exists) {
          fetchQAById(currentQuestion.id).then((obj) => {
            if (obj) {
              setSelectedOption(obj[0].SelectedOptionIndex);
              setIsQuestionSaved(true);
            }
          });
        } else {
          setSelectedOption(null);
          setIsQuestionSaved(false);
        }
      });
    }
  }, [currentQuestion]);

  const processQuestion = async (index: number) => {
    if (index >= questions.length) return;

    const question = questions[index];
    const exists = await doesQAObjectExist(question.id);

    const attemptQuestion: Attempt = {
      id: 0,
      isAttemptQuestion: exists,
      isCorrectAnswer: exists ? (await fetchQAById(question.id))[0].Answer === question.correctAnswer : false,
      questionId: question.id,
      userId: route.params.user.userId,
    };
    await attemptTableService.then((service) => service.add(attemptQuestion));

    await processQuestion(index + 1);
  };

  const finishQuizHandle = async () => {
    await processQuestion(0);
    navigation.goBack();
  };

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex, questions]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const saveQuestion = () => {
    if (selectedOption !== null) {
      const qaObject: QAObject = {
        Id: currentQuestion?.id!!,
        Question: currentQuestion?.question!!,
        Answer: currentQuestion?.options[selectedOption]!!,
        SelectedOptionIndex: selectedOption,
      };
      addQAObject(qaObject).then(() => setIsQuestionSaved(true));
    }
  };

  return (
    <View style={tw`h-full w-full bg-white flex-col`}>
      {questions.length > 0 ? (
        <>
          <View style={[tw`rounded-lg p-3 mr-3`]}>
            <ProgressBar
              progress={(currentQuestionIndex + 1) / questions.length}
              color={COLORS.lightDynamic31_33.primary}
              style={tw`rounded-lg h-4`}
            />
            <Text style={tw`text-xl text-right`}>{currentQuestionIndex + 1}/{questions.length}</Text>
          </View>

          <View style={tw`flex-col`}>
            <QuestionItemRender />

            <View style={tw`flex-row justify-between p-3 m-3 items-center`}>
              <MaterialCommunityIcons
                name='chevron-left'
                size={30}
                color={currentQuestionIndex === 0 ? 'gray' : COLORS.lightDynamic31_33.primary}
                onPress={prevQuestion}
                disabled={currentQuestionIndex === 0}
              />
              {!isQuestionSaved && (
                <TouchableOpacity
                  style={[tw`flex-row rounded-lg p-3 items-center`, { backgroundColor: COLORS.lightDynamic31_33.primary }]}
                  onPress={saveQuestion}
                >
                  <Text style={[tw`font-bold text-md`, { color: COLORS.white }]}>{isQuestionSaved ? 'Saved' : 'Save'}</Text>
                </TouchableOpacity>
              )}
              <MaterialCommunityIcons
                name='chevron-right'
                size={30}
                color={currentQuestionIndex < questions.length - 1 ? COLORS.lightDynamic31_33.primary : 'gray'}
                onPress={nextQuestion}
                disabled={currentQuestionIndex >= questions.length}
              />
            </View>

            {currentQuestionIndex === questions.length - 1 && (
              <TouchableOpacity
                style={[tw`rounded-lg p-3 mx-5`, { backgroundColor: COLORS.success }]}
                onPress={finishQuizHandle}
              >
                <Text style={[tw`text-center font-bold text-md`, { color: COLORS.white }]}>Finish</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <Text style={tw`text-xl text-center`}>No Questions Found.</Text>
      )}
    </View>
  );
}

export default AttemptQuiz;
