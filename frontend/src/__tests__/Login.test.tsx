import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './renderWithProviders'
import RegisterPage from '../features/auth/RegisterPage';
import LoginPage from '../features/auth/LoginPage';

const mockResponse = ({ ok, status, body }: { ok: boolean; status: number; body: any }) =>
{
  return { ok, status, json: async () => body} as Response;
}

beforeEach(() => 
{
    document.cookie = "";
    sessionStorage.clear();
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce(
        mockResponse({ ok: false, status: 401, body: { success: false } })
    );
});

const user = userEvent.setup();
const renderRegisterPage = () => renderWithProviders(<RegisterPage />);
const renderLoginPage = () => renderWithProviders(<LoginPage />);

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
                message: "Register Successfully!",
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

    renderRegisterPage();
    
    const emailInput = await screen.findByPlaceholderText(/email/i);
    await user.type(emailInput, "TestUser1@example.com");

    await user.type(screen.getByPlaceholderText(/username/i), "TestUser1");
    await user.type(screen.getByPlaceholderText(/password/i), "TestUser1Password");

    const birthDayInput = screen.getByPlaceholderText(/birthDay/i);
    await user.clear(birthDayInput);
    await user.type(birthDayInput, "2000-01-01");


    await user.click(screen.getByRole('button', { name: /Register/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Register Successfully!/);
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

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText(/email/i), "TestUser1@example.com");
    await user.type(screen.getByPlaceholderText(/username/i), "TestUser1");
    await user.type(screen.getByPlaceholderText(/password/i), "TestUser1Password");
    await user.clear(screen.getByPlaceholderText(/birthDay/i));
    await user.type(screen.getByPlaceholderText(/birthDay/i), "2000-01-01");

    await user.click(screen.getByRole('button', { name: /Register/i }));


    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Invalid email address/);
});

test('Input the DOB which less than 6 years old', async () => 
{
    renderWithProviders(<RegisterPage/>);
    
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

    renderLoginPage();

    const emailInput = await screen.findByPlaceholderText(/email/i);
    await user.type(emailInput, "IamTester@gmail.com");
    
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

    renderWithProviders(<LoginPage/>);

    await user.type(screen.getByPlaceholderText(/email/i), "IamTester@gmail.com");
    await user.type(screen.getByPlaceholderText(/password/i), "IamTester123");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Invalid email or password!/);
});


// The following test case for helpText in login page
test('the email input null (In login page)', async () => 
{
    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/password/i), "IamTester123");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
});

test('the password input null (In login page)', async () => 
{
    renderLoginPage();

    await user.type(screen.getByPlaceholderText(/email/i), "IamTester@gmail.com");
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText(/password must be at least 6 characters long/)).toBeInTheDocument();
});