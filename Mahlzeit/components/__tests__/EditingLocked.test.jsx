import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; // For extra matchers
import Details from './Details'; // Adjust the import according to your file structure
import { globalUserId } from '@/components/GlobalUser'; // Mock this import

// Mock the navigation and database
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    getAllSync: jest.fn(() => [
      {
        id: 1,
        title: 'Test Recipe',
        rezept: 'Test Description',
        anweisungen: 'Test Instructions',
        dauer: 30,
        imageUri: 'http://example.com/image.jpg',
        ersteller: 1, // Simulate that user with id 1 is the owner
      },
    ]),
    execSync: jest.fn(),
  })),
}));
jest.mock('@/components/GlobalUser', () => ({
  globalUserId: '1', // Mock the global user ID
}));

describe('<Details />', () => {
  it('should lock editing if the user is not the owner', () => {
    // Override globalUserId to simulate a different user
    jest.mock('@/components/GlobalUser', () => ({
      globalUserId: '2', // Simulate a different user
    }));

    // Render the component
    render(<Details />);

    // Find the text inputs
    const titleInput = screen.getByDisplayValue('Test Recipe');
    const rezeptInput = screen.getByDisplayValue('Test Description');
    const anweisungenInput = screen.getByDisplayValue('Test Instructions');
    const dauerInput = screen.getByDisplayValue('30');

    // Verify inputs are not editable
    expect(titleInput).toBeDisabled();
    expect(rezeptInput).toBeDisabled();
    expect(anweisungenInput).toBeDisabled();
    expect(dauerInput).toBeDisabled();
  });

  it('should allow editing if the user is the owner', () => {
    // Override globalUserId to simulate the owner
    jest.mock('@/components/GlobalUser', () => ({
      globalUserId: '1', // Simulate the owner
    }));
    
    // Render the component
    render(<Details />);

    // Find the text inputs
    const titleInput = screen.getByDisplayValue('Test Recipe');
    const rezeptInput = screen.getByDisplayValue('Test Description');
    const anweisungenInput = screen.getByDisplayValue('Test Instructions');
    const dauerInput = screen.getByDisplayValue('30');

    // Verify inputs are editable
    expect(titleInput).toBeEnabled();
    expect(rezeptInput).toBeEnabled();
    expect(anweisungenInput).toBeEnabled();
    expect(dauerInput).toBeEnabled();
  });
});
