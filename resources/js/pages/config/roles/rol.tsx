import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Permission, Rol } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowBigLeftIcon, DeleteIcon, EditIcon, KeyIcon, PlusIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Roles({ roles, permisos }: { roles: Rol[]; permisos: Permission[]; }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Rol | null>(null);
    const [permisosOpen, setPermisosOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Rol | null>(null);
    const [groupedPermisos, setGroupedPermisos] = useState<{ [modulo: string]: { name: string; detail: string; enabled: boolean }[]; }>({});

    const { data, setData, post, put, processing, reset } = useForm({
        code: "",
        name: "",
        detail: "",
    });

    const handleCreate = () => {
        reset();
        setEditing(null);
        setOpen(true);
    };

    const handleEdit = (rol: Rol) => {
        setEditing(rol);
        setData({
        code: rol.code || "",
        name: rol.name || "",
        detail: rol.detail || "",
        });
        setOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este rol?")) {
        router.delete(route("roles.delete", id));
        }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(route("roles.update", editing.code), {
        onSuccess: () => setOpen(false),
      });
    } else {
      post(route("roles.store"), {
        onSuccess: () => setOpen(false),
      });
    }
  };

  const handlePermisos = (rol: Rol) => {
    setSelectedRole(rol);
    const userPerms = rol.permissions?.map((p) => p.name) ?? [];

    const agrupados: {
      [modulo: string]: { name: string; detail: string; enabled: boolean }[];
    } = {};

    for (const perm of permisos) {
      if (!agrupados[perm.codmod]) agrupados[perm.codmod] = [];

      agrupados[perm.codmod].push({
        name: perm.name,
        detail: perm.detail,
        enabled: userPerms.includes(perm.name),
      });
    }

    setGroupedPermisos(agrupados);
    setPermisosOpen(true);
  };

  const togglePermiso = (modulo: string, index: number) => {
    setGroupedPermisos((prev) => ({
      ...prev,
      [modulo]: prev[modulo].map((perm, i) =>
        i === index ? { ...perm, enabled: !perm.enabled } : perm
      ),
    }));
  };

  const guardarPermisos = () => {
    if (!selectedRole) return;

    const asignados = Object.entries(groupedPermisos)
      .flatMap(([mod, perms]) =>
        perms.filter((p) => p.enabled).map((p) => p.name)
      );

    router.post(route("roles.permisos", selectedRole.code), {
      permisos: asignados,
    }, {
      onSuccess: () => setPermisosOpen(false),
    });
  };

  return (
    <AppLayout>
      <Head title="Roles" />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-4 mt-4 w-full">
          <Link href="/" className="w-[30%]">
            <Button
              variant="outline"
              className="w-full bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white"
            >
              <ArrowBigLeftIcon className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Button
            onClick={handleCreate}
            className="w-[70%] bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nuevo Rol
          </Button>
        </div>

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
              {roles.length ? (
                roles.map((role) => (
                  <TableRow key={role.code}>
                    <TableCell>{role.code}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.detail}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(role)}>
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(role.code)}>
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handlePermisos(role)}>
                        <KeyIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No hay roles registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Drawer Crear/Editar */}
      <Drawer open={open} onOpenChange={(isOpen) => { if (!isOpen) reset(); setOpen(isOpen); }} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editing ? "Editar Rol" : "Nuevo Rol"}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input placeholder="Código" value={data.code} onChange={(e) => setData("code", e.target.value)} required />
            <Input placeholder="Nombre" value={data.name} onChange={(e) => setData("name", e.target.value)} required />
            <Input placeholder="Detalle" value={data.detail} onChange={(e) => setData("detail", e.target.value)} />
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

      {/* Drawer Permisos */}
      <Drawer open={permisosOpen} onOpenChange={setPermisosOpen}>
        <DrawerContent className="flex flex-col h-screen">
          <DrawerHeader>
            <DrawerTitle>Permisos: {selectedRole?.name}</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {Object.entries(groupedPermisos).map(([mod, perms]) => (
                <Card key={mod}>
                  <CardHeader>
                    <CardTitle>{mod}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {perms.map((perm, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>{perm.detail}</span>
                        <Switch
                          checked={perm.enabled}
                          onCheckedChange={() => togglePermiso(mod, i)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="pt-4 text-right space-x-2 px-4 pb-4 border-t">
            <Button variant="outline" onClick={() => setPermisosOpen(false)}>Cancelar</Button>
            <Button onClick={guardarPermisos}>Guardar</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
}
