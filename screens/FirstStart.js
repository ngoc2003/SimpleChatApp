import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";
import colors from "../colors";
import { AntDesign } from "@expo/vector-icons";
import { compareAsc, format } from "date-fns";
import Dropdown from "../components/Dropdown";
const FirstStart = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleChangeDate = (e, dateChoosed) => {
    if (e.type === "set") {
      setDate(dateChoosed);
    }
    setOpen(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your gender</Text>
      <TextInput
        underlineColor={colors.primary}
        activeUnderlineColor={colors.primary}
        style={styles.userInput}
        placeholder="Your Gender"
      />
      <Text style={styles.label}>Your birthday</Text>
      <View>
        <TextInput
          value={format(date, "MM/dd/yyyy")}
          placeholder="DD/MM/YYYY"
          underlineColor={colors.primary}
          style={styles.userInput}
          activeUnderlineColor={colors.primary}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: "25%",
            right: 10,
          }}
          onPress={() => setOpen(true)}
        >
          <AntDesign name="calendar" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {open && (
        <DateTimePicker
          dateFormat="DD/MM/YYYY"
          onChange={handleChangeDate}
          value={date}
          mode="date"
        />
      )}
      <Text style={styles.label}>About your self</Text>
      <TextInput
        underlineColor={colors.primary}
        activeUnderlineColor={colors.primary}
        style={styles.userInput}
        multiline
        placeholder="I am an active person. I love football!"
        numberOfLines={4}
      />
      <Text style={styles.label}>Your address</Text>
      <TextInput
        underlineColor={colors.primary}
        activeUnderlineColor={colors.primary}
        style={styles.userInput}
        placeholder="12 Quang Trung, Ha Dong, Viet Nam"
      />
      <Dropdown />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  userInput: {
    backgroundColor: "#fff",
    fontSize: 14,
    textAlignVertical: "top",
  },
  label: {
    marginVertical: 10,
  },
});

export default FirstStart;
