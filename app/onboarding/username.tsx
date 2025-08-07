import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserName(){

    const [name, setName] = useState("");
    const router = useRouter();

    const storeUserName = useAppStore((state) => state.setUserName)

    return (
        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.viewContainer}>

                <View>
                    <Text style={[styles.heading, { fontFamily: 'Quantico-Bold' }]}>
                        Hi, What should we call you ?
                    </Text>

                    <TextInput 
                        style={styles.input}
                        onChangeText={text => setName(text)}
                        value={name} 
                        placeholder="Username"
                    />
                </View>


                <View style={styles.imageContainer}>
                    <Image
                        // Replace this with the path to your image
                        source={require('../../assets/images/usernamePage-Hi(2).png')}
                        style={styles.image}
                    />
                </View>

                <Pressable 
                    style={styles.button}
                    onPress = {()=> {
                        storeUserName(name);
                        router.push("/onboarding/Schedule")
                    }}
                >
                    <Text style={styles.buttonText}>
                        Next
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safecontainer: {
        backgroundColor: "#E8E1D9",
        flex: 1,
    },

    viewContainer:{
        display:"flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 20,
    },

    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#FDF5E6",
        borderStyle: "dashed"
    },

    heading: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 20,
    },

    button: {
        width: "auto",
        paddingVertical: 12,
        paddingHorizontal:12,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 20,
        display:"flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 14
    },
    image: {
        width: 350, // Set the desired width
        height: 550, // Set the desired height
        resizeMode: 'contain', // Ensures the image fits within the dimensions
    },
    imageContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        transform: [{ translateX: 60 }],

    }
}

)