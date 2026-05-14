import React from "react";

// Custom Hook para Local Storage
const useLocalStorage = (keyItem, initialItemValue) => {
  const [item, setItem] = React.useState(initialItemValue);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  React.useEffect(() => {
    try {
      const localStorageItem = localStorage.getItem(keyItem);
      let parsedItem;
      if (!localStorageItem) {
        localStorage.setItem(keyItem, JSON.stringify(initialItemValue));
        parsedItem = initialItemValue;
      } else {
        parsedItem = JSON.parse(localStorageItem);
      }
      setItem(parsedItem);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof SyntaxError) {
        localStorage.setItem(keyItem, JSON.stringify(initialItemValue));
        setItem(initialItemValue);
      } else {
        setError(true);
      }
    }
  }, []);


  const updateItem = (newItemOrUpdater) => {
    setItem(prev => {
      const value = typeof newItemOrUpdater === 'function' ? newItemOrUpdater(prev) : newItemOrUpdater;
      localStorage.setItem(keyItem, JSON.stringify(value));
      return value;
    });
  };

  // const removeItem = () => {
  //   localStorage.removeItem(keyItem);
  //   setItem([]);
  // };

  // const getItem = () => {
  //   return JSON.parse(localStorage.getItem(keyItem));
  // };

  return { item, updateItem, loading, error };
};

export { useLocalStorage };