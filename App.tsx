import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserHome from './src/screens/User/UserHome';
import AdminHome from './src/screens/Admin/AdminHome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { s as tw } from 'react-native-wind';
import AddUser from './src/screens/Admin/AddUser';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QuestionList from './src/screens/Admin/QuestionList';
import Report from './src/screens/Admin/Report';
import UReport from './src/screens/User/Report';
import AddQuestion from './src/screens/Admin/AddQuestion';
import ProfileDetails from './src/screens/User/ProfileDetails';
import AttemptQuiz from './src/screens/User/AttemptQuiz';
import { COLORS } from './src/constants/theme';
import { Alert } from 'react-native';
import UserReportDetails from './src/screens/Admin/UserReportDetails';
import { AuthProvider, useAuth } from './src/context/AuthContext';


function App(): React.JSX.Element {

  const [isLoading, setIsLoading] = useState(true);
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  


  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      setIsUserLogin(value ? true : false);
    });
    AsyncStorage.getItem('admin').then((value) => {
      setIsAdminLogin(value ? true : false);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show splash screen for 3 seconds
  }, []);


  const UserBottomTab = () => {
    return (
      <Tab.Navigator screenOptions={{
        headerStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerRight: logoutHandle,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: COLORS.lightDynamic31_33.primary
      }}>
        <Tab.Screen name="Home" component={UserHome} options={{ tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="home" size={24} color={focused ? COLORS.lightDynamic31_33.primary : COLORS.black} /> }} />
        <Tab.Screen name="Report" component={UReport} options={{ tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="text-box-outline" size={24} color={focused ? COLORS.lightDynamic31_33.primary : COLORS.black} /> }} />
        <Tab.Screen name="Profile" component={ProfileDetails} options={{ tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="account-circle" size={24} color={focused ? COLORS.lightDynamic31_33.primary : COLORS.black} /> }} />
      </Tab.Navigator>
    )
  }
  

  const AdminBottomTab = () => {


    return (
      <Tab.Navigator screenOptions={{
        headerStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerRight: logoutHandle,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: COLORS.lightDynamic31_33.primary
        

      }}>
        <Tab.Screen name="Home" component={AdminHome} options={{ tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="home" size={24} color={focused ? COLORS.lightDynamic31_33.primary : COLORS.black}/> }} />
        <Tab.Screen name="Questions" component={QuestionList} options={{ tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="view-list-outline" size={24} color={focused ? COLORS.lightDynamic31_33.primary : COLORS.black} /> }} />
        <Tab.Screen name="Report" component={Report} options={{ tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="text-box-outline" size={24} color={focused ? COLORS.lightDynamic31_33.primary : COLORS.black} /> }} />
      </Tab.Navigator>
    )
  }

  const logoutHandle = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    return (
      <MaterialCommunityIcons style={tw`mr-2`} name="logout" size={24} color={COLORS.lightDynamic31_33.primary} onPress={() => {logoutConfirmHandle(navigation)}} />
    )
  }

  const logoutConfirmHandle = (navigation:NavigationProp<ParamListBase>) =>{
    
    Alert.alert('Logout', 'Do you want to Logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Logout', onPress: () => {
        AsyncStorage.clear();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }], });
      }},
    ])};


  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Splash'
              screenOptions={{
                headerRight: logoutHandle
              }}
            >
              {isLoading ? (
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
              ) : (
                isUserLogin ? (
                  <>
                    <Stack.Screen name="UserHome" component={UserBottomTab} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminHome" component={AdminBottomTab} options={{ headerShown: false }} />
                  </>
                ) : (
                  isAdminLogin ? (
                    <>
                      <Stack.Screen name="AdminHome" component={AdminBottomTab} options={{ headerShown: false }} />
                      <Stack.Screen name="UserHome" component={UserBottomTab} options={{ headerShown: false }} />
                    </>
                  ) : (
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  )
                )
              )}
              {isUserLogin || isAdminLogin ? (
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              ) : null}
              {!isLoading && !isUserLogin && !isAdminLogin ? (
                <>
                  <Stack.Screen name="UserHome" component={UserBottomTab} options={{ headerShown: false }} />
                  <Stack.Screen name="AdminHome" component={AdminBottomTab} options={{ headerShown: false }} />
                </>
              ) : null}
              <Stack.Screen name="Add User" component={AddUser} />
              <Stack.Screen name="Add Question" component={AddQuestion} />
              <Stack.Screen name="Quiz" component={AttemptQuiz} />
              <Stack.Screen name="User Report Details" component={UserReportDetails} />
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

export default App;
