import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ShoppingCart, DollarSign,
    FileText,
    Building2
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Comercial } from '@/types';
import { parseISO, format, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard({
  periodos,
  sedes
}: {
  periodos: Comercial[],
  sedes: Comercial[],
}) {
  const {
    ventasPorSedeMes,
    periodoSeleccionado,
    sedeSeleccionada
  } = usePage().props;

  const [periodo, setPeriodo] = useState(periodoSeleccionado || 'todos');
  const [sede, setSede] = useState(sedeSeleccionada || 'todas');

  const isTodos = periodo === 'todos' || periodo === '';
  const isPorSemana = !isTodos;

  const almacenes = Array.from(new Set(ventasPorSedeMes.map((v: any) => v.codalm)));

  function coincideFiltro(v: any) {
    const coincideSede = sede === 'todas' || v.codalm === sede;
    const coincidePeriodo = periodo === 'todos' || (
      isPorSemana && v.fecope?.startsWith(periodo)
    ) || (
      !isPorSemana && String(v.mes) === periodo
    );
    return coincideSede && coincidePeriodo;
  }

  const ventasFiltradas = ventasPorSedeMes.filter(coincideFiltro);
  const totalVentas = ventasFiltradas.reduce((acc, v) => acc + Number(v.total || 0), 0);

  const ventasPorTipo = ventasFiltradas.reduce((acc, v) => {
    const venta = Number(v.total || 0);
    if (v.dias === '0') {
      acc.contado += venta;
    } else {
      acc.credito += venta;
    }
    return acc;
  }, { contado: 0, credito: 0 });

  const ventasPorDocumento = ventasFiltradas.reduce((acc: any[], v) => {
    const existente = acc.find(a => a.tipdoc === v.tipdoc);
    if (existente) {
      existente.total += Number(v.total || 0);
    } else {
      acc.push({ tipdoc: v.tipdoc, total: Number(v.total || 0) });
    }
    return acc;
  }, []);

  const etiquetasMap = new Map<string, Date>();
  ventasFiltradas.forEach((v: any) => {
    try {
      if (isPorSemana && v.fecope) {
        const fecha = parseISO(v.fecope);
        const inicio = startOfWeek(fecha, { weekStartsOn: 1 });
        const etiqueta = `${format(inicio, 'd MMM', { locale: es })} al ${format(endOfWeek(fecha, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: es })}`;
        etiquetasMap.set(etiqueta, inicio);
      } else if (!isPorSemana && v.mes) {
        const anio = String(v.mes).substring(0, 4);
        const mes = String(v.mes).substring(4, 6);
        const fecha = parseISO(`${anio}-${mes}-01`);
        const etiqueta = format(fecha, 'MMMM yyyy', { locale: es });
        etiquetasMap.set(etiqueta, fecha);
      }
    } catch {}
  });

  const etiquetas = Array.from(etiquetasMap.entries())
    .sort((a, b) => a[1].getTime() - b[1].getTime())
    .map(([et]) => et);

    function cleanNumber(n: any): number {
        const num = Number(n);
        return isFinite(num) ? num : 0;
    }

    const datasets = almacenes.filter(alm => sede === 'todas' || alm === sede).map((alm: string, i: number) => {
        const nombreAlmacen = ventasPorSedeMes.find(v => v.codalm === alm)?.nomalm || alm;

        const data = etiquetas.map((etiqueta) => {
            const suma = ventasFiltradas.filter((v: any) => {
                try {
                    if (isPorSemana && v.fecope && /^\d{4}-\d{2}-\d{2}$/.test(v.fecope)) {
                        const fecha = parseISO(v.fecope);
                        const inicio = startOfWeek(fecha, { weekStartsOn: 1 });
                        const etiquetaCalc = `${format(inicio, 'd MMM', { locale: es })} al ${format(endOfWeek(fecha, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: es })}`;
                        return etiquetaCalc === etiqueta && v.codalm === alm;
                    } else if (!isPorSemana && v.mes) {
                        const anio = String(v.mes).substring(0, 4);
                        const mes = String(v.mes).substring(4, 6);
                        const fecha = parseISO(`${anio}-${mes}-01`);
                        const etiquetaCalc = format(fecha, 'MMMM yyyy', { locale: es });
                        return etiquetaCalc === etiqueta && v.codalm === alm;
                    }
                } catch {
                    return false;
                }
                return false;
            })
            .reduce((sum, v) => sum + cleanNumber(v.total), 0);

            return cleanNumber(suma);
        });

        return {
            label: nombreAlmacen,
            data,
            borderColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
            backgroundColor: `hsla(${(i * 60) % 360}, 70%, 50%, 0.3)`,
            tension: 0.3
        };
    });

    const chartData = {
        labels: etiquetas,
        datasets
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        elements: {
            line: { tension: 0 }
        },
        plugins: {
            legend: { display: true, position: 'top' },
            tooltip: { enabled: true }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                    <Select value={periodo} onValueChange={setPeriodo}>
                        <SelectTrigger className="w-full sm:w-[250px]">
                            <SelectValue placeholder="Seleccione un periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Periodos</SelectLabel>
                                <SelectItem value="todos">Todos</SelectItem>
                            {periodos.map(item => (
                                <SelectItem key={item.id} value={item.period}>{item.period}</SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={sede} onValueChange={setSede}>
                        <SelectTrigger className="w-full sm:w-[250px]">
                            <SelectValue placeholder="Seleccione una sede" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sedes</SelectLabel>
                                <SelectItem value="todas">Todas</SelectItem>
                            {sedes.map((sede, i) => (
                                <SelectItem key={i} value={sede.codalm}>{sede.nomalm}</SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tarjetas resumen */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <ShoppingCart className="w-10 h-10 text-blue-600" />
                            <div>
                                <CardTitle className="text-sm text-gray-700">Total Ventas</CardTitle>
                                <CardDescription className="text-xl font-bold truncate">
                                    ${Number(totalVentas).toLocaleString()}
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <DollarSign className="w-10 h-10 text-orange-600" />
                            <div>
                                <CardTitle className="text-sm text-gray-700">Utilidad / Rentabilidad</CardTitle>
                                <CardDescription className="space-y-1 text-sm">
                                    <p> Utilidad:
                                        <strong>${ventasFiltradas.reduce((acc, v) => acc + Number(v.utilid || 0), 0).toLocaleString()}</strong>
                                    </p>
                                    <p> Rentabilidad:&nbsp;
                                        <strong> {totalVentas > 0 ? ((ventasFiltradas.reduce((acc, v) => acc + Number(v.utilid || 0), 0) / totalVentas) * 100).toFixed(2) : '0.00'}% </strong>
                                    </p>
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <DollarSign className="w-10 h-10 text-green-600" />
                            <div>
                                <CardTitle className="text-sm text-gray-700">Contado vs Crédito</CardTitle>
                                <CardDescription className="space-y-1 text-sm">
                                    <p>Contado: <strong>${ventasPorTipo.contado.toLocaleString()}</strong></p>
                                    <p>Crédito: <strong>${ventasPorTipo.credito.toLocaleString()}</strong></p>
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="sm:col-span-2">
                        <CardHeader className="flex flex-col sm:flex-row gap-6">
                            <FileText className="w-10 h-10 text-purple-600 shrink-0" />
                            <div className="flex flex-col sm:flex-row justify-between w-full gap-6">
                                <div className="flex-1">
                                    <CardTitle className="text-sm text-gray-700 mb-2">Notas</CardTitle>
                                    <CardDescription className="space-y-1 text-sm">
                                    {(() => {
                                        const notas = ventasPorDocumento.filter(item => ['Dev-Ind A Caja', 'Nota Cre. Indep', 'N.Cre A Factura'].includes(item.tipdoc));
                                        const totalNotas = notas.reduce((acc, item) => acc + Number(item.total || 0), 0);
                                        return (
                                            <>
                                                {notas.map((item, i) => (
                                                    <p key={i} className={item.total < 0 ? "text-red-600" : "text-blue-700"}>
                                                    {item.tipdoc}: <strong>${Number(item.total).toLocaleString()}</strong>
                                                    </p>
                                                ))}
                                                <hr className="my-1" />
                                                <p className="text-sm font-semibold">
                                                    Total Notas: <span className="text-red-600">${totalNotas.toLocaleString()}</span>
                                                </p>
                                            </>
                                        );
                                    })()}
                                    </CardDescription>
                                </div>

                                <div className="flex-1 text-left sm:text-right">
                                    <CardTitle className="text-sm text-gray-700 mb-2">Facturas</CardTitle>
                                    <CardDescription className="space-y-1 text-sm">
                                    {(() => {
                                        const facturas = ventasPorDocumento.filter(item => ['Factura de Caja', 'Factura de Venta', 'N.Deb A Factura'].includes(item.tipdoc));
                                        const totalFacturas = facturas.reduce((acc, item) => acc + Number(item.total || 0), 0);
                                        return (
                                            <>
                                                {facturas.map((item, i) => (
                                                    <p key={i} className="text-blue-700">
                                                    {item.tipdoc}: <strong>${Number(item.total).toLocaleString()}</strong>
                                                    </p>
                                                ))}
                                                <hr className="my-1" />
                                                <p className="text-sm font-semibold">
                                                    Total Facturas: <span className="text-blue-800">${totalFacturas.toLocaleString()}</span>
                                                </p>
                                            </>
                                        );
                                    })()}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                {/* Gráfico */}
                <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 overflow-x-auto">
                    <div className="flex items-center mb-4">
                        <Building2 className="w-8 h-8 text-indigo-500 mr-2" />
                        <h3 className="text-lg font-semibold">Ventas por Sede por {isPorSemana ? 'Semana' : 'Mes'}</h3>
                    </div>
                    <div className="min-w-[300px] h-[400px]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
