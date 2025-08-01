import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Modulo, BreadcrumbItem } from "@/types";
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
  { title: "Módulos", href: "/modulos" },
];

export default function Modulos({ modulos }: { modulos: Modulo[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Modulo | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    MOD_CODIGO: "",
    MOD_NOMBRE: "",
    MOD_DETALL: "",
    MOD_URL: "",
    MOD_ICONO: "",
    MOD_ESTADO: 0,
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    setEditing(modulo);
    setData({
      MOD_CODIGO: modulo.MOD_CODIGO || "",
      MOD_NOMBRE: modulo.MOD_NOMBRE || "",
      MOD_DETALL: modulo.MOD_DETALL || "",
      MOD_URL: modulo.MOD_URL || "",
      MOD_ICONO: modulo.MOD_ICONO || "",
      MOD_ESTADO: modulo.MOD_ESTADO || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este módulo?")) {
      router.delete(route("modulos.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("modulos.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("modulos.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Módulos" />
      <div className="flex flex-col gap-4 p-4">
          <Button
            onClick={handleCreate}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nuevo Módulo
          </Button>
        

        <div className="border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Ícono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modulos.length ? (
                modulos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.MOD_CODIGO}</TableCell>
                    <TableCell>{item.MOD_NOMBRE}</TableCell>
                    <TableCell>{item.MOD_DETALL}</TableCell>
                    <TableCell>{item.MOD_URL}</TableCell>
                    <TableCell>{item.MOD_ICONO}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <div
                            className={`w-3 h-3 rounded-full ${
                                item.MOD_ESTADO === 1 ? "bg-green-500" : "bg-red-500"
                            }`}
                            ></div>
                            {item.MOD_ESTADO === 1 ? "Activo" : "Inactivo"}
                        </div>
                    </TableCell>

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
                  <TableCell colSpan={7} className="text-center py-6">
                    No hay módulos registrados
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
            <DrawerTitle>{editing ? "Editar Módulo" : "Nuevo Módulo"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input
              placeholder="Código"
              value={data.MOD_CODIGO}
              onChange={(e) => setData("MOD_CODIGO", e.target.value)}
              required
            />
            <Input
              placeholder="Nombre"
              value={data.MOD_NOMBRE}
              onChange={(e) => setData("MOD_NOMBRE", e.target.value)}
              required
            />
            <Input
              placeholder="Detalle"
              value={data.MOD_DETALL}
              onChange={(e) => setData("MOD_DETALL", e.target.value)}
              required
            />
            <Input
              placeholder="URL"
              value={data.MOD_URL}
              onChange={(e) => setData("MOD_URL", e.target.value)}
              required
            />
            <Input
              placeholder="Ícono"
              value={data.MOD_ICONO}
              onChange={(e) => setData("MOD_ICONO", e.target.value)}
              required
            />
            <input
                type="checkbox"
                checked={data.MOD_ESTADO === 1}
                onChange={(e) => setData("MOD_ESTADO", e.target.checked ? 0 : 1)}
                className="accent-green-600 h-4 w-4"
            />
            <label className="text-sm">{data.MOD_ESTADO === 1 ? ' ACTIVO' : ' INACTIVO'}</label>
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
