import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ProductList from "./components/ProductList";
import CartSummary from "./components/CartSummary";

const products = [
  { id: "1", name: "Sách Toán", price: 500 },
  { id: "2", name: "Sách Văn", price: 500 },
  { id: "3", name: "Sách Anh", price: 500 },
  { id: "4", name: "Sách Tin học", price: 500 },
];

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách sản phẩm</Text>
      <CartSummary cart={cart} />
      <ProductList products={products} onAddToCart={addToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});
