import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { getTranslations } from "next-intl/server";
import { Leaf } from "lucide-react";

export default async function LoginPage({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: "LoginPage"});
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <div className="w-full max-w-sm">
        <div className="flex justify-center items-center gap-2 mb-6">
           <Leaf className="h-8 w-8 text-primary" />
           <h1 className="text-3xl font-bold tracking-tight">FieldSense</h1>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
