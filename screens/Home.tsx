import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
//
import Avatar from "../components/Avatar";
import ToggleButton from "../components/ToggleButton";
import DefaultHeader from "../components/DefaultHeader";
//
import { IUserData } from "../types/userData";

const TOGGLE_OPTIONS = ["starters", "mains", "desserts", "drinks"];

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState<IUserData>();

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const value = await AsyncStorage.getItem("user");
        if (value) {
          const data: IUserData = JSON.parse(value);

          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserData();
  }, []);

  const [isLoading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [search, onChangeSearch] = useState("");

  const [filter, setFilter] = useState([]);

  const getMenu = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const json = await response.json();

      json.menu.forEach((item) => {
        item.image = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
      });

      setData(json.menu);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  const handleToggle = (value: string) => {
    if (filter.includes(value)) {
      const newData = filter.filter((item) => item !== value);

      setFilter(newData);
    } else {
      setFilter((prev) => [...prev, value]);
    }
  };

  const Item = ({ name, description, price, image }) => (
    <View style={styles.innerContainer}>
      <View style={styles.itemText}>
        <Text style={styles.itemTextName}>{name}</Text>
        <Text style={styles.itemTextDescription} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.itemTextPrice}>{"$" + price}</Text>
      </View>

      <Image source={{ uri: image }} style={styles.itemImage} />
    </View>
  );

  const ItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  const ListHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Order for delivery!</Text>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.headerScroll}
        >
          {TOGGLE_OPTIONS.map((option) => (
            <ToggleButton
              key={option}
              isActive={filter.includes(option)}
              label={option}
              onClick={() => handleToggle(option)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      name={item.name}
      price={item.price}
      description={item.description}
      image={item.image}
    />
  );

  return (
    <View style={styles.container}>
      <DefaultHeader
        rightActions={
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Avatar src={user?.avatar} alt={user?.fullName} size={42} />
          </Pressable>
        }
      />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroSubtitle}>Chicago</Text>

        <View style={styles.heroContent}>
          <Text style={styles.contentText}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>

          <Image
            source={require("../assets/images/hero.png")}
            style={styles.contentImage}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="search" size={24} color="#000" />
          <TextInput
            value={search}
            onChangeText={onChangeSearch}
            style={styles.inputBox}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ name }, index) => name + index}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ItemSeparatorComponent={ItemSeparator}
          style={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  //
  hero: {
    padding: 16,
    backgroundColor: "#495E57",
  },
  heroTitle: {
    color: "#F4CE14",
    fontSize: 36,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "#EDEFEE",
    fontSize: 28,
    fontWeight: "500",
  },
  heroContent: {
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  contentText: {
    flex: 1,
    color: "#EDEFEE",
    fontSize: 16,
  },
  contentImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
    backgroundColor: "#F4CE14",
  },
  inputContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    flexDirection: "row",
    borderRadius: 50,
    backgroundColor: "#EDEFEE",
  },
  inputBox: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  //
  listContainer: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  headerText: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  headerScroll: {
    flexDirection: "row",
    gap: 16,
  },
  innerContainer: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  itemText: {
    flex: 1,
    gap: 8,
  },
  itemTextName: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "700",
  },
  itemTextDescription: {
    color: "#495E57",
    fontSize: 16,
  },
  itemTextPrice: {
    color: "#495E57",
    fontSize: 18,
    fontWeight: "500",
  },
  itemImage: {
    width: 84,
    height: 84,
    resizeMode: "cover",
    backgroundColor: "#F4CE14",
  },
  separator: {
    height: 1,
    backgroundColor: "#CCC",
    width: "100%",
  },
});
