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
        title: 'Editar Rol',
        href: '/roles',
    },
];

type RolForm = {
    code: string;
    name:    string;
    detail: string;
};

export default function Roles() {
    const { data, setData, post, processing, errors } = useForm<Required<RolForm>>({
        code: '',
        name: '',
        detail: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(`/roles`))
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Crear Rol" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
            <Card>
                <CardHeader>,
                    <div className="flex items-center justify-between">
                        <CardTitle>Editar Rol</CardTitle>
                        <Link href="/roles">
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
                            <div className="flex items-center justify-between">
                                <div className="grid grid-cols-6 gap-x-2 gap-y-2 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="codigo">Codigo</Label>
                                            <Input id="codigo" placeholder="Ingrese Codigo" value={data.code} onChange={(e)=>setData('code', e.target.value)} />
                                            { errors.code && <p className="text-red-500">{errors.code}</p> }
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="nombre">Nombre</Label>
                                            <Input id="nombre" value={data.name} placeholder="Ingrese Nombre" onChange={(e)=>setData('name', e.target.value)} />
                                            { errors.name && <p className="text-red-500">{errors.name}</p> }
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="detallle">Detalle</Label>
                                            <Input id="detallle" value={data.detail} placeholder="Ingrese Detalle" onChange={(e)=>setData('detail', e.target.value)} />
                                            { errors.detail && <p className="text-red-500">{errors.detail}</p> }
                                        </div>
                                    </div>
                                    <div className="sm:col-span-6">
                                        <Button type="submit" className="mt-4 w-full bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" tabIndex={4} disabled={processing}>
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
        </div>
    </AppLayout>
    )
}
