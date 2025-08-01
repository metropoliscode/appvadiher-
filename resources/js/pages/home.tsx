import AppLayout from '@/layouts/app-layout';
import { Modulo, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Menu Inicial',
    href: '/home',
  },
];

export default function Dashboard() {
  const { props } = usePage();
  const submodulos = props.submodulosPermitidos as Modulo[];

  const location = window.location;
  const submenu = location.pathname.slice(location.pathname.lastIndexOf("/"));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Menu Inicial" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4">
          {submodulos
            .filter(row => row.MOD_PARENT === submenu)
            .map((row, index) => (
              <div key={index} className="col-span-1">
                <Link href={row.MOD_URL}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{row.MOD_NOMBRE}</CardTitle>
                      <CardDescription>{row.MOD_DETALL}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
