import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G } from "react-native-svg";
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  withSequence,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import ProgressLine from "./ProgressLine";
import {
  CENTER,
  LINE_COUNT,
  SIZE,
  STROKE_WIDTH,
} from "../../constants/progressCircle";
import { SCREEN_WIDTH } from "../../constants/window";


const svgHeight = SIZE + STROKE_WIDTH * 10; // Increased height to prevent overflow


const CircularProgressBar = ({target = 75, attendance = 0}) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);


useEffect(() => {
    scale.value = withSequence(withTiming(0.9), withTiming(1));

    progress.value = withTiming(attendance, { duration: 2000 });
  }, [attendance, target]);

  // Create a derived value to display as text
  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}%`;
  });


  return (
    <>
      <View style={styles.container}>
        <Svg
          width={SCREEN_WIDTH}
          height={svgHeight}
          viewBox={`0 -${STROKE_WIDTH * 5} ${SIZE} ${svgHeight}`}
          style={styles.svg}
        >
          <G origin={`${CENTER}, ${CENTER + STROKE_WIDTH * 5}`}>
            {Array.from({ length: LINE_COUNT }).map((_, index) => (
              <ProgressLine key={index} {...{ progress, index, target }} />
            ))}
          </G>
        </Svg>
        <View style={styles.progressContainer}>
          <ReText style={styles.text} text={progressText} />
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    alignItems: "center",
    //borderWidth: 1,
    width: 150,
    //margin: 20
  },
  svg: {
    
  },
  text: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  progressContainer: {
    position: "absolute",
    gap: 8,
    alignItems: "center",
    //borderWidth: 1
  },

});

export default CircularProgressBar;