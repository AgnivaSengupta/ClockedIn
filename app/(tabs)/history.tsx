import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HistoryPage (){
    return (

        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.viewContainer}>
                <Text> This is history Page </Text>
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
        padding: 20,
    },

    heading: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 20,
    },

    subheading: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
    },

    timer: {
        width: "auto",
        height: 150,
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 10, 
        marginBottom: 20
    },
    wrapper: {
        borderWidth: 1,
        padding: 0
    }

})