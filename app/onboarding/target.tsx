import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function target(){
    const router = useRouter();

    const setTargetAttendance = useAppStore((state) => state.setTargetAttendance);

    const [target, setTarget] = useState(75)

    const handleAddTarget = (text) => {
        const num = parseInt(text, 10);
        if (!isNaN(num)) {
            setTarget(num);
        } else if (text === '') {
            setTarget(75);
        }
    };
    return (

        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.viewContainer}>

                <View>
                    <Text style={styles.heading}>
                        Enter your Target Attendance percentage
                    </Text>

                    <TextInput 
                            style={styles.input}
                            placeholder="75 (default)"
                            keyboardType="numeric"  
                            onChangeText={handleAddTarget}
                            value={String(target)} 
                    />
                </View>

                <Pressable
                 style={styles.button}
                 onPress={()=> {
                    setTargetAttendance(target)
                    router.replace("/(tabs)/home")
                 }}
                 >
                    <Text style={styles.buttonText}>
                        Submit
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
        fontSize: 28,
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
})