"use client";

import { Download } from "lucide-react";
import { AdminWebappInstallPrompt } from "@/components/crm/admin-webapp-install-prompt";
import { Button } from "@/components/ui/button";
import { useAdminPwaInstall } from "@/hooks/use-admin-pwa-install";

/**
 * Mount on any admin entry page (login, workspace, CRM) so the install
 * prompt works before and after sign-in on s2mbo.com.
 */
export function AdminPwaInstallHost({
  showFloatingButton = true,
}: {
  showFloatingButton?: boolean;
}) {
  const install = useAdminPwaInstall();

  return (
    <>
      <AdminWebappInstallPrompt install={install} />
      {showFloatingButton && install.showNavInstall ? (
        <Button
          type="button"
          size="sm"
          className="fixed bottom-4 right-4 z-50 gap-2 rounded-full bg-primary px-4 text-white shadow-lg hover:bg-primary/90 hover:text-white md:bottom-6 md:right-6"
          onClick={install.openInstallDialog}
        >
          <Download className="size-4" />
          Installer l&apos;app
        </Button>
      ) : null}
    </>
  );
}
