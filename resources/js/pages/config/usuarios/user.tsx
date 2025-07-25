import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { BreadcrumbItem, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@headlessui/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Alert {
  type: 'success' | 'danger';
  message: string;
}

interface UserIndexProps {
  users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

const UserIndex: React.FC<UserIndexProps> = ({ users } : {users: User[]}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    id: '',
    code: '',
    name: '',
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState<Alert | null>(null);

  const handleShow = (user?: User) => {
    if (user) {
      setIsEdit(true);
      setUserData(user);
    } else {
      setIsEdit(false);
      setUserData({ id: '', code: '', name: '', email: '', password: '' });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      Inertia.put(`/users/${userData.id}`, userData)
        .then(() => {
          setAlert({ type: 'success', message: 'Usuario actualizado correctamente' });
          setShowModal(false);
        })
        .catch(() => {
          setAlert({ type: 'danger', message: 'Error al actualizar el usuario' });
        });
    } else {
      Inertia.post('/users', userData)
        .then(() => {
          setAlert({ type: 'success', message: 'Usuario agregado correctamente' });
          setShowModal(false);
        })
        .catch(() => {
          setAlert({ type: 'danger', message: 'Error al agregar el usuario' });
        });
    }
  };

  const handleDelete = (id: number) => {
    Inertia.delete(`/users/${id}`)
      .then(() => {
        setAlert({ type: 'success', message: 'Usuario eliminado correctamente' });
      })
      .catch(() => {
        setAlert({ type: 'danger', message: 'Error al eliminar el usuario' });
      });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Almacenes" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex justify-end">
                <Button onClick={() => handleShow()} className="mt-4 w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" tabIndex={4} >
                    Agregar Usuario
                </Button>
            </div>
             {/* Mostrar alerta */}
            {alert && (
                <div className={`alert alert-${alert.type} p-4 rounded mb-4`} role="alert">
                <span className="font-semibold">{alert.message}</span>
                <button onClick={() => setAlert(null)} className="ml-2 text-xl">×</button>
                </div>
            )}
            {/* Modal para agregar/editar usuario */}
            <div className={`modal ${showModal ? 'block' : 'hidden'}`}>
                <div className="border-b border-gray-900/10 pb-2">
                    <form onSubmit={handleSubmit}>
                        <h3 className='text-center'>{isEdit ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
                        <div className="grid grid-cols-5 gap-x-2 gap-y-2 sm:grid-cols-5">
                            <div className="sm:col-span-1">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input value={userData.code} onChange={handleChange} type="text" name="floating_code" id="floating_code" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Usuario</label>
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input value={userData.name} onChange={handleChange} type="text" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
                                </div>
                            </div>

                            <div className="sm:col-span-1">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input value={userData.email} onChange={handleChange} type="text" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo</label>
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <div className="relative z-0 w-full mb-5 group">
                                    <input value={userData.password} onChange={handleChange} type="text" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <div className="inline-flex rounded-md shadow-xs items-end" role="group">
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-green-600 hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-green-700 dark:focus:ring-blue-500 dark:focus:text-white">
                                    {isEdit ? 'Actualizar' : 'Guardar'}
                                </button>
                                <button onClick={handleClose} type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-red-500 hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-red-500 dark:focus:ring-blue-500 dark:focus:text-white">
                                    Cerrar
                                </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                <Table>
                    <TableHeader className="bg-amber-200 text-blue-600">
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead className="text-center">Usuario</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-right">Correo</TableHead>
                            <TableHead className="text-right">Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length ? (
                            users.map((item, index) => (
                            <TableRow key={item.id} onDoubleClick={() => handleShow(item)}>
                                <TableCell className="w-[100px]">{++index}</TableCell>
                                <TableCell className="text-center">{item.code}</TableCell>
                                <TableCell className="text-center">{item.name}</TableCell>
                                <TableCell className="text-right">{item.email}</TableCell>
                                <TableCell className="text-right">{item.state}</TableCell>
                                <TableCell className="text-right">
                                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(item.id)} >
                                        Eliminar
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No hay Sedes Registradas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
    );
};

export default UserIndex;
