import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableHighlight
} from 'react-native'
let imageUrl = "https://img.freepik.com/free-photo/3d-render-little-boy-with-eyeglasses-blue-shirt_1142-50994.jpg?t=st=1708664899~exp=1708668499~hmac=cabf177acbebe07016de6be90598c7654dd34095cf8f91a50bb115080edbae6a&w=740";

const SearchResults = ({ results, navigate }) => {

    return (
        <>
            {results.map(item => (
                <TouchableHighlight
                onPress={() => {
                    navigate("Messages"), {
                        selecteduser: item.username,
                        id: item.user_id
                    }
                }}
                key={item._id}
                style={styles.searchCard}>
                    <Image
                    style={styles.userImage}
                    source={{ uri: item.imageUrl || imageUrl}}
                    />
                    <Text style={styles.username}>{item.username}</Text>
                </TouchableHighlight>
            ))}
        </>
    )
}
export default SearchResults

const styles = StyleSheet.create({
    searchCard: {
        padding: 10,
        backgroundColor: "lightgray",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 5,
        justifyContent: "flex-start"
    },
    username: {
        fontSize: 20,
        color: "black",
        marginLeft: 10,
        fontWeight: "900"
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 100
    }
})