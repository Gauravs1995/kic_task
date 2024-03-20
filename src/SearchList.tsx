import React, {useState, useMemo, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import {SearchDataArrayType, SearchDataItemType} from './constants/types';

type SearchListPropType = {
  searchData: SearchDataArrayType;
};

// Height of each item in the list
const ITEM_HEIGHT = 40;

/**
 * Component for displaying a searchable list of items. Implements a TextInput that takes a search term, and a FlatList that displays the filtered data items, and allows for selection of items.
 * @component
 * @param {Object} searchData - The array of search data.
 * @returns {JSX.Element} The rendered component.
 */
const SearchList = ({searchData}: SearchListPropType) => {
  const [selectedItems, setSelectedItems] = useState<SearchDataArrayType>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle selection of an item
  const handleSelectItem = useCallback((selectedItem: SearchDataItemType) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(selectedItem)) {
        return prevSelectedItems.filter(
          (item: SearchDataItemType) => item !== selectedItem,
        );
      } else {
        return [...prevSelectedItems, selectedItem];
      }
    });
  }, []);

  // Render each item in the list
  const renderItem = useCallback(
    ({item}: {item: SearchDataItemType}) => {
      const isSelected = selectedItems.includes(item);
      return (
        <TouchableOpacity
          testID={`item-container-${item.id}-test-id`}
          style={styles.itemWrapper}
          onPress={() => handleSelectItem(item)}>
          <Text>{item.name}</Text>
          <Text testID={`item-selection-${item.id}-test-id`}>
            {isSelected ? 'Selected' : 'Not Selected'}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedItems, handleSelectItem],
  );

  // Filter the data based on the search term
  const filteredItems = useMemo(
    () =>
      searchData.filter((item: SearchDataItemType) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchData, searchTerm],
  );

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="ex: apple"
        style={styles.searchField}
        onChangeText={setSearchTerm}
        value={searchTerm}
      />
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setSearchTerm('')}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
      <FlatList
        testID="search-list-test-id"
        showsVerticalScrollIndicator={false}
        style={styles.listContainer}
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchField: {
    borderColor: 'black',
    borderWidth: 1,
    top: 10,
    margin: 10,
    padding: 10,
    height: 40,
    borderRadius: 20,
  },
  wrapper: {
    gap: 10,
  },
  itemWrapper: {
    display: 'flex',
    borderWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 6,
    marginVertical: 5,
    flexShrink: 1,
    backgroundColor: 'blanchedalmond',
  },
  itemName: {
    flexShrink: 1,
  },
  listContainer: {
    marginHorizontal: 10,
  },
  clearButton: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    borderWidth: 1,
    padding: 5,
  },
});

SearchList.displayName = 'SearchList';
export default SearchList;
