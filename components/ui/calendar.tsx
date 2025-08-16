import { useAttendanceStore } from "@/store/attendanceStore";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

interface CalendarComponentProps {
    initialMarkings: {
        [date: string]: {
            status: "present" | "absent" | "noClass" 
        }
    }
}

type DateMarking= {
    status: 'present' | 'absent' | 'noClass' | "selected"
}

const markingStyles = {
    present: {
        container: {
            backgroundColor: "#A2E950",
            borderRadius: 7
        },
        text: {
            color: "black"
        }
    },

    absent: {
        container: {
            backgroundColor: "#FF2929", 
            borderRadius: 7
        }, 
        text: {
            color: "black"
        }
    },

    noClass: {
        container: {
            backgroundColor: "#E5A800", 
            borderRadius: 7
        }, 
        text: {
            color: "black"
        }
    },

    selected: {
        container: {
            backgroundColor: "#0F0E0E", 
            borderRadius: 7
        }, 
        text: {
            color: "black"
        }
    }
}


export default function CalendarComponent({ initialMarkings } : CalendarComponentProps) {

    const [selected, setSelected] = useState('');

    const marked: MarkedDates = useMemo(() => {
        const newMarking: MarkedDates = {};

        for (const date in initialMarkings){
            const status = initialMarkings[date].status;
            newMarking[date] = {
                customStyles: markingStyles[status]
            }
        }

        if (selected){
            newMarking[selected] = {
                customStyles: markingStyles.selected
            }
        }

        return newMarking;
    }, [initialMarkings, selected])

    return (
        <View>
            <Calendar
                markingType="custom"
                markedDates={marked}
                onDayPress={(day) =>
                    setSelected(day.dateString)
                }
                theme={{
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
            />
        </View>
    )
}


const styles = StyleSheet.create({

    viewContainer: {
        display: "flex",
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

})

