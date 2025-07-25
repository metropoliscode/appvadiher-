import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Cuentas Contables', href: '/contabilidad/cuentas' },
];

const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toLocaleString('es-PE', { minimumFractionDigits: 2 });
  };


export default function Cuentas({ periodos, sedes, resumen, filters }) {
  const { data, setData, get } = useForm({
    periodo: filters.periodo || '',
    sede: filters.sede || '',
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      get(route('cuentas.index'), { preserveState: true });
    }, 200);
    return () => clearTimeout(delay);
  }, [data.periodo, data.sede]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuentas Contables" />

      <div className="flex flex-col gap-6 p-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Select value={data.periodo} onValueChange={(value) => setData('periodo', value)}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Seleccione un periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Periodos</SelectLabel>
                <SelectItem value="todos">Todos</SelectItem>
                {periodos.map((p, i) => (
                  <SelectItem key={i} value={p.periodo}>{p.periodo}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={data.sede} onValueChange={(value) => setData('sede', value)}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Seleccione una sede" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sedes</SelectLabel>
                <SelectItem value="Todas">Todas</SelectItem>
                {sedes.map((s, i) => (
                  <SelectItem key={i} value={s.codalm}>{s.nomalm}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla expandible */}
        <div className="border rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold p-4 border-b">Resumen Contable (PUC)</h1>

          <Accordion type="multiple" className="w-full divide-y">
            {resumen.map((item) => (
              <AccordionItem key={item.cuenta} value={item.cuenta}>
                <AccordionTrigger className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex-1 font-mono text-sm">{item.cuenta}</div>
                    <div className="w-[100px] text-right text-green-600 font-semibold">
                        {formatCurrency(item.debito)}
                    </div>
                    <div className="w-[100px] text-right text-red-600 font-semibold">
                        {formatCurrency(item.credito)}
                    </div>
                </AccordionTrigger>


                <AccordionContent className="bg-gray-50 px-4 py-3">
                  {item.documentos?.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-600">Documentos relacionados:</h4>
                      <table className="w-full text-sm table-auto border border-gray-200 rounded">
                        <thead>
                          <tr className="bg-white">
                            <th className="text-left px-2 py-1">Tipo Documento</th>
                            <th className="text-right px-2 py-1">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.documentos.map((doc, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-2 py-1">{doc.tipdoc}</td>
                              <td className="px-2 py-1 text-right">
                                {Number(doc.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay documentos asociados.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AppLayout>
  );
}
