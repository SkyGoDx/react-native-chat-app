import React, { useContext, useState } from 'react';
import {
    KeyboardAvoidingView,
    View,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    TouchableHighlight,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GlobalContext } from '../context';
import { getRequest } from '../useApihook';
import SearchResults from './SearchResults';

const SearchBar = () => {
    const {
        username,
        setUsername,
    } = useContext(GlobalContext);
    const [searchData, setSearchData] = useState([]);

    async function handleSearch() {
        const [e1, data] = await getRequest(
            "user/s", `username=${username}`
        );
        if (e1) return alert(e1);
        if (data.result >= 1) {
            return setSearchData(data.list);
        } else {
            // no use found
            return setSearchData(["Username Not Found..."])
        }
    }
    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.keywordArea}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={setUsername}
                        style={styles.input}
                        placeholder='Enter username to search user...'
                    />
                </View>
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchButton}>
                    <Icon
                        name="account-search"
                        size={20}
                        color="#FFFF" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
            {
                searchData.length > 0 && typeof searchData[0] !== "string" &&
                <View style={styles.searchResults}>
                    <View style={styles.modalInfo}>
                        <Text style={{
                            fontWeight: 800
                        }}>
                            People you may know!
                        </Text>
                        <TouchableHighlight
                            onPress={() => setSearchData([])}
                            style={styles.closeButton}>
                            <Icon
                                style={styles.closeIcon}
                                name='close-circle-outline'
                                size={20}
                                color="red"
                            />
                        </TouchableHighlight>

                    </View>
                    <SearchResults
                        results={searchData}
                    />
                </View>
            }
        </>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    keywordArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    inputContainer: {
        flex: 1,
        marginRight: 10
    },
    searchButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5
    },
    input: {
        flex: 1,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 10
    },
    modalInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    searchResults: {
        backgroundColor: "white",
        padding: 10,
        marginBottom: 10,
        zIndex: 999,
        height: 200,
        margin: 10,
        borderRadius: 10,
    },
    closeButton: {
        padding: 5,
        marginRight: 5,
    },
    closeIcon: {
        textAlign: "right",
        marginBottom: 9,
        fontSize: 30,
    }
});
