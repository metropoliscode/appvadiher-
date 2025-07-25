import AppLayout from "@/layouts/app-layout";
import { Comercial, type BreadcrumbItem } from '@/types';
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function Ventas({ventas, almacen, periodos} : {ventas: Comercial[], almacen: Comercial[], periodos: Comercial[]}) {
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
            Inertia.get('/venta-sede', { periodo: debouncedPeriodo }, {
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
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="text-left">#</TableHead>
                            <TableHead colSpan={2} className="text-center">Fecha</TableHead>
                            {almacen.map((item) => (
                                <TableHead key={item.id} className="text-right">{item.nomalm} </TableHead>
                            ))}
                            <TableHead className="text-right">VALOR TOTAL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ventas.length ?
                            (ventas.map((mov, index) => (
                            <TableRow key={mov.id}>
                                <TableCell className="text-left">{++index}</TableCell>
                                <TableCell className="text-left">{mov.fecope}</TableCell>
                                <TableCell className="text-left">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center text-red-900">Venta</TableHead>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead className="text-center  text-red-900">Uttilidad</TableHead>
                                                </TableRow>
                                            <TableRow>
                                                <TableHead className="text-center  text-red-900">Rentabilidad</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.venta_metropolis)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.utilid_metropolis)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={((mov.utilid_metropolis / mov.venta_metropolis) * 100) > 25 ? 'text-green-900' : 'text-red-900' }>${((mov.utilid_metropolis / mov.venta_metropolis) * 100).toFixed(2)} %</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.venta_distrimetro)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.utilid_distrimetro)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={((mov.utilid_distrimetro / mov.venta_distrimetro) * 100) > 25 ? 'text-green-900' : 'text-red-900' }>${((mov.utilid_distrimetro / mov.venta_distrimetro) * 100).toFixed(2)} %</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell>{formatoMoneda.format(mov.venta_ferrecasas)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>{formatoMoneda.format(mov.utilid_ferrecasas)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={((mov.utilid_ferrecasas / mov.venta_ferrecasas) * 100) > 25 ? 'text-green-900' : 'text-red-900' }>${((mov.utilid_ferrecasas / mov.venta_ferrecasas) * 100).toFixed(2)} %</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell>{formatoMoneda.format(mov.venta_troncal)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>{formatoMoneda.format(mov.utilid_troncal)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={((mov.utilid_troncal / mov.venta_troncal) * 100) > 25 ? 'text-green-900' : 'text-red-900' }>${((mov.utilid_troncal / mov.venta_troncal) * 100).toFixed(2)} %</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell>{formatoMoneda.format(mov.venta_minca)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.utilid_minca)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={((mov.utilid_minca / mov.venta_minca) * 100) > 25 ? 'text-green-900' : 'text-red-900' }>${((mov.utilid_minca / mov.venta_minca) * 100).toFixed(2)} %</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.venta)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell >{formatoMoneda.format(mov.utili)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={((mov.utili / mov.venta) * 100) > 25 ? 'text-green-900' : 'text-red-900' }>${((mov.utili / mov.venta) * 100).toFixed(2)} %</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </TableCell>
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
