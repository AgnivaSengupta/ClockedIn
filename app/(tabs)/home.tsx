import AttendanceCard from "@/components/ui/attendanceCard";
import Clock from "@/components/ui/clock";
import { useAppStore } from "@/store/useAppStore";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage (){

    const userName = useAppStore((state) => state.userName)
    const subjects = useAppStore((state) => state.subjects);
    const target = useAppStore((state) => state.targetAttendance);

    const [DateMonth, setDateMonth] = useState("")
    const [Day, setDay] = useState("")
    const [year, setYear] = useState("")
    const [DayIndex, setDayIndex] = useState<number>(0)

    const updateDayDate = () => {
        const today = new Date().getDay();
        setDayIndex(today)
        const todayDate = new Date()
        const formattedDay = todayDate.toLocaleString("en-GB", { weekday: "long"})
        setDay(formattedDay)
        const formattedDateMonth = todayDate.toLocaleString("en-GB", {month: "long", day: "numeric"})
        setDateMonth(formattedDateMonth)
        const year = todayDate.toLocaleString("en-GB", {year: "numeric"})
        setYear(year)
    }

    useEffect(() => {
        updateDayDate()

        const interval = setInterval(updateDayDate, 60000)

        return () => clearInterval(interval)
    }, []);

    // filter
    const todaysSubjects = subjects.filter((subject) =>
        subject.classDays.includes(DayIndex)
      );
    
  
    const isFocused = useIsFocused()

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="dark-content" hidden={true} />
            <View style={styles.viewContainer}>
                <Text style={styles.heading}>
                    Hey {userName} 👋
                </Text >
                <Text style={styles.subheading}>
                    Your next classes for today
                </Text>

                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 30
                }}>
                    <View style={styles.timer}>
                        <Clock value={1234} key={isFocused ? "focused" : "blurred"}/>
                    </View>

                    <View>
                        <Text style={{
                            fontSize: 40,
                            fontWeight: "800",
                            
                        }}>
                            {Day}
                        </Text>

                        <Text style={{
                            fontSize:30,
                            fontWeight: "800" ,
                            display: "flex",
                            flexWrap: "wrap"
                        }}>
                            {DateMonth}
                        </Text>

                        <Text style={{
                            fontSize:60,
                            fontWeight: "800" ,
                            display: "flex",
                            flexWrap: "wrap",
                            opacity: 0.5
                        }}>
                            {year}
                        </Text>
                    </View>
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
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image
                            source={require("../../assets/images/NO_CLASS.png")}
                            style={{ width: 350, height: 350, resizeMode: "contain" }}
                            />
                            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: "500" }}>No classes today 🎉</Text>
                        </View>
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        //height: 250,
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