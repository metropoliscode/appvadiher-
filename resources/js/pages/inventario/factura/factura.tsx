import { BreadcrumbItem, Factura } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormEventHandler, useState } from 'react';
import { LoaderCircle } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facturas',
        href: '/facturas',
    },
];

type FacturaForm = {
    predoc: string;
    numdoc: string;
};

export default function Facturas({facturas} : {facturas: Factura[]}) {
    const [prefijo, setPrefijo] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm<Required<FacturaForm>>({
        predoc: '',
        numdoc: ''
    });

    const PrefijoChange = (value: string) => {
        if(value == 'Remision'){
            setPrefijo('REV');
        }else if(value == 'Factura Caja'){
            setPrefijo('FEVE');
        }else if(value == 'Factura Electronica'){
            setPrefijo('FEVC');
        }
    };

    const submit: FormEventHandler = (e) => {
        console.log(prefijo)
        e.preventDefault();
        post(route('facturas.store'), {
            onFinish: () => reset('predoc','numdoc'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Facturas" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Card>
                <CardHeader>,
                    <div className="flex items-center justify-between">
                        <CardTitle>Agregar Factura</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-12">
                                    <div className="sm:col-span-2 col-span-12">
                                        <div className="flex flex-col space-y-2">
                                            <Select onValueChange={PrefijoChange}>
                                                <SelectTrigger className="w-[250px]">
                                                    <SelectValue placeholder="Seleccione un Tipo Documento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="Remision">Remision</SelectItem>
                                                        <SelectItem value="Factura Caja">Factura Caja</SelectItem>
                                                        <SelectItem value="Factura Electronica">Factura Electronica</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 col-span-12">
                                        <div className="flex flex-col space-y-2">
                                            <Input id="predoc" value={prefijo} placeholder="Ingrese Prefijo" onChange={(e)=>setData('predoc', e.target.value)} />
                                            { errors.predoc && <p className="text-red-500">{errors.predoc}</p> }
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 col-span-12">
                                        <div className="flex flex-col space-y-2">
                                            <Input id="numdoc" value={data.numdoc} placeholder="Ingrese Numero Documeto" onChange={(e)=>setData('numdoc', e.target.value)} />
                                            { errors.numdoc && <p className="text-red-500">{errors.numdoc}</p> }
                                        </div>
                                    </div>
                                    <div className="sm:col-span-6 col-span-12">
                                        <Button type="submit" className="w-full bg-transparent hover:bg-green-700 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded" tabIndex={4} disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="text-center">Prefijo</TableHead>
                            <TableHead className="text-center">Numero</TableHead>
                            <TableHead className="text-center">Tipo Documento</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facturas.length ? (
                            facturas.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-[100px]">{++index}</TableCell>
                                <TableCell className="w-[100px]">{item.fac_predoc}</TableCell>
                                <TableCell className="text-center">{item.fac_numdoc}</TableCell>
                                <TableCell className="text-right">{item.fac_tipdoc}</TableCell>
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

