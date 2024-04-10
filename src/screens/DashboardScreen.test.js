import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../screens/DashboardScreen'; // Adjust the path as needed

describe('<DashboardScreen />', () => {
  test('renders loading indicator initially', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const loader = getByTestId('loader'); // Make sure you add testID to your loader View
    expect(loader).toBeTruthy();
  });

  test('displays task items after loading', async () => {
    // Mock getOwnTasks function
    jest.mock('../api/api', () => ({
      getOwnTasks: jest.fn(() => Promise.resolve([{ Guid: '1', Client: 'Client 1', Description: 'Task description', PlannedDate: '2024-04-11T12:00:00Z' }])),
    }));

    const { findByText } = render(<DashboardScreen />);
    const taskItem = await findByText('Client 1');
    expect(taskItem).toBeTruthy();
  });

  test('navigates to Task screen on task item press', async () => {
    const navigateMock = jest.fn();
    const { findByText } = render(<DashboardScreen navigation={{ navigate: navigateMock }} />);
    const taskItem = await findByText('Client 1');
    fireEvent.press(taskItem);
    expect(navigateMock).toHaveBeenCalledWith('Task', { taskId: '1' });
  });

  // Add more tests as needed for other functionality
});
