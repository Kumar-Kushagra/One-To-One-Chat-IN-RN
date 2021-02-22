import React from 'react';
import { StyleSheet} from 'react-native';
import { Button } from 'react-native-paper';

export default function FormButton({ title, modeValue, ...rest }) {
  return (
    <Button
      mode={modeValue}
      {...rest}
      style={styles.button}
      contentStyle={styles.buttonContainer}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 30
  },
  buttonContainer: {
    width: "100%",
    height: 50
  }
});