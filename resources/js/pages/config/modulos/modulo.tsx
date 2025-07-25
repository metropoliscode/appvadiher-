import AppLayout from "@/layouts/app-layout";
import { Modulo, type BreadcrumbItem } from '@/types';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modulos',
        href: '/modulos',
    },
];

export default function Modulos({modulos} : {modulos: Modulo[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Modulos" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex justify-end">
                <Button className="mt-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" tabIndex={4} >
                    Agregar Modulo
                </Button>
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Detalle</TableHead>
                            <TableHead className="text-right">URL</TableHead>
                            <TableHead className="text-right">Icon</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modulos.length ? (
                            modulos.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-[100px]">{item.MOD_CODIGO}</TableCell>
                                <TableCell className="text-center">{item.MOD_NOMBRE}</TableCell>
                                <TableCell className="text-center">{item.MOD_DETALL}</TableCell>
                                <TableCell className="text-right">{item.MOD_URL}</TableCell>
                                <TableCell className="text-right">{item.MOD_ICONO}</TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No hay Modulos Registrados</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
    )
}
