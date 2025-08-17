import { useIsFocused } from "@react-navigation/native";
import { MotiText, MotiView } from "moti";

export default function DateTicker({ fontSize = 32 }) {
    const isFocused = useIsFocused();
    const date = new Date().getDate(); // 1..31
  
    return (
      <MotiView
        key={isFocused ? date : "reset"}
        from={{ translateY: 0 }}
        animate={{ translateY: -fontSize * 1.2 * (date - 1) }}
        transition={{ damping: 80, stiffness: 200 }}
        style={{ height: fontSize * 1.2, overflow: "hidden" }}
      >
        {Array.from({ length: 31 }, (_, i) => (
          <MotiText
            key={i}
            style={{
              fontSize,
              textAlign: "center",
              height: fontSize * 1.2,
            }}
          >
            {i + 1}
          </MotiText>
        ))}
      </MotiView>
    );
  }
  