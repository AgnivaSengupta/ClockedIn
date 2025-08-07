import { useAppStore } from '@/store/useAppStore';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Subject {
  id: string;
  name: string;
  classDays: number[];
  attended: number;
  total: number;
}

interface AttendanceStatus {
  noClass: boolean;
  absent: boolean;
  present: boolean;
}

interface AttendanceCardProps {
  subject: Subject;
  attendancePercentage: number;
  target: number;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  subject,
  attendancePercentage,
  target,
}) => {
  // const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
  //   noClass: true,
  //   absent: false,
  //   present: false,
  // });

  const radius = 45;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (attendancePercentage / 100) * circumference;

  const markPresent = useAppStore((state) => state.markPresent);
  const markAbsent = useAppStore((state) => state.markAbsent);
  const attendanceRecord = useAppStore((state) => state.attendanceRecord);
  const markNoClass = useAppStore((state) => state.markNoClass);

  // current date
  const today = new Date().toISOString().split('T')[0];

  // current status of the store
  const currentStatus = attendanceRecord[subject.id]?.[today] || null;


  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    noClass: currentStatus === 'noclass',
    absent: currentStatus === 'absent',
    present: currentStatus === 'present',
  });
  

  const handleStatusPress = (status: keyof AttendanceStatus) => {

    const statusKeyMap = {
      present: 'present',
      absent: 'absent',
      noClass: 'noclass',
    };

    if (currentStatus === statusKeyMap[status]) return;
    
    if (status === 'present') {
      markPresent(subject.id, today);
    } else if (status === 'absent') {
      markAbsent(subject.id, today);
    } else if (status === 'noClass') {
      markNoClass(subject.id, today);
    }  
    
    setAttendanceStatus({
      noClass: status === 'noClass',
      absent: status === 'absent',
      present: status === 'present',
    });
  };

  const strokeColor =
    attendancePercentage >= target ? '#51cf66' : '#ff4444';

  const CircularProgress = () => (
    <View style={styles.progressContainer}>
      <Svg height={radius * 2} width={radius * 2} style={styles.progressSvg}>
        {/* Background circle */}
        <Circle
          stroke="#f0f0f0"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <Circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>{attendancePercentage}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{subject.name}</Text>
        </View>
        <CircularProgress />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.noClassButton,
            attendanceStatus.noClass && styles.noClassActive,
          ]}
          onPress={() => handleStatusPress('noClass')}
        >
          <Text
            disabled={attendanceStatus.noClass}
            style={[
              styles.buttonText,
              attendanceStatus.noClass && styles.noClassActiveText,
            ]}
          >
            No Class
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={attendanceStatus.absent}
          style={[
            styles.button,
            styles.absentButton,
            attendanceStatus.absent && styles.absentActive,
          ]}
          onPress={() => {
            handleStatusPress('absent');
          }}
        >
          <Text
            style={[
              styles.buttonText,
              attendanceStatus.absent && styles.absentActiveText,
            ]}
          >
            Absent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={attendanceStatus.present}
          style={[
            styles.button,
            styles.presentButton,
            attendanceStatus.present && styles.presentActive,
          ]}
          onPress={() => {
            handleStatusPress('present');
          }}
        >
          <Text
            style={[
              styles.buttonText,
              attendanceStatus.present && styles.presentActiveText,
            ]}
          >
            Present
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
    marginBottom: 2,
    fontFamily: 'Quantico-regular',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSvg: {
    transform: [{ rotate: '0deg' }],
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noClassButton: {
    backgroundColor: '#f0f0f0',
  },
  noClassActive: {
    backgroundColor: '#ffa500',
  },
  absentButton: {
    backgroundColor: '#f0f0f0',
  },
  absentActive: {
    backgroundColor: '#ff6b6b',
  },
  presentButton: {
    backgroundColor: '#f0f0f0',
  },
  presentActive: {
    backgroundColor: '#51cf66',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#666',
  },
  noClassActiveText: {
    color: '#ffffff',
  },
  absentActiveText: {
    color: '#ffffff',
  },
  presentActiveText: {
    color: '#ffffff',
  },
});

export default AttendanceCard;
