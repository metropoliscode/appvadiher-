import AppLayout from "@/layouts/app-layout";
import { Comercial, type BreadcrumbItem } from '@/types';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Venta Diaria',
        href: '/ventas',
    },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
})

export default function Ventas({ventas, periodos} : {ventas: Comercial[], periodos: Comercial[]}) {
    const [periodo, setPeriodo] = useState<string>('');
    const [debouncedPeriodo, setDebouncedPeriodo] = useState(periodo);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPeriodo(periodo);
        }, 500); // Espera de 500ms después de que el usuario deje de cambiar el filtro

        return () => clearTimeout(timer); // Limpiar el timer anterior si el filtro cambia antes de que termine el tiempo
    }, [periodo]);

    useEffect(() => {
        if (debouncedPeriodo) {
            Inertia.get('/ventas', { periodo: debouncedPeriodo }, {
                preserveState: true, // Mantener el estado de los filtros
                replace: true, // Evitar que se agregue una nueva entrada al historial
            });
        }
    }, [debouncedPeriodo]);

    const PeriodoChange = (value: string) => {
        setPeriodo(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Venta Diaria" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex justify-end">
                <Select value={String(periodo)} onValueChange={PeriodoChange}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Seleccione un Periodo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="0">Todos</SelectItem>
                        {periodos.map((item) => (
                            <SelectItem key={item.id} value={String(item.period)}> {item.period} </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="w-[100px]">Fecha</TableHead>
                            <TableHead className="text-center">contado</TableHead>
                            <TableHead className="text-center">Credito</TableHead>
                            <TableHead className="text-center">Vr. Total</TableHead>
                            <TableHead className="text-center">U.Contado</TableHead>
                            <TableHead className="text-center">U.Credito</TableHead>
                            <TableHead className="text-center">Vr Utilidad</TableHead>
                            <TableHead className="text-center">Rentabilidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ventas.length ?
                            (ventas.map((mov, index) => (
                            <TableRow key={mov.id}>
                                <TableCell className="w-[100px]">{++index}</TableCell>
                                <TableCell className="w-[100px]">{mov.fecope}</TableCell>
                                <TableCell className="text-center">{formatoMoneda.format(mov.venta_contado)}</TableCell>
                                <TableCell className="text-center">{formatoMoneda.format(mov.venta_credito)}</TableCell>
                                <TableCell className="text-center">{formatoMoneda.format(mov.venta)}</TableCell>
                                <TableCell className="text-center">{formatoMoneda.format(mov.utilidad_contado)}</TableCell>
                                <TableCell className="text-center">{formatoMoneda.format(mov.utilidad_credito)}</TableCell>
                                <TableCell className="text-center">{formatoMoneda.format(mov.utili)}</TableCell>
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
