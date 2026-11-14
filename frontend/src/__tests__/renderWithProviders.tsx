import { render, RenderOptions } from '@testing-library/react';

import { ModalProvider } from '../Context/ModalContext';
import { AuthProvider } from '../Context/User/AuthContext';
import { AlertProvider } from '../Context/AlertContext';
import { Suspense } from 'react';

export const renderWithProviders = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => 
{
    return render(
        <AuthProvider>
            <AlertProvider>
                <ModalProvider>
                    <Suspense fallback={<div>Loading...</div>}>
                        {ui}
                    </Suspense>
                </ModalProvider>
            </AlertProvider>
        </AuthProvider>,
        options
    );
};