import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { BreadcrumbItem, Clacor } from "@/types";
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
import { ArrowBigLeftIcon, DeleteIcon, EditIcon, PlusIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Claves de Correos", href: "/clacorreos" },
];

export default function ClaveCorreos({ clacorreos }: { clacorreos: Clacor[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Clacor | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    cla_correo: "",
    cla_clave: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (correo: Clacor) => {
    setEditing(correo);
    setData({
      cla_correo: correo.cla_correo || "",
      cla_clave: correo.cla_clave || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este correo?")) {
      router.delete(route("clacor.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("clacor.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("clacor.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Claves de Correos" />
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
                    Nuevo Correo
                </Button>
            </div>
            <div className="border rounded-xl overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead>Correo</TableHead>
                        <TableHead>Clave</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {clacorreos.length ? (
                        clacorreos.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.cla_correo}</TableCell>
                            <TableCell>{item.cla_clave}</TableCell>
                            <TableCell className="text-right space-x-2">
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
                        <TableCell colSpan={3} className="text-center py-6">
                            No hay correos registrados
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
            >
                <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{editing ? "Editar Correo" : "Nuevo Correo"}</DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <Input
                    placeholder="Correo"
                    value={data.cla_correo}
                    onChange={(e) => setData("cla_correo", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="Clave"
                    type="password"
                    value={data.cla_clave}
                    onChange={(e) => setData("cla_clave", e.target.value)}
                    required
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
