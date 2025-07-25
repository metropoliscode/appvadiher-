import AppLayout from "@/layouts/app-layout";
import { Movcon, type BreadcrumbItem } from '@/types';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bitacora del Sistema',
        href: '/bitacora',
    },
];

export default function Bitacora({movimientos} : {movimientos: Movcon[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Bitacora del Sistema" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="w-[100px]">Tipo Evento</TableHead>
                            <TableHead className="text-center">Detalle</TableHead>
                            <TableHead className="text-right">Usuario</TableHead>
                            <TableHead className="text-right">Modulo</TableHead>
                            <TableHead className="text-right">Equipo</TableHead>
                            <TableHead className="text-right">Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movimientos.map((mov) => (
                            <TableRow key={mov.id}>
                                <TableCell className="w-[100px]">{mov.id}</TableCell>
                                <TableCell className="w-[100px]">{mov.MOV_EVENTO}</TableCell>
                                <TableCell className="text-center">{mov.MOV_DETALL}</TableCell>
                                <TableCell className="text-right">{mov.MOV_CODOPE}</TableCell>
                                <TableCell className="text-right">{mov.MOV_CODMOD}</TableCell>
                                <TableCell className="text-right">{mov.MOV_EQUIPO}</TableCell>
                                <TableCell className="text-right">{mov.MOV_FECOPE}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
    )
}
