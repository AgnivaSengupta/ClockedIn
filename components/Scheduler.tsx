import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";



const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const _spacing = 10;
const _color = "#ececec"
const _borderRadius = 16;

const getDayNumber = (dayString) => {
    return weekDays.indexOf(dayString);
}

function DayBlock ({day}){

    const [newSubjectName, setNewSubjectName] = useState('');
    const [attended, setAttended] = useState(0);
    const [total, setTotal] = useState(0);
    const addSubject = useAppStore((state) => state.addSubject);
    const subjects = useAppStore((state) => state.subjects);

    // subjects for the particular day
    const subjectsForThisDay = subjects.filter(subject => 
        subject.classDays.includes(getDayNumber(day))
    );

        // New handler function to parse attended classes
        const handleAttendedChange = (text) => {
            const num = parseInt(text, 10);
            if (!isNaN(num)) {
                setAttended(num);
            } else if (text === '') {
                setAttended(0);
            }
        };
    
        // New handler function to parse total classes
        const handleTotalChange = (text) => {
            const num = parseInt(text, 10);
            if (!isNaN(num)) {
                setTotal(num);
            } else if (text === '') {
                setTotal(0);
            }
        };

    const handleAddSubject = () => {
        if (newSubjectName.trim() !== ''){
            const newId = Date.now().toString();
            const newSubject = {
                id: newId,
                name: newSubjectName,
                classDays: [getDayNumber(day)], // The class is only on this day
                attended: attended,
                total: total,
            };


            
            addSubject(newSubject);

            setNewSubjectName('');
            setAttended(0);
            setTotal(0);
        }

    }



    return (
        <View style={styles.dayBlockContainer}>
            <Text style={styles.dayBlockText}>Add a Subject: </Text>
            <TextInput 
                style={styles.input}
                onChangeText={setNewSubjectName}
                value={newSubjectName}
                placeholder="Subject name"
            />

            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10
            }}>
                <TextInput 
                    style={[styles.input, {width: "45%"}]}
                    placeholder="Attended classes"
                    keyboardType="numeric"  
                    onChangeText={handleAttendedChange}
                    value={String(attended)} 
                />
                <TextInput 
                    style={[styles.input, {width: "45%"}]}
                    placeholder="Total classes"
                    keyboardType="numeric"  
                    onChangeText={handleTotalChange}
                    value={String(total)}     
                />
            </View>

            <Pressable
                style={styles.addButton}   
                onPress={handleAddSubject}
            >
                <Text style={styles.addButtonText}>Add Subject</Text>
            </Pressable>

            {subjectsForThisDay.length > 0 && (
                <View style={styles.addedSubjectsContainer}>
                    <Text style={styles.listHeading}>Subjects for {day}:</Text>
                    {subjectsForThisDay.map((subject, index) => (
                        <Text key={subject.id} style={styles.subjectItem}>
                            - {subject.name}
                        </Text>
                    ))}
                </View>
            )}

        </View>
    )
}

function Day ({ day }: { day : (typeof weekDays)[number] }){

    const [isOn, setIsOn] = useState(false);

    return (
        <View 
            style={[styles.dayViewContainer, {backgroundColor: isOn ? "transparent" : _color,}]}
        >
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Text style={styles.dayHeader}>
                    {day}
                </Text>
                <Switch
                 value={isOn}
                 onValueChange={(value) => setIsOn(value)}
                 />
            </View>

            {isOn && <DayBlock day={day}/>}

        </View>
    )
}

export function Scheduler(){
    const router = useRouter();
    return (
        <ScrollView contentContainerStyle={{
            padding: _spacing,
            gap: _spacing
        }} >
            {weekDays.map((day) => (
                <Day day={day} key={`day-${day}`}/>
            ))}

            <Pressable
                style={styles.button}
                onPress={() => {
                    router.push("/onboarding/target")
                }}
            >
                <Text style={styles.buttonText}>
                    Next
                </Text>
            </Pressable>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    dayViewContainer: {
        borderWidth: 1,
        borderColor: _color,
        borderRadius: _borderRadius,
        padding: _spacing,
    },
    dayHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: "bold",
        fontSize: 18
    },
    dayBlockContainer: {
        marginTop: _spacing,
        paddingTop: _spacing,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    dayBlockText: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: _borderRadius
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        borderRadius: _borderRadius,
    },

    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addedSubjectsContainer: {
        marginTop: _spacing,
    },
    listHeading: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subjectItem: {
        paddingLeft: _spacing,
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
        alignItems: "center",
        marginTop: 100
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 14
    },
});