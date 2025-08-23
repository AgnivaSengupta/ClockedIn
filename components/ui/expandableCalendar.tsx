import { generateMonthMatrix, generateWeek } from "@/utils/calendarUtils";
import dayjs from "dayjs";
import { View } from "moti";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    useAnimatedGestureHandler,
} from "react-native-reanimated";

interface ExpandableCalendarProps {
    currentDate: dayjs.Dayjs;
    setCurrentDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    expanded: boolean;
    toggleExpand: () => void;
    currentMonth: dayjs.Dayjs;
    setSelectedDate: (val: number) => void;
}

interface ExpandableCalendarWrapperProps {
    currentDate: dayjs.Dayjs;
    setCurrentDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    expanded: boolean;
    setExpanded: (val: boolean) => void;
    currentMonth: dayjs.Dayjs;
    setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    setSelectedDate: (val: number) => void;
}

type ContextType = {
    startY: number;
    startHeight: number;
};

export function ExpandableCalendar({ currentDate, setCurrentDate, expanded, toggleExpand, currentMonth, setSelectedDate } : ExpandableCalendarProps) {
    // Use currentMonth for full calendar, currentDate for week view
    const weeks = expanded ? generateMonthMatrix(currentMonth) : [generateWeek(currentDate)];
  
    return (
        <Pressable onPress={toggleExpand}>
            <View style={styles.calendar}>
                {weeks.map((week, wi) => (
                    <View key={wi} style={styles.weekRow}>
                        {week.map((date, di) => {
                            const isToday = date.isSame(dayjs(), "day");
                            const isSelected = date.isSame(currentDate, "day");
                            const isCurrentMonth = date.month() === currentMonth.month();
                            return (
                                <Pressable
                                    key={di}
                                    onPress={() => {
                                        setCurrentDate(date)
                                        setSelectedDate(date.day())
                                    }}
                                    style={[
                                        styles.day,
                                        isSelected && styles.selectedDay,
                                        isToday && !isSelected && styles.today
                                    ]}
                                >
                                    <Text style={[
                                        isSelected ? styles.selectedText : styles.dayText,
                                        !isCurrentMonth && expanded && styles.inactiveDay
                                    ]}>
                                        {date.date()}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                ))}
            </View>
        </Pressable>
    );
}

const COLLAPSED_HEIGHT = 60;  // strip view height
const EXPANDED_HEIGHT = 270;  // full calendar height

export default function ExpandableCalendarWrapper({currentDate, setCurrentDate, expanded, setExpanded, currentMonth, setCurrentMonth, setSelectedDate}: ExpandableCalendarWrapperProps){
    const height = useSharedValue(COLLAPSED_HEIGHT);

    useEffect(() => {
        height.value = withTiming(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, { duration: 300 });
    }, [expanded]);

    // Weekdays Header Component
    const WeekdaysHeader = () => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <View style={styles.weekdaysHeader}>
                {weekdays.map((day, index) => (
                    <Text key={index} style={styles.weekdayText}>{day}</Text>
                ))}
            </View>
        );
    };

    // Month navigation functions
    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    const gestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        ContextType
    >({
        onStart: (_, ctx) => {
            // Store the current height at gesture start
            ctx.startHeight = height.value;
            ctx.startY = 0; // Reset startY
        },
        onActive: (event, ctx) => {
            // Calculate new height based on gesture translation
            // Note: translationY is positive when dragging down, negative when dragging up
            let newHeight = ctx.startHeight + event.translationY;
            
            // Clamp the height between min and max values
            newHeight = Math.min(Math.max(newHeight, COLLAPSED_HEIGHT), EXPANDED_HEIGHT);
            height.value = newHeight;
        },
        onEnd: (event) => {
            const velocity = event.velocityY;
            const translation = event.translationY;
            
            // Determine final state based on gesture
            let shouldExpand = expanded;
            
            // If there's significant velocity, use that to determine direction
            if (Math.abs(velocity) > 500) {
                shouldExpand = velocity > 0; // Positive velocity = dragging down = expand
            }
            // Otherwise, use translation threshold
            else if (Math.abs(translation) > 30) {
                if (translation > 30 && !expanded) {
                    shouldExpand = true; // Dragged down significantly from collapsed = expand
                } else if (translation < -30 && expanded) {
                    shouldExpand = false; // Dragged up significantly from expanded = collapse
                }
            }
            // If no significant movement, snap to nearest state
            else {
                const midpoint = (EXPANDED_HEIGHT + COLLAPSED_HEIGHT) / 2;
                shouldExpand = height.value > midpoint;
            }
            
            // Update the state
            runOnJS(setExpanded)(shouldExpand);
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        overflow: 'hidden',
    }));

    return (
        <View style={styles.wrapper}>
            {/* Month Header */}
            <View style={styles.monthHeader}>
                <Pressable onPress={goToPreviousMonth} style={styles.navButton}>
                    <Text style={styles.navButtonText}>‹</Text>
                </Pressable>
                
                <Pressable onPress={() => setExpanded(!expanded)} style={styles.monthTitleContainer}>
                    <Text style={styles.monthTitle}>
                        {currentMonth.format('MMMM YYYY')}
                    </Text>
                    <Text style={[styles.expandIcon, { transform: [{ rotate: expanded ? '180deg' : '0deg' }] }]}>
                        ▼
                    </Text>
                </Pressable>
                
                <Pressable onPress={goToNextMonth} style={styles.navButton}>
                    <Text style={styles.navButtonText}>›</Text>
                </Pressable>
            </View>

            {/* Weekdays Header - only show when expanded */}
            {expanded && <WeekdaysHeader />}

            {/* Calendar with Gesture Handler */}
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[animatedStyle, styles.container]}>
                    <ExpandableCalendar
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        expanded={expanded}
                        toggleExpand={() => setExpanded(!expanded)}
                        currentMonth={currentMonth}
                        setSelectedDate={setSelectedDate}
                    />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#E8E1D9",
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
    },
    navButton: {
        padding: 8,
        borderRadius: 20,
        minWidth: 32,
        alignItems: 'center',
    },

    navButtonText: {
        fontSize: 28,
        color: 'black',
        fontWeight: '900',
    },
    monthTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
    },
    expandIcon: {
        fontSize: 12,
        color: '#666',
    },
    weekdaysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderBottomWidth: 0.8,
        borderBottomColor: 'black',
    },
    weekdayText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666',
        width: 40,
        textAlign: 'center',
    },
    container: {
        // Container for the animated calendar
    },
    calendar: { 
        backgroundColor: "transparent", 
        borderRadius: 0, 
        padding: 8,
        minHeight: COLLAPSED_HEIGHT,
    },
    weekRow: { 
        flexDirection: "row", 
        justifyContent: "space-around", 
        marginBottom: 4 
    },
    day: { 
        padding: 8, 
        borderRadius: 20, 
        alignItems: "center", 
        width: 40 
    },
    selectedDay: { 
        backgroundColor: "#292623" 
    },
    today: { 
        borderWidth: 1, 
        borderColor: "black",
        borderStyle:  "dashed"
    },
    dayText: { 
        color: "black",
        fontSize: 15 
    },
    selectedText: { 
        color: "white", 
        fontWeight: "bold" 
    },
    inactiveDay: {
        color: '#bbb',
    },
});