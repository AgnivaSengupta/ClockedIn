import {} from "react-native";
import React, { FC } from "react";
import { Line } from "react-native-svg";
import Animated, {
  createAnimatedPropAdapter,
  SharedValue,
  useAnimatedProps,
  withSpring,
  processColor,
} from "react-native-reanimated";
import {
  ANGLE_STEP,
  CENTER,
  BASE_LINE_LENGTH,
  STROKE_WIDTH,
  LINE_COUNT,
} from "../../constants/progressCircle";

type Props = {
  index: number;
  progress: SharedValue<number>;
  target: number;
};

// creating the line component
const AnimatedLine = Animated.createAnimatedComponent(Line);

const ProgressLine: FC<Props> = ({ index, progress, target }) => {
  const angle = index * ANGLE_STEP;
//   const adapter = createAnimatedPropAdapter(
//     (props) => {
//       if (Object.keys(props).includes("stroke")) {
//         props.stroke = { type: 0, payload: processColor(props.stroke) };
//       }
//     },
//     ["stroke"]
//   );

//console.log("target", target, "progress%", progress.value * 100);

  const animatedProps = useAnimatedProps(
    () => {
      const progressIndex = progress.value * LINE_COUNT;
      const isPastProgress = index < progressIndex;
      const y1Value = isPastProgress
        ? STROKE_WIDTH - BASE_LINE_LENGTH * 0.5
        : STROKE_WIDTH;

      const springConfig = {
        damping: 20 + index * 0.3,
        stiffness: 200 - index * 2,
      };

      const baseColor = progress.value * 100 >= target ? "green" : "red";
      // The line is filled if its index is less than the progress index
      const isFilled = progress.value * LINE_COUNT > index;
      // Apply the base color if filled, otherwise use a default gray
      const strokeColor = isFilled ? baseColor : "#575556";

      return {
        y1: withSpring(y1Value, springConfig),
        stroke: strokeColor
      };
    },
  );

 

  return (
    <AnimatedLine
      key={index}
      x1={CENTER}
      x2={CENTER}
      y1={STROKE_WIDTH}
      y2={STROKE_WIDTH + BASE_LINE_LENGTH}
      animatedProps={animatedProps}
      strokeWidth={STROKE_WIDTH * 0.5}
      strokeLinecap="round"
      originX={CENTER}
      originY={CENTER}
      rotation={angle * (180 / Math.PI)}
    />
  );
};

export default ProgressLine;