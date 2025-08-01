import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { BreadcrumbItem, User, Rol } from "@/types";
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
import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Usuarios", href: "/usuarios" },
];

export default function Usuarios({ users, roles }: { users: User[]; roles: Rol[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    code: "",
    name: "",
    email: "",
    password: "",
    state: 1,
    role_id: "",
  });

  const handleCreate = () => {
    reset();
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setData({
      code: user.code || "",
      name: user.name || "",
      email: user.email || "",
      password: "", // No mostrar contraseña existente
      state: user.state,
      role_id: user.roles?.[0]?.id?.toString() || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      router.delete(route("usuarios.delete", id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("usuarios.update", editing.id), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("usuarios.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <div className="flex flex-col gap-4 p-4">
        <Button onClick={handleCreate} className="w-fit">
          <PlusIcon className="w-4 h-4 mr-2" /> Nuevo Usuario
        </Button>

        <div className="border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.code}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${user.state === 1 ? "bg-green-500" : "bg-red-500"}`} />
                        {user.state === 1 ? "Activo" : "Inactivo"}
                      </div>
                    </TableCell>
                    <TableCell>{user.roles?.[0]?.name || "Sin rol"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Drawer open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o); }} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editing ? "Editar Usuario" : "Nuevo Usuario"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input placeholder="Código" value={data.code} onChange={(e) => setData("code", e.target.value)} required />
            <Input placeholder="Nombre" value={data.name} onChange={(e) => setData("name", e.target.value)} required />
            <Input placeholder="Email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} required />
            <Input placeholder="Contraseña" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} />
            <Select value={data.role_id} onValueChange={(value) => setData("role_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((rol) => (
                  <SelectItem key={rol.id} value={rol.id.toString()}>{rol.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.state === 1}
                onChange={(e) => setData("state", e.target.checked ? 1 : 0)}
                className="accent-green-600 h-4 w-4"
              />
              {data.state === 1 ? "Activo" : "Inactivo"}
            </label>
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
