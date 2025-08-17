import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Image } from "react-native";
import Animated, { FadeInUp, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native"

const { width } = Dimensions.get("window");

export default function UserName(){

    const [name, setName] = useState("");
    const router = useRouter();

    const storeUserName = useAppStore((state) => state.setUserName)

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}]
        }
    })

    return (
        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.viewContainer}>

                <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
                    <Text style={[styles.heading, { fontFamily: 'Quantico-Bold' }]}>
                        Hi, What should we call you ?
                    </Text>

                    <TextInput 
                        style={styles.input}
                        onChangeText={text => setName(text)}
                        value={name} 
                        placeholder="Username"
                    />
                </Animated.View>


                <View style={styles.imageContainer}>
                    <Image
                        // Replace this with the path to your image
                        source={require('../../assets/images/usernamePage-Hi(2).png')}
                        style={styles.image}
                    />
                </View>

                <Pressable 
                    // style={styles.button}
                    disabled={!name.trim()}
                    onPressIn={() => {
                        if (!name.trim()) return;
                        scale.value = withSpring(0.95, {damping: 10, stiffness: 200})
                    }}

                    onPressOut={() => {
                        if (!name.trim()) return;
                        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
                      }}

                    onPress = {()=> {
                        console.log("Button pressed!")
                        if (!name.trim()) return;
                        try {
                            storeUserName(name);
                            console.log("Username stored successfully");
                        } catch (error) {
                            console.error("Store error:", error);
                            return; // Don't navigate if store fails
                        }
                        
                        router.push("/onboarding/Schedule");
                    }}
                >
                    <Animated.View
                        entering={FadeInUp.delay(400)}
                        style={[
                            styles.button, 
                            animatedStyle,
                            {backgroundColor: name.trim() ? "black" : "gray"}
                        ]}
                    >

                        <Text style={styles.buttonText}>
                            Next
                        </Text>
                    </Animated.View>
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
        height: 70,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#FDF5E6",
        borderStyle: "dashed",
    },

    heading: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 20,
    },

    button: {
        position: "absolute",
        bottom: 20,
        //right: 40, // need to make it dynamic with screen size
        width: width * 0.85,
        alignSelf: "center",
        paddingVertical: 15,
        paddingHorizontal: 12,
        backgroundColor: "black",
        opacity: 0.8,
        elevation: 2,
        borderRadius: 25,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontWeight: "400",
        fontSize: 22,
        color: "white"
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

    },

}

)