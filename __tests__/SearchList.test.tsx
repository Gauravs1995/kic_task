import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react-native';
import SearchList from '../src/SearchList';
import {mockSearchData as testData} from '../src/constants/mockData';

describe('SearchList', () => {
  afterEach(cleanup);

  it('renders correctly', async () => {
    const subsetData = testData.slice(0, 10);
    const {getByText, getByTestId} = render(
      <SearchList searchData={subsetData} />,
    );

    const flatList = getByTestId('search-list-test-id');
    for (let i = 0; i < subsetData.length; i++) {
      // Fire a scroll event after checking every 5th item
      if (i % 5 === 0) {
        fireEvent.scroll(flatList, {
          nativeEvent: {
            contentOffset: {
              y: 250, // Scroll down by 250 units
            },
            contentSize: {
              height: 500,
              width: 500,
            },
            layoutMeasurement: {
              height: 500,
              width: 500,
            },
          },
        });
      }

      await waitFor(() => expect(getByText(subsetData[i].name)).toBeTruthy());
    }
  });

  it('filters testData based on search input', async () => {
    const {queryByText, getByPlaceholderText} = render(
      <SearchList searchData={testData} />,
    );
    const searchInput = getByPlaceholderText('ex: apple');
    fireEvent.changeText(searchInput, 'Ap');

    expect(queryByText('Apple Jive')).toBeTruthy();
    expect(queryByText('Pineapple Paradise')).toBeTruthy();
    expect(queryByText('Apple Allegro')).toBeTruthy();
    expect(queryByText('Strawberry Samba')).toBeNull();
    expect(queryByText('Mango Macarena')).toBeNull();

    fireEvent.changeText(searchInput, '');
  });

  it('selects and deselects testData item when pressed', () => {
    const {getByTestId} = render(<SearchList searchData={testData} />);

    const {id} = testData[0];

    const itemContainer = getByTestId(`item-container-${id}-test-id`);
    const itemSelection = getByTestId(`item-selection-${id}-test-id`);

    fireEvent.press(itemContainer);
    expect(itemSelection).toHaveTextContent('Selected');
    fireEvent.press(itemContainer);
    expect(itemSelection).toHaveTextContent('Not Selected');
  });
});
