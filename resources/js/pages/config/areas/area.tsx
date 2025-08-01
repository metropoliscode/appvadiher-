import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Area, BreadcrumbItem } from "@/types";
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
  { title: "Áreas", href: "/areas" },
];

export default function Areas({ areas }: { areas: Area[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    ARE_CODIGO: "",
    ARE_NOMBRE: "",
    ARE_DETALL: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (area: Area) => {
    setEditing(area);
    setData({
      ARE_CODIGO: area.ARE_CODIGO || "",
      ARE_NOMBRE: area.ARE_NOMBRE || "",
      ARE_DETALL: area.ARE_DETALL || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta área?")) {
      router.delete(route("areas.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("areas.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("areas.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Áreas" />
      <div className="flex flex-col gap-4 p-4">
        <Button
            onClick={handleCreate}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nuevo Area
          </Button>

        <div className="border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.length ? (
                areas.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.ARE_CODIGO}</TableCell>
                    <TableCell>{item.ARE_NOMBRE}</TableCell>
                    <TableCell>{item.ARE_DETALL}</TableCell>
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
                  <TableCell colSpan={4} className="text-center py-6">
                    No hay áreas registradas
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
            <DrawerTitle>{editing ? "Editar Área" : "Nueva Área"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input
              placeholder="Código"
              value={data.ARE_CODIGO}
              onChange={(e) => setData("ARE_CODIGO", e.target.value)}
              required
            />
            <Input
              placeholder="Nombre"
              value={data.ARE_NOMBRE}
              onChange={(e) => setData("ARE_NOMBRE", e.target.value)}
              required
            />
            <Input
              placeholder="Detalle"
              value={data.ARE_DETALL}
              onChange={(e) => setData("ARE_DETALL", e.target.value)}
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
