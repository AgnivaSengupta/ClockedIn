import CustomNavBar from "@/components/ui/customNavbar";
import { Tabs } from "expo-router";

export default function TabLayot(){
    return (
        <Tabs tabBar={(props) => <CustomNavBar {...props}/>}>
            <Tabs.Screen name='home' options={{ headerShown: false }}/>
            <Tabs.Screen name='calendar' options={{ headerShown: false }}/>
            <Tabs.Screen name='history' options={{ headerShown: false }}/>
        </Tabs>
    )
}