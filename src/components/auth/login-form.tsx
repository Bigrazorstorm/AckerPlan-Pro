'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { authenticate } from '@/app/auth/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Leaf } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('LoginPage');

  return (
    <Button type="submit" className="w-full min-h-[48px] text-base" aria-disabled={pending}>
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('LoginPage');

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Logo & Branding */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Leaf className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AgroTrack</h1>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>

      <form action={dispatch} className="space-y-5">
        {/* E-Mail Feld */}
        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="max.mustermann@betrieb.de"
            required
            defaultValue="john.doe@example.com"
            className="min-h-[48px] text-base"
            inputMode="email"
            autoComplete="email"
          />
        </div>

        {/* Passwort Feld mit Sichtbarkeits-Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('passwordLabel')}</Label>
            <Button variant="link" className="px-0 h-auto text-xs text-muted-foreground" type="button">
              Passwort vergessen?
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              defaultValue="password"
              className="min-h-[48px] text-base pr-12"
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Angemeldet bleiben */}
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" name="remember" />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Angemeldet bleiben
          </Label>
        </div>

        {/* Fehlermeldung */}
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

      {/* Footer-Info */}
      <p className="text-center text-xs text-muted-foreground">
        Digitale Betriebsführung für Agrarbetriebe
      </p>
    </div>
  );
}
