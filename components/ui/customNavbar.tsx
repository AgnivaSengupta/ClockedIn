import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text } from '@react-navigation/elements';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


const BACKGROUNDCOLOR = "#0D0D0D"
const RESTINGCOLOR = "#333333"
const ACTIVECOLOR = "#FCFCFC"

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify()}
            key={route.key}
            onPress={onPress}
            style={[styles.tabContainer, {backgroundColor: isFocused ? ACTIVECOLOR : RESTINGCOLOR}]}
          >
            {getIconsByRouteNames(route.name, isFocused)}
            {isFocused && <Animated.Text 
              style={styles.text}
              entering={FadeIn.duration(100)}
              exiting={FadeOut.duration(100)}
              >
              {label as string}
            </Animated.Text>}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );
}

function getIconsByRouteNames(routeName: string, isFocused: boolean) {
    const color = isFocused ? '#0D0D0D' : '#ffffff';
    
    switch(routeName){
        case "home":
            return <Feather name='home' size={24} color={color}/>

        case "calendar":
            return <AntDesign name="calendar" size={24} color={color} />

        case "history": 
            return <MaterialIcons name="history" size={24} color={color} />
            
        default:
            return null;
    }
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flexDirection: "row",
        backgroundColor: BACKGROUNDCOLOR,
        width: "75%",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        bottom: 40,
        borderRadius: 30,
        paddingHorizontal:15,
        paddingVertical:12
    },
    
    tabContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 25,
        paddingVertical: 4,
        paddingHorizontal: 15
    },

    text: {
        color: "#0D0D0D",
        marginLeft: 8,
        fontWeight: "bold",
    }
})

export default CustomNavBar;