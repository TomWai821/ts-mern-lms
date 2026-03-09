import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithProviders } from './renderWithProviders'

const mockResponse = ({ ok, status, body }: { ok: boolean; status: number; body: any }) =>
{
  return { ok, status, json: async () => body} as Response;
}

beforeEach(() => 
{
    document.cookie = "";
    sessionStorage.clear();
    (global.fetch as jest.Mock) = jest.fn();
});

const user = userEvent.setup();

// Test case for register page
test('register successfully', async () => 
{
    (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockResponse(
        {
            ok: true,
            status: 200,
            body: 
            { 
                success: true, 
                message: "Register successfully!",
                data: 
                {
                    username: "TestUser1",
                    role: "User",
                    status: "Normal",
                    avatarUrl: "https://via.placeholder.com/150?text=T"
                }  
            }
        })
    );

    renderWithProviders(<App />, { route: '/register' } );
    
    await user.type(screen.getByPlaceholderText(/email/i), "TestUser1@example.com");
    await user.type(screen.getByPlaceholderText(/username/i), "TestUser1");
    await user.type(screen.getByPlaceholderText(/password/i), "TestUser1Password");
    await user.clear(screen.getByPlaceholderText(/birthDay/i));
    await user.type(screen.getByPlaceholderText(/birthDay/i), "2000-01-01");

    await user.click(screen.getByRole('button', { name: /Register/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Registration successful! Redirecting.../);
});

test('fail to register (Use already registration data)', async () => 
{
    (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockResponse(
        {
            ok: false,
            status: 400,
            body: 
            { 
                success: false,
                error: "Invalid email address"
            }
        })
    );

    renderWithProviders(<App />, { route: '/register' } );

    await user.type(screen.getByPlaceholderText(/email/i), "TestUser1@example.com");
    await user.type(screen.getByPlaceholderText(/username/i), "TestUser1");
    await user.type(screen.getByPlaceholderText(/password/i), "TestUser1Password");
    await user.clear(screen.getByPlaceholderText(/birthDay/i));
    await user.type(screen.getByPlaceholderText(/birthDay/i), "2000-01-01");

    await user.click(screen.getByRole('button', { name: /Register/i }));


    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Failed to register! Please try again/);
});

test('Input the DOB which less than 6 years old', async () => 
{
    renderWithProviders(<App />, { route: '/register' } );
    
    await user.type(screen.getByPlaceholderText(/email/i), "TestUser1@example.com");
    await user.type(screen.getByPlaceholderText(/username/i), "TestUser1");
    await user.type(screen.getByPlaceholderText(/password/i), "TestUser1Password");
    await user.clear(screen.getByPlaceholderText(/birthDay/i));
    await user.type(screen.getByPlaceholderText(/birthDay/i), "2026-01-01");

    await user.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/Only users aged 6 years and older can register/)).toBeInTheDocument();
});

// Test Case for login page
test('login successfully', async () => 
{
    (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockResponse(
        {
            ok: true,
            status: 200,
            body: 
            { 
                success: true, 
                message: "Login successfully!",
                data: 
                {
                    username: "TestUser1",
                    role: "User",
                    status: "Normal",
                    avatarUrl: "https://via.placeholder.com/150?text=T"
                }  
            }
        })
    );

    renderWithProviders(<App />, { route: '/login' });

    await user.type(screen.getByPlaceholderText(/email/i), "IamTester@gmail.com");
    await user.type(screen.getByPlaceholderText(/password/i), "IamTester");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Login successfully!/);
});

test('fail to login', async () => 
{
    (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockResponse(
        {
            ok: false,
            status: 400,
            body: 
            { 
                success: false,
                error: "Invalid email or password!"
            }
        })
    );

    renderWithProviders(<App />, { route: '/login' });

    await user.type(screen.getByPlaceholderText(/email/i), "IamTester@gmail.com");
    await user.type(screen.getByPlaceholderText(/password/i), "IamTester123");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Invalid email or password!/);
});


// The following test case for helpText in login page
test('the email input null (In login page)', async () => 
{
    renderWithProviders(<App />, { route: '/login' } );

    await user.type(screen.getByPlaceholderText(/password/i), "IamTester123");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
});

test('the password input null (In login page)', async () => 
{
    renderWithProviders(<App />, { route: '/login' } );

    await user.type(screen.getByPlaceholderText(/email/i), "IamTester@gmail.com");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText(/password must be at least 6 characters long/)).toBeInTheDocument();
});