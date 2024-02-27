import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../context';
import SearchBar from '../Components/SearchBar';

export default function ChatroomScreen({ route, navigation }) {
  const { username } = route.params;
  const {
    connectSocket,
    userChats,
    fetchChats
  } = useContext(GlobalContext);

  useEffect(() =>{
    //  connecting all sockets
    fetchChats();
    connectSocket()
  }, [userChats?.length]);
  console.log(userChats.length, "in chat room")

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>🎯</Text>
        <Text style={styles.avatar}>🤦‍♂️</Text>
      </View>
      <View style={styles.searchArea}>
        {/* search bar area for text... */}
        <SearchBar  />
      </View>
      <View style={styles.chatListContainer}>
        {userChats.length > 0 && userChats.map(u => (
          
          <Pressable 
          onPress={() => {
            navigation.navigate("Messages", {
              selecteduser: u.name, 
              id: u.selected_user_id              
            })
          }}
          key={u._id} 
          style={styles.chartCard}>
            <View style={styles.imageSection}>
              <Image style={styles.image} source={{ uri: u.userImage }} />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={
                u.isSeen ? styles.seenMsg : styles.unseenMsg
              }>
                {u.latestMsg}
              </Text>
            </View>
            <View style={u.isSeen ? styles.seen : styles.unseen}></View>
          </Pressable>
        ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#00AFF0"
  },
  logo: {
    fontSize: 30,
  },
  avatar: {
    fontSize: 30,
  },
  searchArea: {
    paddingVertical: 10,
    // backgroundColor: "red",
    height: 60
  },
  chatListContainer: {
    flex: 1,
    padding: 10,
    margin: 2,
  },
  chartCard: {
    flexDirection: "row",
    backgroundColor: "lightgray",
    justifyContent: "space-around",
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: "#29323c"
  },
  seen: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "green",
  },
  unseen: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "white",
  },
  seenMsg: {
    fontWeight: "normal",
    color: "gray"
  },
  unseenMsg: {
    fontWeight: "700",
    color: "#181818"
  }
});
