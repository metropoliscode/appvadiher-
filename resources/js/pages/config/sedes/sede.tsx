import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Sede, BreadcrumbItem } from "@/types";
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
  { title: "Sedes", href: "/sedes" },
];

export default function Sedes({ sedes }: { sedes: Sede[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sede | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    SED_CODIGO: "",
    SED_NOMBRE: "",
    SED_DETALL: "",
    SED_NIT: "",
    SED_TELEFO: "",
    SED_EMAIL: "",
    SED_DIRECC: "",
    SED_CODZON: "",
    SED_CODSUB: "",
    SED_CODALM: "",
    SED_EQUIPO: "",
    SED_ESTADO: 0,
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (sede: Sede) => {
    setEditing(sede);
    setData({
      ...sede,
      SED_ESTADO: sede.SED_ESTADO ?? 0,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta sede?")) {
      router.delete(route("sedes.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...data,
      SED_ESTADO: data.SED_ESTADO === "0" ? "0" : "1",
    };

    if (editing) {
      put(route("sedes.update", editing.id), {
        data: payload,
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("sedes.store"), {
        data: payload,
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sedes" />
      <div className="flex flex-col gap-4 p-4">


          <Button
            onClick={handleCreate}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nueva Sede
          </Button>


        <div className="border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Almacén</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sedes.length ? (
                sedes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.SED_CODIGO}</TableCell>
                    <TableCell>{item.SED_NOMBRE}</TableCell>
                    <TableCell>{item.SED_DETALL}</TableCell>
                    <TableCell>{item.SED_EMAIL}</TableCell>
                    <TableCell>{item.SED_DIRECC}</TableCell>
                    <TableCell>{item.SED_CODALM}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.SED_ESTADO === 1
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        {item.SED_ESTADO === "0" ? "Activo" : "Inactivo"}
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
                  <TableCell colSpan={13} className="text-center py-6">
                    No hay sedes registradas
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
            <DrawerTitle>{editing ? "Editar Sede" : "Nueva Sede"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {[
              "SED_CODIGO", "SED_NOMBRE", "SED_DETALL", "SED_NIT",
              "SED_TELEFO", "SED_EMAIL", "SED_DIRECC", "SED_CODZON",
              "SED_CODSUB", "SED_CODALM", "SED_EQUIPO"
            ].map((field) => (
              <Input
                key={field}
                placeholder={field.replace("SED_", "").replace("_", " ")}
                value={data[field as keyof typeof data]}
                onChange={(e) => setData(field as keyof typeof data, e.target.value)}
                required
              />
            ))}

            {/* Checkbox para estado */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.SED_ESTADO === "1"}
                onChange={(e) => setData("SED_ESTADO", e.target.checked ? "0" : "1")}
                className="accent-green-600 h-4 w-4"
              />
              <label className="text-sm">Activo</label>
            </div>

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
