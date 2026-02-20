'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { authenticate } from '@/app/auth/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('LoginPage');

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const t = useTranslations('LoginPage');

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="john.doe@example.com"
          required
          defaultValue="john.doe@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('passwordLabel')}</Label>
        <Input id="password" type="password" name="password" required defaultValue="password"/>
      </div>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('errorToastTitle')}</AlertTitle>
          <AlertDescription>
            {t(errorMessage as any)}
          </AlertDescription>
        </Alert>
      )}
      <SubmitButton />
    </form>
  );
}
