import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import AddScreen from '../../app/(tabs)/add';

// Mocking navigation
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mocking SQLite database
const mockExecSync = jest.fn();

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: () => ({
    execSync: mockExecSync,
  }),
}));

describe('AddScreen', () => {
  test('should create a recipe successfully', async () => {
    render(<AddScreen />);

    // Fill in the form fields
    fireEvent.changeText(screen.getByPlaceholderText('Name des Gerichts'), 'Test Recipe');
    fireEvent.changeText(screen.getByPlaceholderText('Beschreibung des Gerichts'), 'Test Description');
    fireEvent.changeText(screen.getByPlaceholderText('Anweisungen zum Zubereiten des Gerichts'), 'Test Instructions');
    fireEvent.changeText(screen.getByPlaceholderText('Dauer in Stunden'), '1');

    // Simulate creating the recipe
    fireEvent.press(screen.getByText('Erstellen'));

    // Log mockExecSync calls for debugging
    console.log('Mock ExecSync calls:', mockExecSync.mock.calls);

    // Check if the database insert was called
    await waitFor(() => {
      expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO rezepte'));
      expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('Test Recipe'));
      expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('Test Description'));
      expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('Test Instructions'));
      expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('1'));
      expect(mockExecSync).toHaveBeenCalledWith(expect.stringContaining('http://example.com/default-image.png'));
    });
  });
});
