import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  src: string | null;
  alt: string;
  size?: number;
};

export default function Avatar({ src, alt, size = 42 }: Props) {
  const getInitials = () => {
    const textArray = alt.split(" ");
    const initials = textArray.map((n) => n.charAt(0).toUpperCase()).join("");

    return initials;
  };

  if (!src) {
    return (
      <View style={[styles.placeholder, { width: size, height: size }]}>
        {alt && (
          <Text style={[styles.text, { fontSize: size / 2.5 }]}>
            {getInitials()}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={[styles.avatar, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    resizeMode: "contain",
    borderRadius: 50,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#EE9972",
  },
  text: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "Karla-Regular",
  },
});
