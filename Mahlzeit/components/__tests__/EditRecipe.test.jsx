import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as SQLite from 'expo-sqlite';
import Details from '../../app/detail/[id]'; // Adjust the import path as needed

// Mock modules
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    getAllSync: jest.fn(() => [
      {
        id: 1,
        title: 'Original Title',
        rezept: 'Original Recipe',
        anweisungen: 'Original Instructions',
        dauer: 30,
        imageUri: null,
        ersteller: 1,
      },
    ]),
    execSync: jest.fn(),
  })),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  router: { push: jest.fn() },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));

describe('Details Component', () => {
  it('should update the recipe successfully when saveChanges is called', async () => {
    // Render the component
    const { getByDisplayValue, getByText, debug } = render(<Details />);

    // Debug to check the rendered component tree
    debug(); // Print the component tree to verify if the button is present

    // Ensure the recipe data is loaded
    await waitFor(() => {
      expect(getByDisplayValue('Original Title')).toBeTruthy();
    });

    // Find the save button by text content
    const saveButton = getByText('Save Changes');

    // Simulate user changing the text inputs
    fireEvent.changeText(getByDisplayValue('Original Title'), 'Updated Title');
    fireEvent.changeText(getByDisplayValue('Original Recipe'), 'Updated Recipe');
    fireEvent.changeText(getByDisplayValue('Original Instructions'), 'Updated Instructions');
    fireEvent.changeText(getByDisplayValue('30'), '45');

    // Simulate button press
    fireEvent.press(saveButton);

    // Check if the execSync function was called with the correct SQL query
    expect(SQLite.openDatabaseSync().execSync).toHaveBeenCalledWith(
      `UPDATE rezepte SET title = 'Updated Title', rezept = 'Updated Recipe', anweisungen = 'Updated Instructions', dauer = 45 WHERE id = 1;`
    );

    // Check if the navigation happens after save
    expect(router.push).toHaveBeenCalledWith('(tabs)');
  });
});
