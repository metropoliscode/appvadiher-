import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Stock, type BreadcrumbItem } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock', href: '/inventarios/stock' },
];

export default function StockTroncal({ stock, filters }: { stock: Stock[], filters: { search?: string } }) {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    useEffect(() => {
        if (data.search.length >= 4) {
            if (timeoutId) clearTimeout(timeoutId);
            const newTimeout = setTimeout(() => {
                get('/inventarios/stock', {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }); // 3 segundos

            setTimeoutId(newTimeout);
        }
    }, [data.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Input sin botón, ocupa todo el ancho */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="search"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Buscar por referencia o nombre..."
                        className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                    {data.search.length > 0 && data.search.length < 4 && (
                        <p className="text-sm text-gray-500 mt-1">
                            Escribe al menos 4 caracteres para buscar.
                        </p>
                    )}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        <TableHeader className="bg-amber-200 text-blue-600">
                            <TableRow>
                                <TableHead className="text-left">REFERENCIA</TableHead>
                                <TableHead className="text-center">NOMBRE</TableHead>
                                <TableHead className="text-center">UNIDAD</TableHead>
                                <TableHead className="text-right">COSTO</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stock.length ? (
                                stock.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="w-[100px]">{item.refere}</TableCell>
                                        <TableCell className="text-center">{item.nombre}</TableCell>
                                        <TableCell className="text-center">{item.undmed}</TableCell>
                                        <TableCell className="text-center">{item.valund}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">No hay Referencias Registradas</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
