import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from '@/store/useAppStore';

type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;
const HEADER_HEIGHT = 20;


export const BottomSheet = ({ isVisible, onClose, children }) => {
    const translateY = useSharedValue(SHEET_HEIGHT);
    const opacity = useSharedValue(0);
  
    const openSheet = () => {
      translateY.value = withSpring(0, {
        damping: 50,
        stiffness: 300,
        mass: 0.8,
      });
    };
  
    const closeSheet = () => {
      translateY.value = withSpring(SHEET_HEIGHT, {
        damping: 50,
        stiffness: 300,
        mass: 0.8,
      });
      // fade slightly after movement starts
      runOnJS(onClose)();
    };
  
    useEffect(() => {
      if (isVisible) {
        openSheet();
      } else {
        closeSheet();
      }
    }, [isVisible]);
  
    const panGesture = Gesture.Pan()
      .onChange((event) => {
        translateY.value = Math.max(0, event.translationY);
      })
      .onEnd((event) => {
        const shouldClose =
          event.velocityY > 500 || event.translationY > SHEET_HEIGHT / 3;
        if (shouldClose) {
          closeSheet();
        } else {
          openSheet();
        }
      });
  
    const backdropStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
  
    const sheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));
  
    if (!isVisible) return null;
  
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={closeSheet}
            activeOpacity={1}
          />
        </Animated.View>
  
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <View style={styles.header}>
              <View style={styles.handle} />
            </View>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  };  

export const ScheduleForm = ({ onClose }) => {
  //const [selectedService, setSelectedService] = useState('Check Up');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [teacher, setTeacher] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [attended, setAttended] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const days: DayName[][] = [
    ["Monday", "Tuesday", "Wednesday"],
    ["Thursday", "Friday", "Saturday"],
    ["Sunday"]
  ];

  const dayNumbers: Record<DayName, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  //const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const addSubject = useAppStore((state) => state.addSubject)
  const removeSubject = useAppStore((state) => state.removeSubject);
  const subjects = useAppStore((state) => state.subjects)

  const handleAddsubject = () => {
    try {
        if (subjectName.trim() !== '' && subjects.map((subject) => {subject.name.toLowerCase() !== subjectName.toLowerCase()})){
            const newId = Date.now().toString();
            const newSubject = {
                id: newId,
                name: subjectName,
                teacher: teacher,
                classDays: selectedDays, 
                attended: attended,
                total: total,
            }
                        
            addSubject(newSubject);

            setSubjectName('');
            setAttended(0);
            setTotal(0);
        } 
        
    } catch (error) {
        console.log("Error: The subject failed to get added.")
    }
    
  } 

  const handleSave = () => {
    // Save logic here
    // console.log('Saving schedule:', { selectedService, title, selectedTime });
    const data = {
        subject: subjectName,
        teacher: teacher,
        days: selectedDays,
        attended,
        total
    }

    console.log(data);
    handleAddsubject();
    onClose();
  };


          // New handler function to parse attended classes
          const handleAttendedChange = (text: string) => {
            const num = parseInt(text, 10);
            if (!isNaN(num)) {
                setAttended(num);
            } else if (text === '') {
                setAttended(0);
            }
        };
    
        // New handler function to parse total classes
        const handleTotalChange = (text: string) => {
            const num = parseInt(text, 10);
            if (!isNaN(num)) {
                setTotal(num);
            } else if (text === '') {
                setTotal(0);
            }
        };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Add new subject</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Subject Name</Text>
        <TextInput
          style={styles.titleInput}
          value={subjectName}
          onChangeText={setSubjectName}
          placeholder="Enter name"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Teacher</Text>
        <TextInput
          style={styles.titleInput}
          value={teacher}
          onChangeText={setTeacher}
          placeholder="Subject teacher name"
        />
      </View>

      <View style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row"
      }}>
        <View style={styles.section}>
        <Text style={styles.sectionLabel}>Classes Attended</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.titleInput}
            value={(attended !== undefined && attended !== 0) ? String(attended) : "" }
            onChangeText={handleAttendedChange}
            placeholder="Classes attended"
            />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Total Classes</Text>
            <TextInput
            keyboardType='numeric'
            style={styles.titleInput}
            value={(attended !== undefined && total !== 0) ? String(total) : "" }
            onChangeText={handleTotalChange}
            placeholder="Total Classes"
            />
      </View>

      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Class days</Text>
        <View style={styles.timeGrid}>
          {days.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.timeRow}>
              {row.map((day) => {
              const dayNum = dayNumbers[day]
              return (
                <TouchableOpacity
                  key={dayNum}
                  style={[
                    styles.timeButton,
                    selectedDays.includes(dayNum) && styles.timeButtonActive
                  ]}
                      onPress={() => setSelectedDays((prev) =>
                          prev.includes(dayNum)
                              ? prev.filter((d) => d !== dayNum)
                              : [...prev, dayNum]

                      )}
                >
                  <Text style={[
                    styles.timeButtonText,
                    selectedDays.includes(dayNum) && styles.timeButtonTextActive
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              )})}
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const BottomSheetComponent = () => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const openBottomSheet = () => setIsBottomSheetVisible(true);
  const closeBottomSheet = () => setIsBottomSheetVisible(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E1D9" />
      
      {/* Main Screen */}
      <View style={styles.mainScreen}>
        

        <TouchableOpacity 
          style={styles.addButton}
          onPress={openBottomSheet}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet 
        isVisible={isBottomSheetVisible}
        onClose={closeBottomSheet}
      >
        <ScheduleForm onClose={closeBottomSheet} />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainScreen: {
    flex: 1,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  searchIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    borderRadius: 12,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#ff4444',
    borderRadius: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
  },
  scheduleHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scheduleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  scheduleDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
    lineHeight: 24,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  serviceButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  serviceButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  serviceButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  serviceButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  serviceButtonTextActive: {
    color: 'white',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
  },
  assignContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  doctorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  doctorAvatar: {
    width: 24,
    height: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  doctorName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  removeButton: {
    padding: 2,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#999',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  timeGrid: {
    gap: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default BottomSheetComponent;