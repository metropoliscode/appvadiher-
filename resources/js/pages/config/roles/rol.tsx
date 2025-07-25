import AppLayout from "@/layouts/app-layout";
import { Rol, type BreadcrumbItem } from '@/types';
import { Head, Link } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { DeleteIcon, EditIcon, PlusIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Roles({roles} : {roles: Rol[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Almacenes" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Link href='/roles/create'>
                <Button  className="mt-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" tabIndex={4} >
                    <PlusIcon className="w-4 h-4" /> Agregar Rol
                </Button>
            </Link>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Detalle</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.length ? (
                            roles.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-[100px]">{++index}</TableCell>
                                <TableCell className="w-[100px]">{item.name}</TableCell>
                                <TableCell className="text-center">{item.detail}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/roles/${item.id}/edit`}>
                                        <Button  className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded" tabIndex={4} >
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded" tabIndex={4} >
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No hay Almacenes Registradas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
    )
}
