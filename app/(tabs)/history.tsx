import CalendarComponent from "@/components/ui/calendar";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";


const dummyInitialMarkings: { [date: string]: { status: "present" | "absent" | "noClass"; }; } = {
    // Now explicitly typing the status property
    '2025-08-01': {
      status: 'present', // This is a literal string, not a generic string
    },
    '2025-08-02': {
      status: 'absent',
    },
    '2025-08-03': {
      status: 'noClass',
    },
  };
export default function HistoryPage (){

    // Present Date calculation
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    const formatteDate = `${year}-${month}-${day}`

    const initDate = formatteDate;
    const [selected, setSelected] = useState(initDate);

    const marked = useMemo(() => ({
        [selected]: {
            customStyles: {
                container: {
                    backgroundColor: "#0F0E0E",
                    borderRadius: 7
                }, 
                text: {
                    color: "#ffffff"
                }
            }
        }
    }), [selected])


    const subjects = useAppStore((state) => state.subjects);
    const router = useRouter();

    console.log(subjects)

    return (
        // the marked boolean gives a circular selected style only
        // for custom styles --> use customStyles prop

        // Required custom styles => 
            // 1. Present --> {container: {backgroundColor: "#A2E950", borderRadius: 7}, text: {color: "black"}}  
            // 2. Absent --> {container: {backgroundColor: "#FF2929", borderRadius: 7}, text: {color: "black"}}
            // 3. No Class / cancelled class --> {container: {backgroundColor: "#E5A800", borderRadius: 7}, text: {color: "black"}}
            // 4. current Date --> {container: {backgroundColor: "#0F0E0E", borderRadius: 7}, text: {color: "black"}}
            // 5. default --> {container: {backgroundColor: "#FFFFFF", borderRadius: 7}, text: {color: "black"}}

        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.viewContainer}>
                <Text style={styles.heading}>Subject History</Text>
                {/* <Calendar
                    initialDate={initDate}
                    markingType="custom"
                    markedDates={marked}
                    onDayPress={(day) => 
                        setSelected(day.dateString)
                    }
                    theme= {{
                        calendarBackground: "transparent",
                        textDayFontWeight: 700,
                        textMonthFontWeight: 900,
                        textMonthFontSize: 16,
                        textDisabledColor: "grey",
                        textDayHeaderFontWeight: 700,
                        stylesheet: {
                            calendar: {
                                header: {
                                    dayTextAtIndex0: {
                                        color: 'red'
                                      },
                                      dayTextAtIndex6: {
                                        color: 'green'
                                      }
                                }
                            }
                        }
                    }}
                /> */}

                {/* <CalendarComponent initialMarkings={dummyInitialMarkings}/> */}

                    <View style={{
                        flexDirection: "column",
                        gap: 5
                    }}>
                        {subjects.map((subject, index) => (
                            <Pressable onPress={() => router.push(`/subject-history/${subject.id}`)}>
                                <View key={subject.id} style={styles.subjectListCard}>
                                    <Text style={styles.subjectHeading}>{subject.name}</Text>
                                    <Text style={styles.subjectSubHeading}>Attendance: {subject.attended}/{subject.total} </Text>
                                </View>
                            </Pressable>
                        ) )}
                    </View>
                

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

    subjectListCard: {
        backgroundColor: "#292623",
        width: "auto",
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        display: "flex",
        gap: 8
    },

    subjectHeading: {
        fontWeight: 700,
        fontSize: 22,
        color: "white"
    },

    subjectSubHeading: {
        fontSize: 14,
        fontWeight: 400,
        color: "white"
    }
})

