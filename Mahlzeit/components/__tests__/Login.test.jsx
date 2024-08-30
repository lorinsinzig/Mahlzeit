// LoginScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TextInput, Alert } from 'react-native';
import LoginScreen from '../../app/index'; // Adjust the path if necessary
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router';
import { setGlobalUserId } from '@/components/GlobalUser';

// Mock the SQLite database
jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn().mockReturnValue({
    exec: jest.fn(),
    getAll: jest.fn(),
  }),
}));

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock the global user ID setter
jest.mock('@/components/GlobalUser', () => ({
  setGlobalUserId: jest.fn(),
}));

describe('LoginScreen', () => {
  let getAllMock: jest.Mock;

  beforeEach(() => {
    getAllMock = SQLite.openDatabase().getAll;
  });

  test('should login successfully with valid credentials', async () => {
    // Arrange
    const mockUserId = 1;
    getAllMock.mockImplementation((sql, params, callback) => {
      callback([{ id: mockUserId }]);
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Act
    fireEvent.changeText(getByPlaceholderText('Nutzername'), 'Admin');
    fireEvent.changeText(getByPlaceholderText('Passwort'), 'admin');
    fireEvent.press(getByText('Anmelden'));

    // Assert
    await waitFor(() => {
      expect(setGlobalUserId).toHaveBeenCalledWith(mockUserId.toString());
      expect(router.push).toHaveBeenCalledWith('./(tabs)');
    });
  });

  test('should show an error alert with invalid credentials', async () => {
    // Arrange
    getAllMock.mockImplementation((sql, params, callback) => {
      callback([]);
    });

    // Mock Alert.alert to check if it's called
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Act
    fireEvent.changeText(getByPlaceholderText('Nutzername'), 'InvalidUser');
    fireEvent.changeText(getByPlaceholderText('Passwort'), 'InvalidPassword');
    fireEvent.press(getByText('Anmelden'));

    // Assert
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Fehler', 'Ungültiger Benutzername oder Passwort');
    });
  });

  test('should toggle password visibility', () => {
    // Arrange
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    // Act - Check initial state
    expect(getByPlaceholderText('Passwort').props.secureTextEntry).toBe(true);

    // Act - Toggle visibility
    fireEvent.press(getByTestId('toggle-password-visibility'));

    // Assert
    expect(getByPlaceholderText('Passwort').props.secureTextEntry).toBe(false);
  });
});
