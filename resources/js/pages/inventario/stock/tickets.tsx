import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, refere } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/group-button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ticket', href: '/inventarios/ticket' },
];

interface ReferePagination {
    data: refere[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Ticket({ refere }: { refere: ReferePagination }) {
    const [file, setFile] = useState<File | null>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [progressMessage, setProgressMessage] = useState<string | null>(null);

    const handleImport = () => {
        if (!file) return alert("Selecciona un archivo Excel primero");
        const formData = new FormData();
        formData.append("file", file);
        router.post("/inventarios/ticket/import", formData);
    };

    const handleExport = () => {
        window.location.href = "/inventarios/ticket/export";
    };

    const handlePdf = async () => {
        try {
            setLoadingPdf(true);
            setProgressMessage('Generando todos los tickets, por favor espera...');

            const response = await fetch("/inventarios/ticket/pdf");
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tickets_completo.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setProgressMessage('✅ Tickets generados correctamente.');
        } catch (error) {
            console.error("Error al generar el PDF", error);
            setProgressMessage('❌ Ocurrió un error al generar el PDF.');
        } finally {
            setLoadingPdf(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket" />
            <div className="p-6 space-y-6 bg-white rounded-xl shadow-md">
                {/* Controles */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Input
                        id="file"
                        type="file"
                        name="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full"
                    />
                    <ButtonGroup>
                        <Button onClick={handleExport} variant="outline" disabled={loadingPdf}>
                            Generar archivo
                        </Button>
                        <Button onClick={handleImport} variant="green" disabled={loadingPdf}>
                            Importar
                        </Button>
                        <Button onClick={handlePdf} variant="cyan" disabled={loadingPdf}>
                            {loadingPdf && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                            {loadingPdf ? 'Generando tickets...' : 'Generar Tickets'}
                        </Button>
                    </ButtonGroup>
                </div>

                {loadingPdf ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                            <Loader2 className="animate-spin w-5 h-5" />
                            Generando PDF, por favor espera...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            {refere.data.length > 0 ? (
                                <table className="min-w-full border border-gray-300 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border">Referencia</th>
                                            <th className="px-4 py-2 border">Nombre</th>
                                            <th className="px-4 py-2 border">Código</th>
                                            <th className="px-4 py-2 border">Und. Med.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {refere.data.map((ref) => (
                                            <tr key={ref.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border">{ref.ref_refere}</td>
                                                <td className="px-4 py-2 border">{ref.ref_nombre}</td>
                                                <td className="px-4 py-2 border">{ref.ref_codigo}</td>
                                                <td className="px-4 py-2 border">{ref.ref_undmed}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-gray-600 text-center">
                                    No hay referencias registradas.
                                </p>
                            )}
                        </div>

                        {/* Paginación */}
                        {refere.links.length > 3 && (
                            <div className="flex flex-wrap items-center gap-2">
                                {refere.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`px-3 py-1 text-sm rounded border transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white hover:bg-gray-100 text-gray-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </AppLayout>
    );
}
