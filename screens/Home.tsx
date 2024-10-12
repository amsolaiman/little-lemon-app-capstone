import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  Alert,
  Image,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import debounce from "lodash.debounce";
//
import * as SQLite from "expo-sqlite";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
//
import useUpdateEffect from "../utils/useUpdateEffect";
//
import { useAuthContext } from "../auth/useAuthContext";
//
import Avatar from "../components/Avatar";
import ToggleButton from "../components/ToggleButton";
import DefaultHeader from "../components/DefaultHeader";
//
import {
  createTable,
  getMenuItems,
  insertMenuItems,
  filterByQueryAndCategories,
} from "../database";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const TOGGLE_OPTIONS = ["starters", "mains", "desserts", "drinks"];

const db = SQLite.openDatabaseAsync("little_lemon");

export default function HomeScreen({ navigation }) {
  const { user } = useAuthContext();

  const [data, setData] = useState([]);

  const [search, onChangeSearch] = useState("");

  const [query, setQuery] = useState("");

  const [filters, setFilters] = useState([]);

  const getMenu = async () => {
    try {
      await createTable();

      let menuItems = await getMenuItems();

      if (!menuItems.length) {
        const response = await fetch(API_URL);
        const json = await response.json();

        menuItems = json.menu.map((item, index) => {
          return {
            id: index + 1,
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
            category: item.category,
          };
        });

        await insertMenuItems(menuItems);
      }

      setData(menuItems);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      try {
        const menuItems = await filterByQueryAndCategories(query, filters);

        setData(menuItems);
      } catch (error) {
        Alert.alert(error.message);
        console.log(error.message);
      }
    })();
  }, [filters, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    onChangeSearch(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = (value: string) => {
    if (filters.includes(value)) {
      const newData = filters.filter((item) => item !== value);

      setFilters(newData);
    } else {
      setFilters((prev) => [...prev, value]);
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
              isActive={filters.includes(option)}
              label={option}
              onClick={() => handleFiltersChange(option)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const NoDataComponent = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>No data available</Text>
    </View>
  );

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
            onChangeText={(event) => handleSearchChange(event)}
            style={styles.inputBox}
          />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={({ name }, index) => name + index}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={NoDataComponent}
        style={styles.listContainer}
      />
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
    fontSize: 52,
    lineHeight: 52 * 1,
    fontFamily: "MarkaziText-Medium",
  },
  heroSubtitle: {
    color: "#EDEFEE",
    fontSize: 36,
    lineHeight: 36 * 1,
    fontFamily: "MarkaziText-Regular",
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
    fontFamily: "Karla-Medium",
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
    fontSize: 18,
    fontFamily: "Karla-Regular",
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
    fontFamily: "Karla-ExtraBold",
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
    fontFamily: "Karla-Bold",
  },
  itemTextDescription: {
    color: "#495E57",
    fontSize: 16,
    fontFamily: "Karla-Regular",
  },
  itemTextPrice: {
    color: "#495E57",
    fontSize: 18,
    fontFamily: "Karla-Medium",
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
  errorContainer: {
    paddingVertical: 18,
  },
  errorText: {
    color: "#495E57",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
});
