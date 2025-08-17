import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Text, TextProps, View } from "react-native";

type TickerListProps = {
    number: number;
    fontSize: number;
    index: number
}

const numArray = [...Array(10).keys()] // [0,1,2,3,4,5,6,7,8,9]

const _stagger = 50

function Tick({ children, ...rest }: TextProps){
    return <Text {...rest}>{children}</Text>
}


function TickerList ({ number, fontSize, index }: TickerListProps){
    return (
        <View style={{ height: fontSize, 
            //backgroundColor: "red", 
            overflow: "hidden" 
        }}>
            <MotiView
                from={{ translateY: 0 }}
                animate={{
                    translateY: -fontSize * 1.1 * number
                }}
                transition={{
                    delay: index * _stagger,
                    damping: 80,
                    stiffness: 200
                }}
            >
                {numArray.map((num, index) => {
                    return (
                        <Tick
                            key={`number-${num}-${index}`}
                            style={{
                                fontSize: fontSize,
                                lineHeight: fontSize * 1.1,
                                fontVariant: ["tabular-nums"],
                                fontWeight: "900"
                            }}>
                            {num}
                        </Tick>
                    )
                })}
            </MotiView>
        </View>
    )
}

export default function Clock({ value = 14445, fontSize = 100} : { value : number, fontSize?: number}){
    
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() =>{
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // formatted time string
    const formatted = time.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    
    const digitsAndColon = formatted.split("")

    return (
        <View>
            <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                {digitsAndColon.map((numberChar, index) => {
                    if (numberChar == ":"){
                        return (
                            <Text
                                key={`colon-${index}`}
                                style={{
                                    fontSize,
                                    lineHeight: fontSize*1.1,
                                    fontWeight: "900",
                                    marginHorizontal: fontSize * 0.1,
                                    opacity: 0.3
                                }}
                            >
                                {numberChar}
                            </Text>
                        )
                    }
                    return (
                        <TickerList
                            fontSize={fontSize}
                            number={parseInt(numberChar)}
                            key={index}
                            index = {index}
                        />
                    )
                })}
            </View>
        </View>
    )
}