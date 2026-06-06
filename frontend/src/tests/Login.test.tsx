import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../store/store';
import Login from '../components/Login';

describe('Login Component', () => {
  it('renders the initial role selection screen', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    
    // Check if title is present
    expect(screen.getByText(/Restaurant Manager Pro/i)).toBeInTheDocument();
    
    // Check if role selection buttons are present
    expect(screen.getByText(/Selecciona tu perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Mesero/i)).toBeInTheDocument();
  });

  it('navigates to AuthForm when a role is selected', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    
    // Click on "Mesero" role button
    const meseroButton = screen.getByText(/Mesero/i);
    fireEvent.click(meseroButton);
    
    await waitFor(() => {
        expect(screen.queryByText(/Selecciona tu perfil/i)).not.toBeInTheDocument();
    });
  });
});
