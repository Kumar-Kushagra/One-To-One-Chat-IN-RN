import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';

const FormInput = ({ labelName, ...rest }) => {
    return (
        <TextInput

            label={labelName}
            style={styles.input}
            numberOfLines={1}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        marginBottom: 10,
        width: "90%",
        height: 60,
        backgroundColor:"white"
        
    }
});

export default FormInput;