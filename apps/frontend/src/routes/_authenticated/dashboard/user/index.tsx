import { createFileRoute } from "@tanstack/react-router";

import { AppSidebarContent } from "@/components/app-sidebar-content";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldGroup, FieldTitle } from "@/components/ui/field";
import { useSuspenseUser } from "@/hooks/queries/useUser";

export const Route = createFileRoute("/_authenticated/dashboard/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSuspenseUser();

  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <AppSidebarContent title="Conta">
      <div className="px-4 py-5">
        <Card>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldTitle>ID</FieldTitle>
                <FieldContent>
                  <span className="text-sm font-mono text-muted-foreground">{user.id}</span>
                </FieldContent>
              </Field>

              <Field>
                <FieldTitle>Nome</FieldTitle>
                <FieldContent>
                  <span className="text-sm">{fullName || "Não informado"}</span>
                </FieldContent>
              </Field>

              <Field>
                <FieldTitle>Email</FieldTitle>
                <FieldContent>
                  <span className="text-sm">{user.email}</span>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </AppSidebarContent>
  );
}
