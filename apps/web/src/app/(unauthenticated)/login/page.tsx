import { AuthHeader } from './AuthHeader';
import { LoginForm } from './LoginForm';

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center">
      <main className="prose p-5 bg-white rounded-lg w-80">
        <AuthHeader
          heading="Zaloguj się"
          text="Nie masz konta?"
          linkLabel="Zarejestruj się"
          linkUrl="/register"
        />
        <LoginForm />
      </main>
    </div>
  );
}
