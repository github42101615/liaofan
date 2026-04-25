import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteShell } from "@/components/site-shell";

export default function AdminPage() {
  return (
    <SiteShell>
      <section className="section-heading">
        <div>
          <p className="panel-kicker">Studio</p>
          <h1>Manage your writing without leaving the app.</h1>
        </div>
        <p className="muted-copy">
          This admin surface talks to the same API you will deploy on your server. Set `ADMIN_SECRET` and you are ready to publish.
        </p>
      </section>
      <AdminDashboard />
    </SiteShell>
  );
}
