import { StyleSheet, Text, View, ImageBackground, TextInput, Pressable, ActivityIndicator } from 'react-native';
import homeLogo from "../assets/home-image.jpg";
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const {
    showLoginView,
    setshowLoginView,
    username,
    password,
    setUsername,
    setPassword,
    loginUser,
    user,
    createUser,
    checkUserSession,
    loading,
    setLoading
  } = useContext(GlobalContext);
  console.log(username, password)
  useEffect(() => {
    // function that checks existing user session
    // which takes navigation function
    // and screen for rhich the user will be redirected 
    // if a successfyll user session is found.
    checkUserSession(navigation, "Chat");

    if (user?.username !== "") {
      setLoading(true)
      // we will create user session so user do not have to re-login;
      AsyncStorage.setItem("user_session", JSON.stringify(user)).then(
        ok => {
          setLoading(false);
          // when user session is created successfully we redirect user to chat screen
          navigation.navigate("Chat", {
            username: user.username,
          });
        }
      )
    };
  }, [user?.username]);
  // when loading is true only show loading indicator
  if (loading) return <ActivityIndicator size="large" color="blue" />
  return (
    <View style={styles.mainWrapper}>
      <ImageBackground source={homeLogo} style={styles.homeImage} />
      <View style={styles.content}>
        {
          showLoginView ? (
            <View style={styles.infoBlock}>
              <View style={styles.infoContainer}>
                <Text>Enter Username</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder='username'
                  autoCorrect={false}
                  onChangeText={setUsername}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text>Enter Password</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder='password'
                  autoCorrect={false}
                  onChangeText={setPassword}
                />
              </View>
              <View
                style={styles.buttonWrapper}>
                <Pressable
                  onPress={() => loginUser({ username, password })}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable
                  onPress={() => setshowLoginView(false)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Register</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.infoBlock}>
              <View style={styles.infoContainer}>
                <Text style={styles.heading}>Enter Username</Text>
                <TextInput
                  style={styles.loginInput}
                  autoCorrect={false}
                  placeholder='username'
                  onChangeText={setUsername}
                />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.heading}>Create Password</Text>
                <TextInput
                  style={styles.loginInput}
                  autoCorrect={false}
                  placeholder='password'
                  onChangeText={setPassword}
                />
                <View style={styles.buttonWrapper}>
                  <Pressable
                    onPress={() => createUser(username, password)}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Register</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )
        }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  homeImage: {
    width: "100%",
    heading: 400,
    flex: 1,
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  infoContainer: {
    width: '80%',
    flexDirection: "column",
    marginVertical: 5
  },
  loginContainer: {
    backgroundColor: "red",
    margin: 5
  },
  infoBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 15,
    color: "#acacac",
    marginBottom: 15,
  },
  loginInput: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#703efe",
    padding: 15,
    marginVertical: 10,
    width: "34%",
    elevation: 1,
    borderRadius: 50,
  },
  buttonWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});