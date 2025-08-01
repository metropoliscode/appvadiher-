import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { BreadcrumbItem, Clacre } from "@/types";
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
  { title: "Claves de Dominios", href: "/cladominios" },
];

export default function ClaceDominios({ cladominio }: { cladominio: Clacre[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Clacre | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    cla_domnom: "",
    cla_domurl: "",
    cla_donusu: "",
    cla_domcla: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (item: Clacre) => {
    setEditing(item);
    setData({
      cla_domnom: item.cla_domnom || "",
      cla_domurl: item.cla_domurl || "",
      cla_donusu: item.cla_donusu || "",
      cla_domcla: item.cla_domcla || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este dominio?")) {
      router.delete(route("cladominios.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("cladominios.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("cladominios.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Claves de Dominios" />
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
                        Nueva Credencial
                    </Button>
                </div>
                <div className="border rounded-xl overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Clave</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {cladominio.length ? (
                            cladominio.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.cla_domnom}</TableCell>
                                <TableCell>{item.cla_domurl}</TableCell>
                                <TableCell>{item.cla_donusu}</TableCell>
                                <TableCell>{item.cla_domcla}</TableCell>
                                <TableCell className="text-right space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(item.cla_domurl, "_blank")}
                                >
                                    <GlobeIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(item)}
                                >
                                    <EditIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <DeleteIcon className="w-4 h-4" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                                No hay dominios registrados
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
                    <DrawerTitle>
                    {editing ? "Editar Dominio" : "Nuevo Dominio"}
                    </DrawerTitle>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <Input
                    placeholder="Nombre del Dominio"
                    value={data.cla_domnom}
                    onChange={(e) => setData("cla_domnom", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="URL del Dominio"
                    value={data.cla_domurl}
                    onChange={(e) => setData("cla_domurl", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="Usuario"
                    value={data.cla_donusu}
                    onChange={(e) => setData("cla_donusu", e.target.value)}
                    required
                    />
                    <Input
                    placeholder="Clave"
                    value={data.cla_domcla}
                    onChange={(e) => setData("cla_domcla", e.target.value)}
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
