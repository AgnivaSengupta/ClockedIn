import { Scheduler } from "@/components/Scheduler";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule (){
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.viewContainer}>
                <Text style={styles.heading}>Enter your Schedule: </Text>
                <Scheduler/>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: "#E8E1D9",
        flex: 1,
    },
    viewContainer:{
        display:"flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 20,
    },
    heading: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 50,
    },
})