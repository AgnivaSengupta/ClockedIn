import CircularProgressBar from "@/components/ui/CircularProgressBar";
import CalendarComponent from "@/components/ui/calendar";
import { useAttendanceStore } from "@/store/attendanceStore";
import { useAppStore } from "@/store/useAppStore";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const requiredNoOfDays = (present, total, target) => {
    const required = Math.ceil(((target * total - 100 * present) / (100 - target)));
  
    if (required > 0) {
      // Still need to attend more classes
      return <Text style={styles.subheading}>Need to attend <Text style={styles.highlightText}> {required}  more class </Text></Text>;
    } else {
      // Already above target, calculate safe bunks
      const safeBunks = Math.floor((100 * present - target * total) / target);
      if (safeBunks == 0){
        return <Text style={styles.subheading}>You are right on track.</Text>
      }else { 
        return <Text style={styles.subheading}>You can bunk {safeBunks} class</Text>;
      }
    }
  };

export default function SubjectHistoryPage(){
    const { subjectId } = useLocalSearchParams();
    console.log(subjectId)
    const id = subjectId as string
    const subjects = useAppStore((state) => state.subjects)
    const targetAttendance = useAppStore((state) => state.targetAttendance)

    const subject = subjects.find((s) => s.id == id);
    console.log(subject)

    const attended = subject?.attended
    const total = subject?.total

    const attendance = attended/total

    const getsubjectLogs = useAttendanceStore((state) => state.getLogsBySubject)
    const subjectLogs = getsubjectLogs(id)

    const subjectDateMarkings: {
        [date: string]: {status: "present" | "absent" | "noClass"}
    } = subjectLogs.reduce((acc, log) => {
        acc[log.date] = {status: log.status}
        return acc
    }, {} as { [date: string]: { status: 'present' | 'absent' | 'noClass' } })


    //  required data --> total present, absent and total classes to be shown in graph
    // the required number of classes need to attend to achieve the target attendance
    

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.viewContainer}>
                <Text style={styles.heading}>
                    {subject?.name}
                </Text>

                <View style={{
                    width: "auto",
                    height: 200,
                    borderWidth: 1,
                    borderRadius: 20,
                    borderStyle: "dashed",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 20

                }}>


                    <CircularProgressBar
                        target={targetAttendance}
                        attendance={attendance}
                    />

                    <View style={styles.statsContainer}>
                        <Text style={styles.subheading}>Present: {attended}</Text>
                        <Text style={styles.subheading}>Absent: {total - attended}</Text>
                        
                    </View>

                </View>
                    {requiredNoOfDays(attended, total, targetAttendance)}

                <CalendarComponent initialMarkings={subjectDateMarkings}/>

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
        gap: 20
    },

    heading: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 20,
    },

    subheading: {
        fontWeight: "500",
        fontSize: 20,
        marginBottom: 10,
    },

    subjectListCard: {
        backgroundColor: "#ffffff",
        width: "auto",
        height: 50,
        padding: 5,
        borderRadius: 5
    }, 

    statsContainer: {
        margin: 10,
        //borderWidth: 1,
        width: "40%"
    },
    highlightText: {
        backgroundColor: 'yellow', // The highlight color
        paddingHorizontal: 4, // Optional: for a little padding around the text
        borderRadius: 2, // Optional: for rounded corners
        fontWeight: 'bold', // Optional: to make the text bold
    }

})