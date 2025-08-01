import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { BreadcrumbItem, Equipos } from "@/types";
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
import { DeleteIcon, EditIcon, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Equipos", href: "/equipos" },
];

export default function EquiposPage({ equipos }: { equipos: Equipos[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipos | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    equ_nombre: "",
    equ_marca: "",
    equ_modelo: "",
    equ_serial: "",
    equ_ramtip: "",
    equ_ramcap: "",
    equ_hddtip: "",
    equ_hddcap: "",
    equ_progen: "",
    equ_prodet: "",
    equ_grafic: "",
    equ_dirmac: "",
    equ_usuasi: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (item: Equipos) => {
    setEditing(item);
    setData({
      equ_nombre: item.equ_nombre || "",
      equ_marca: item.equ_marca || "",
      equ_modelo: item.equ_modelo || "",
      equ_serial: item.equ_serial || "",
      equ_ramtip: item.equ_ramtip || "",
      equ_ramcap: item.equ_ramcap || "",
      equ_hddtip: item.equ_hddtip || "",
      equ_hddcap: item.equ_hddcap || "",
      equ_progen: item.equ_progen || "",
      equ_prodet: item.equ_prodet || "",
      equ_grafic: item.equ_grafic || "",
      equ_dirmac: item.equ_dirmac || "",
      equ_usuasi: item.equ_usuasi || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este equipo?")) {
      router.delete(route("equipos.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("equipos.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("equipos.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Equipos" />
      <div className="flex flex-col gap-4 p-4">
        <Button
          onClick={handleCreate}
          className="self-start bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Nuevo Equipo
        </Button>

        <div className="border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Capacidad RAM</TableHead>
                <TableHead>Disco</TableHead>
                <TableHead>Capacidad Disco</TableHead>
                <TableHead>Generación</TableHead>
                <TableHead>Procesador</TableHead>
                <TableHead>Gráfica</TableHead>
                <TableHead>MAC</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipos.length ? (
                equipos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.equ_nombre}</TableCell>
                    <TableCell>{item.equ_marca}</TableCell>
                    <TableCell>{item.equ_modelo}</TableCell>
                    <TableCell>{item.equ_serial}</TableCell>
                    <TableCell>{item.equ_ramtip}</TableCell>
                    <TableCell>{item.equ_ramcap}</TableCell>
                    <TableCell>{item.equ_hddtip}</TableCell>
                    <TableCell>{item.equ_hddcap}</TableCell>
                    <TableCell>{item.equ_progen}</TableCell>
                    <TableCell>{item.equ_prodet}</TableCell>
                    <TableCell>{item.equ_grafic}</TableCell>
                    <TableCell>{item.equ_dirmac}</TableCell>
                    <TableCell>{item.equ_usuasi}</TableCell>
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
                    No hay equipos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Drawer open={open} onOpenChange={(val) => { if (!val) reset(); setOpen(val); }} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editing ? "Editar Equipo" : "Nuevo Equipo"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input placeholder="Nombre" value={data.equ_nombre} onChange={(e) => setData("equ_nombre", e.target.value)} required />
            <Input placeholder="Marca" value={data.equ_marca} onChange={(e) => setData("equ_marca", e.target.value)} required />
            <Input placeholder="Modelo" value={data.equ_modelo} onChange={(e) => setData("equ_modelo", e.target.value)} required />
            <Input placeholder="Serial" value={data.equ_serial} onChange={(e) => setData("equ_serial", e.target.value)} />

            <Select value={data.equ_ramtip} onValueChange={(val) => setData("equ_ramtip", val)}>
              <SelectTrigger><SelectValue placeholder="Tipo de RAM" /></SelectTrigger>
              <SelectContent>
                {['DDR1','DDR2','DDR3','DDR4','DDR5'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input placeholder="Capacidad RAM" value={data.equ_ramcap} onChange={(e) => setData("equ_ramcap", e.target.value)} required />

            <Select value={data.equ_hddtip} onValueChange={(val) => setData("equ_hddtip", val)}>
              <SelectTrigger><SelectValue placeholder="Tipo de Disco" /></SelectTrigger>
              <SelectContent>
                {['HDD','SSD','M2'].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>

            <Input placeholder="Capacidad Disco" value={data.equ_hddcap} onChange={(e) => setData("equ_hddcap", e.target.value)} required />
            <Input placeholder="Generación" value={data.equ_progen} onChange={(e) => setData("equ_progen", e.target.value)} required />
            <Input placeholder="Detalle Procesador" value={data.equ_prodet} onChange={(e) => setData("equ_prodet", e.target.value)} required />
            <Input placeholder="Gráfica" value={data.equ_grafic} onChange={(e) => setData("equ_grafic", e.target.value)} />
            <Input placeholder="Dirección MAC" value={data.equ_dirmac} onChange={(e) => setData("equ_dirmac", e.target.value)} />
            <Input placeholder="Usuario asignado" value={data.equ_usuasi} onChange={(e) => setData("equ_usuasi", e.target.value)} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={processing}>{editing ? "Actualizar" : "Guardar"}</Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
}
