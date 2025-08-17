import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window")

export default function target(){
    const router = useRouter();

    const setTargetAttendance = useAppStore((state) => state.setTargetAttendance);

    const [target, setTarget] = useState<string>('')

    const handleAddTarget = (text: string) => {
        //const num = parseInt(text, 10);
        // if (!isNaN(num)) {
        //     setTarget(num);
        // } else if (text === '') {
        //     setTarget(75);
        // }

        const numStr = target.trim() === '' ? '75' : target;
        setTarget(numStr)
        //const finalTarget = isNaN(num) ? 75 : num;
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
                    setTargetAttendance(parseInt(target, 10))
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
    }
})