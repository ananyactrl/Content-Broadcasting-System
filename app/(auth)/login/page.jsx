import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginForm from '@/src/components/forms/LoginForm';

export const metadata = {
  title: 'Sign in — BroadcastEd',
};

export default function LoginPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Sign in to your account</CardTitle>
        <CardDescription>
          Use your school credentials to access the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-2">
            Demo credentials
          </p>
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <p>teacher@school.com / teacher123</p>
            <p>principal@school.com / principal123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
