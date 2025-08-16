import { BottomSheet, ScheduleForm } from "@/components/ui/bottomSheet";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule() {

    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

    const openBottomSheet = () => setIsBottomSheetVisible(true);
    const closeBottomSheet = () => setIsBottomSheetVisible(false);

    const subjects = useAppStore((state) => state.subjects)

    return (
        <GestureHandlerRootView>
            <StatusBar barStyle="dark-content" backgroundColor="#E8E1D9" />
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.viewContainer}>
                    <Text style={styles.heading}>Enter your Schedule: </Text>
                    {/* <Scheduler/> */}

                    {subjects.length == 0 ? (
                        <View style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 80,
                            width: "auto",
                            borderColor: "black",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderStyle: "dashed"
                        }}>
                            <Text style={{
                                fontWeight: 500,
                                fontSize: 18,
                                color: "grey"
                            }}>
                                Add a subject
                            </Text>
                        </View>)

                        : <ScrollView contentContainerStyle={styles.subjectList}>
                            {subjects.map((subject) => (
                                <View key={subject.id} style={styles.subjectCard}>
                                    <Text>{subject.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    }


                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={openBottomSheet}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>


                    <Pressable
                        style={styles.nextButton}
                        onPress={() => {
                            router.push("/onboarding/target")
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Next
                        </Text>
                    </Pressable>
                </View>
                <BottomSheet
                    isVisible={isBottomSheetVisible}
                    onClose={closeBottomSheet}
                >
                    <ScheduleForm onClose={closeBottomSheet} />
                </BottomSheet>
            </SafeAreaView>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: "#E8E1D9",
        flex: 1,
    },
    viewContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: 20,
    },
    heading: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 50,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        width: 56,
        height: 56,
        backgroundColor: '#4CAF50',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    addButtonText: {
        fontSize: 28,
        color: 'white',
        fontWeight: '300',
        lineHeight: 28,
    },

    nextButton: {
        position: "absolute",
        bottom: 30,
        right: 40, // need to make it dynamic with screen size
        width: 350,
        paddingVertical: 20,
        paddingHorizontal: 12,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        width: "auto",
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 16
    },

    subjectCard: {
        width: "auto",
        height: 100,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20, 
        borderRadius: 20
    },

    subjectList: {
        display: "flex",
        flexDirection: "column",
        gap: 10
    }
})