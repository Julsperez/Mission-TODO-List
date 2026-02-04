import React from "react";

// Custom Hook para Local Storage
const useLocalStorage = (keyItem, initialItemValue) => {
  // localStorage storage validation
  const localStorageItem = localStorage.getItem(keyItem);
  let parsedItem;
  if(!localStorageItem) {
    localStorage.setItem(keyItem, initialItemValue);
    parsedItem = [];
  } else {
    parsedItem = JSON.parse(localStorageItem);
  }

  const [item, setItem] = React.useState(parsedItem);

  const updateItem = (newItem) => {
    localStorage.setItem(keyItem, JSON.stringify(newItem));
    setItem(newItem);
  };

  // const removeItem = () => {
  //   localStorage.removeItem(keyItem);
  //   setItem([]);
  // };

  // const getItem = () => {
  //   return JSON.parse(localStorage.getItem(keyItem));
  // };

  return [item, updateItem];
};

export { useLocalStorage };