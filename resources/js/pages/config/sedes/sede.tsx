import AppLayout from "@/layouts/app-layout";
import { Sede, type BreadcrumbItem } from '@/types';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sedes',
        href: '/sedes',
    },
];

export default function Sedes({sedes} : {sedes: Sede[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Sedes" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex justify-end">
                <Button className="mt-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" tabIndex={4} >
                    Agregar Sede
                </Button>
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="text-left">Nit</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Detalle</TableHead>
                            <TableHead className="text-right">Direcc</TableHead>
                            <TableHead className="text-right">Correo</TableHead>
                            <TableHead className="text-right">Telefono</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sedes.length ? (
                            sedes.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-[100px]">{item.SED_CODIGO}</TableCell>
                                <TableCell className="text-center">{item.SED_NIT}</TableCell>
                                <TableCell className="text-center">{item.SED_NOMBRE}</TableCell>
                                <TableCell className="text-center">{item.SED_DETALL}</TableCell>
                                <TableCell className="text-right">{item.SED_DIRECC}</TableCell>
                                <TableCell className="text-right">{item.SED_EMAIL}</TableCell>
                                <TableCell className="text-right">{item.SED_TELEFO}</TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">No hay Sedes Registradas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
    )
}
