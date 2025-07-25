import AppLayout from "@/layouts/app-layout";
import { Comercial, type BreadcrumbItem } from '@/types';
import { Head, useForm } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Importar Venta',
        href: '/bitacora',
    },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
})


export default function Importar({ventas} : {ventas: Comercial[]}) {
    const { data, setData, post, processing } = useForm({
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/importar-excel-ventas');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Bitacora del Sistema" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <form onSubmit={submit} encType="multipart/form-data">
                <div className="flex items-center justify-between">
                    <Input id="picture" type="file" name="file" accept=".xlsx, .xls" onChange={e => setData('file', e.target.files[0])} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                    <Button  type="submit"  tabIndex={4} disabled={processing} variant="outline" className="bg-transparent hover:bg-green-700 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-700 hover:border-transparent rounded">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Cargar
                    </Button>
                </div>
            </form>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="w-[100px]">Fecha</TableHead>
                            <TableHead className="w-[100px]">Sede</TableHead>
                            <TableHead className="text-center">Factura</TableHead>
                            <TableHead className="text-center">Vendedor</TableHead>
                            <TableHead className="text-right">Tipo Documento</TableHead>
                            <TableHead className="text-right">Vr Costo</TableHead>
                            <TableHead className="text-right">Vr Venta</TableHead>
                            <TableHead className="text-right">Vr Utilidad</TableHead>
                            <TableHead className="text-right">Rentabilidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ventas.length ?
                            (ventas.map((mov, index) => (
                            <TableRow key={mov.id}>
                                <TableCell className="w-[100px]">{++index}</TableCell>
                                <TableCell className="w-[100px]">{mov.fecope}</TableCell>
                                <TableCell className="w-[100px]">{mov.codalm}</TableCell>
                                <TableCell className="text-center">{mov.predoc} - {mov.numdoc}</TableCell>
                                <TableCell className="text-center">{mov.nitven} - {mov.nomven}</TableCell>
                                <TableCell className="text-right">{mov.tipdoc}</TableCell>
                                <TableCell className="text-right">{formatoMoneda.format(mov.costo)}</TableCell>
                                <TableCell className="text-right">{formatoMoneda.format(mov.venta)}</TableCell>
                                <TableCell className="text-right">{formatoMoneda.format(mov.utili)}</TableCell>
                                <TableCell className="text-center">${((mov.utili / mov.venta) * 100).toFixed(2)} %</TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">No hay Ventas Registradas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
    )
}
