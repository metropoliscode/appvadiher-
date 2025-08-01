import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Almacen, BreadcrumbItem } from "@/types";
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
  { title: "Almacenes", href: "/almacenes" },
];

export default function Almacenes({ almacenes }: { almacenes: Almacen[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Almacen | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    ALM_CODIGO: "",
    ALM_NIT: "",
    ALM_NOMBRE: "",
    ALM_DETALL: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (almacen: Almacen) => {
    setEditing(almacen);
    setData({
      ALM_CODIGO: almacen.ALM_CODIGO || "",
      ALM_NIT: almacen.ALM_NIT || "",
      ALM_NOMBRE: almacen.ALM_NOMBRE || "",
      ALM_DETALL: almacen.ALM_DETALL || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este almacén?")) {
      router.delete(route("almacenes.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("almacenes.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("almacenes.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Almacenes" />
      <div className="flex flex-col gap-4 p-4">
          <Button
            onClick={handleCreate}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nuevo Almacén
          </Button>

        <div className="border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {almacenes.length ? (
                almacenes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.ALM_CODIGO}</TableCell>
                    <TableCell>{item.ALM_NIT}</TableCell>
                    <TableCell>{item.ALM_NOMBRE}</TableCell>
                    <TableCell>{item.ALM_DETALL}</TableCell>
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
                  <TableCell colSpan={5} className="text-center py-6">
                    No hay almacenes registrados
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
            <DrawerTitle>{editing ? "Editar Almacén" : "Nuevo Almacén"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input
              placeholder="Código"
              value={data.ALM_CODIGO}
              onChange={(e) => setData("ALM_CODIGO", e.target.value)}
              required
            />
            <Input
              placeholder="NIT"
              value={data.ALM_NIT}
              onChange={(e) => setData("ALM_NIT", e.target.value)}
              required
            />
            <Input
              placeholder="Nombre"
              value={data.ALM_NOMBRE}
              onChange={(e) => setData("ALM_NOMBRE", e.target.value)}
              required
            />
            <Input
              placeholder="Detalle"
              value={data.ALM_DETALL}
              onChange={(e) => setData("ALM_DETALL", e.target.value)}
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
