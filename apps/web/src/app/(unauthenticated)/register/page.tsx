import { AuthHeader } from '../../../components/auth/auth-header/AuthHeader';
import { RegisterForm } from '../../../components/auth/register-form/RegisterForm';

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center">
      <main className="prose p-5 bg-white rounded-lg w-80">
        <AuthHeader
          heading="Zarejestruj się"
          text="Masz już konto?"
          linkLabel="Zaloguj się"
          linkUrl="/login"
        />
        <RegisterForm />
      </main>
    </div>
  );
}
