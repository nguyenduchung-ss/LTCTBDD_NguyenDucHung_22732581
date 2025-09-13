import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ProductItem({ product, onAddToCart }) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          {product.price.toLocaleString("vi-VN")} đ
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onAddToCart(product)}
      >
        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  price: {
    fontSize: 14,
    color: "red",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
