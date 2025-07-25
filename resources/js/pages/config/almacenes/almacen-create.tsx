import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormEventHandler } from "react";

import { Head, Link, useForm } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { ArrowBigLeftIcon, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crear Almacen',
        href: '/almacenes',
    },
];

type AlmacenForm = {
    ALM_CODIGO: string;
    ALM_NIT:    string;
    ALM_NOMBRE: string;
    ALM_DETALL: string;
};

export default function Almacenes() {
    const { data, setData, post, processing, errors } = useForm<Required<AlmacenForm>>({
        ALM_CODIGO: '',
        ALM_NIT: '',
        ALM_NOMBRE: '',
        ALM_DETALL: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`/almacenes`))
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Crear Almacen" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Crear Almacen</CardTitle>
                        <Link href="/almacenes">
                        <Button variant="outline" className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                            <ArrowBigLeftIcon className="w-4 h-4" />
                            Volver
                        </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-6 gap-x-2 gap-y-2 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Codigo</Label>
                                        <Input id="codigo" placeholder="Ingrese Codigo" value={data.ALM_CODIGO} onChange={(e)=>setData('ALM_CODIGO', e.target.value)} />
                                        { errors.ALM_CODIGO && <p className="text-red-500">{errors.ALM_CODIGO}</p> }
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="nit">Nit</Label>
                                        <Input id="nit" value={data.ALM_NIT} placeholder="Ingrese Nit" onChange={(e)=>setData('ALM_NIT', e.target.value)} />
                                        { errors.ALM_NIT && <p className="text-red-500">{errors.ALM_NIT}</p> }
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input id="nombre" value={data.ALM_NOMBRE} placeholder="Ingrese Nombre" onChange={(e)=>setData('ALM_NOMBRE', e.target.value)} />
                                        { errors.ALM_NOMBRE && <p className="text-red-500">{errors.ALM_NOMBRE}</p> }
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="detallle">Detalle</Label>
                                        <Input id="detallle" value={data.ALM_DETALL} placeholder="Ingrese Detalle" onChange={(e)=>setData('ALM_DETALL', e.target.value)} />
                                        { errors.ALM_DETALL && <p className="text-red-500">{errors.ALM_DETALL}</p> }
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <Button type="submit" className="mt-4 w-full bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" tabIndex={4} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
    )
}
