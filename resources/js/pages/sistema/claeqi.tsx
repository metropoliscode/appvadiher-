import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Almacen, BreadcrumbItem, Cladis } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowBigLeftIcon, DeleteIcon, EditIcon, GlobeIcon, PlusIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Claves de Dispositivos", href: "/cladis" },
];

export default function ClaveDispositivos({ claequipos }: { claequipos: Cladis[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cladis | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    cla_nombre: "",
    cla_usuari: "",
    cla_clave: "",
    cla_nomwif: "",
    cla_clawif: "",
    cla_ip: "",
    cla_patron: "",
    cla_serial: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (claequipos: Cladis) => {
    setEditing(claequipos);
    setData({
      cla_nombre: claequipos.cla_nombre || "",
      cla_usuari: claequipos.cla_usuari || "",
      cla_clave: claequipos.cla_clave || "",
      cla_nomwif: claequipos.cla_nomwif || "",
      cla_clawif: claequipos.cla_clawif || "",
      cla_ip: claequipos.cla_ip || "",
      cla_patron: claequipos.cla_patron || "",
      cla_serial: claequipos.cla_serial || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      router.delete(route("claequipos.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("claequipos.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("claequipos.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Claves de Dispositivos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex gap-4 mt-4 w-full">
                    <Link href="/contrasenas" className="w-[30%]">
                        <Button
                        variant="outline"
                        className="w-full bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                        >
                        <ArrowBigLeftIcon className="w-4 h-4 mr-2" />
                        Volver
                        </Button>
                    </Link>
                    <Button
                        onClick={handleCreate}
                        className="w-[70%] bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                        tabIndex={4}
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nueva Clave
                    </Button>
                </div>
                <div className="border rounded-xl overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Nombre WiFi</TableHead>
                            <TableHead>IP</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {claequipos.length ? (
                            claequipos.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.cla_nombre}</TableCell>
                                <TableCell>{item.cla_usuari}</TableCell>
                                <TableCell>{item.cla_nomwif}</TableCell>
                                <TableCell>{item.cla_ip}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            if (item.cla_ip) {
                                                window.open(`https://${item.cla_ip}`, "_blank");
                                            } else {
                                                alert("IP no disponible");
                                            }
                                        }}
                                    >
                                    <GlobeIcon className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                    <EditIcon className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                    <DeleteIcon className="w-4 h-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={9} className="text-center py-6">
                                No hay claves registradas
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        {/* Drawer lateral */}
        <Drawer
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) reset();
                setOpen(isOpen);
            }}
            direction="right"
            className="drawer-end"
            >

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                    {editing ? "Editar Clave" : "Nueva Clave de Dispositivo"}
                    </DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <Input
                    placeholder="Nombre"
                    value={data.cla_nombre}
                    onChange={(e) => setData("cla_nombre", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="Usuario"
                    value={data.cla_usuari}
                    onChange={(e) => setData("cla_usuari", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="Clave"
                    type="password"
                    value={data.cla_clave}
                    onChange={(e) => setData("cla_clave", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="Nombre WiFi"
                    value={data.cla_nomwif}
                    onChange={(e) => setData("cla_nomwif", e.target.value)}
                    />
                    <Input
                    placeholder="Clave WiFi"
                    value={data.cla_clawif}
                    onChange={(e) => setData("cla_clawif", e.target.value)}
                    />
                    <Input
                    placeholder="IP"
                    value={data.cla_ip}
                    onChange={(e) => setData("cla_ip", e.target.value)}
                    />
                    <Input
                    placeholder="Patrón"
                    value={data.cla_patron}
                    onChange={(e) => setData("cla_patron", e.target.value)}
                    />
                    <Input
                    placeholder="Serial"
                    value={data.cla_serial}
                    onChange={(e) => setData("cla_serial", e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {editing ? "Actualizar" : "Guardar"}
                    </Button>
                    </div>
                </form>
                </DrawerContent>
            </Drawer>
        </AppLayout>
    );
}
