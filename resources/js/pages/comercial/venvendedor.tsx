import AppLayout from "@/layouts/app-layout";
import { Comercial, type BreadcrumbItem } from '@/types';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function Ventas({ventas, ventastotal,  periodos} : {ventas: Comercial[], ventastotal: Comercial[], vendedor: Comercial[], periodos: Comercial[]}) {
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
            Inertia.get('/ventas-vendedor', { periodo: debouncedPeriodo }, {
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
                        <SelectLabel>Periodos</SelectLabel>
                        <SelectItem value="0">Todos</SelectItem>
                        {periodos.map((item) => (
                            <SelectItem key={item.id} value={item.period}> {item.period} </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {ventastotal.map((items) => (
                    <div className="col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle> {items.nomalm}</CardTitle>
                                <CardDescription>
                                    <strong>Valor Venta: </strong>{formatoMoneda.format(items.venta)} | <strong>Valor Utilidad: </strong>{formatoMoneda.format(items.utili)}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="text-left">#</TableHead>
                            <TableHead className="text-left">Bodega</TableHead>
                            <TableHead className="text-left">Vendedor</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead className="text-right">Utilidad</TableHead>
                            <TableHead className="text-right">Rentabilidad</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ventas.length ? (
                            ventas.map((mov, index) => (
                                <TableRow key={mov.id}>
                                    <TableCell className="text-left">{++index}</TableCell>
                                    <TableCell className="text-left">{mov.nomalm}</TableCell>
                                    <TableCell className="text-left">{mov.nomven}</TableCell>
                                    <TableCell className="text-right">{formatoMoneda.format(mov.venta)} </TableCell>
                                    <TableCell className="text-right">{formatoMoneda.format(mov.utili)} </TableCell>
                                    <TableCell className="text-right">${((mov.utili / mov.venta) * 100).toFixed(2)} %</TableCell>
                                </TableRow>
                            ))
                        ) : (
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
