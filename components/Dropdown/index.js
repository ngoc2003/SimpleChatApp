import { View, Text } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import colors from "../../colors";

const Dropdown = (
  color = colors.primary,
  value = "Example",
  backgroundColor = "#fff"
) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <TextInput
        backgroundColor={backgroundColor}
        underlineColor={color}
        activeUnderlineColor={color}
        placeholder={value}
      />
    </View>
  );
};

export default Dropdown;
