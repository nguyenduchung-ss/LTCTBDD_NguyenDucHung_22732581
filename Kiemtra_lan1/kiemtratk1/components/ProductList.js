import React from "react";
import { FlatList } from "react-native";
import ProductItem from "./ProductItem";

export default function ProductList({ products, onAddToCart }) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductItem product={item} onAddToCart={onAddToCart} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
