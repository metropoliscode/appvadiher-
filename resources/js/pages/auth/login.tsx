import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { __ } from '@/i18n';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    code: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        code: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Iniciar Seccion con su Cuenta" description="Ingrese sus credenciales para iniciar sesion">
            <Head title="Iniciar Seccion" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Usuario</Label>
                        <Input id="email" type="text" required autoFocus tabIndex={1} autoComplete="email" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="Nombre Usuario" />
                        <InputError message={errors.code} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Contraseña</Label>
                        </div>
                        <Input id="password" type="password" required tabIndex={2} autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" checked={data.remember} onClick={() => setData('remember', !data.remember)} tabIndex={3} />
                        <Label htmlFor="remember">Recordar Cuenta</Label>
                        {canResetPassword && (
                            <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                Restablecer Contraseña
                            </TextLink>
                        )}
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {__('Log In')}
                    </Button>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
