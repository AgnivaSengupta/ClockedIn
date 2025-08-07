import AttendanceCard from "@/components/ui/attendanceCard";
import { useAppStore } from "@/store/useAppStore";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage (){

    const userName = useAppStore((state) => state.userName)
    const subjects = useAppStore((state) => state.subjects);
    const target = useAppStore((state) => state.targetAttendance);

    const today = new Date().getDay();

    // filter
    const todaysSubjects = subjects.filter((subject) =>
        subject.classDays.includes(today)
      );
    
  
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.viewContainer}>
                <Text style={styles.heading}>
                    Hey {userName} 👋
                </Text >
                <Text style={styles.subheading}>
                    Your next classes for today
                </Text>

                <View style={styles.timer}>

                </View>

                <ScrollView contentContainerStyle={{
                    gap:20
                }}>
                    {todaysSubjects.length > 0 ? (
                        todaysSubjects.map((subject) => {
                            const attendancePercentage = subject.total === 0
                                ? 0
                                : Math.round((subject.attended / subject.total) * 100);
                            return (
                                <AttendanceCard
                                    key={subject.id}
                                    subject={subject}
                                    attendancePercentage={attendancePercentage}
                                    target={target}
                                />
                            );
                        })
                    ) : (
                        <Text style={{ marginTop: 20, fontSize: 16 }}>No classes today 🎉</Text>
                    )}
                </ScrollView>
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