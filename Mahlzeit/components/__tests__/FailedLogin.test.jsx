import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../../app/index';
import * as SQLite from 'expo-sqlite';
import { setGlobalUserId } from '@/components/GlobalUser';
import { router } from 'expo-router';

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock SQLite database
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    getAllSync: jest.fn(),
  })),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('LoginScreen', () => {
  it('shows an error alert when login fails', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<LoginScreen />);

    // Mock the database query to return no results
    const db = SQLite.openDatabaseSync();
    db.getAllSync.mockReturnValue([]);

    // Fill in the form with invalid credentials
    fireEvent.changeText(getByPlaceholderText('Nutzername'), 'invalidUser');
    fireEvent.changeText(getByPlaceholderText('Passwort'), 'invalidPassword');

    // Press the login button
    fireEvent.press(getByText('Anmelden'));

    // Wait for the Alert to be called
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Fehler',
        'Ungültiger Benutzername oder Passwort'
      );
    });
  });
});
