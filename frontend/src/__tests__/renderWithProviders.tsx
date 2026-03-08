import { render } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { ModalProvider } from '../Context/ModalContext';
import { AuthProvider } from '../Context/User/AuthContext';
import { AlertProvider } from '../Context/AlertContext';

export const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => 
{
    return render(
        <MemoryRouter future={{ v7_relativeSplatPath: true }} initialEntries={[route]}>
            <AuthProvider>
                <AlertProvider>
                    <ModalProvider>
                        {ui}
                    </ModalProvider>
                </AlertProvider>
            </AuthProvider>
        </MemoryRouter>
    );
};