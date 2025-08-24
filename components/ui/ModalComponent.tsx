import { StyleSheet, Text, View } from "react-native"
import Modal from "react-native-modal"
export default function ModalComponent({visible, setVisible}){
    return (
        <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
            <View style={styles.modalView}>
                <Text>Custom Modal</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12
    }
})