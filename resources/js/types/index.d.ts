import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface ToastMessage  {
    type: ToastType;
    message: string;
};

export interface Almacen {
    id: number;
    ALM_CODIGO: string;
    ALM_NOMBRE: string;
    ALM_DETALL: string;
    ALM_NIT:    string;
    ALM_EQUIPO: string;
    ALM_ESTADO: string;
    ALM_DELETE: string;
    ALM_CODOPE: string;
    ALM_CODUSU: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Sede {
    id: number;
    SED_CODIGO: string;
    SED_NOMBRE: string;
    SED_DETALL: string;
    SED_NIT:    string;
    SED_TELEFO: string;
    SED_EMAIL:  string;
    SED_DIRECC: string;
    SED_CODZON: string;
    SED_CODSUB: string;
    SED_CODALM: string;
    SED_EQUIPO: string;
    SED_ESTADO: string;
    SED_DELETE: string;
    SED_CODOPE: string;
    SED_CODUSU: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Area {
    id: number;
    ARE_CODIGO: string;
    ARE_NOMBRE: string;
    ARE_DETALL: string;
    ARE_EQUIPO: string;
    ARE_ESTADO: string;
    ARE_DELETE: string;
    ARE_CODOPE: string;
    ARE_CODUSU: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Rol {
    id: number;
    code: string;
    name: string;
    detail: string;
    equipe: string;
    codope: string;
    codusu: string;
    permissions: Permission[]
    created_at: string;
    updated_at: string;
}

export interface Modulo{
    id: number;
    MOD_CODIGO: string;
    MOD_NOMBRE: string;
    MOD_DETALL: string;
    MOD_URL:    string;
    MOD_ICONO:  string;
    MOD_PARENT: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface User {
    id?: string;
    code: string;
    name: string;
    email: string;
    password: string;
    state: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Factura {
    id: number;
    fac_tipdoc: string;
    fac_predoc: string;
    fac_numdoc: number;
    fac_fecreg: string;
}

export interface Comercial{
    id?:    string;
    fecope: string;
    period: string;
    anio:   string;
    mes:    string;
    dia:    string;
    codalm: string;
    nitven: string;
    nomven: string;
    codmar: string;
    nommar: string;
    codcla: string;
    nomcla: string;
    tipdoc: string;
    predoc: string;
    numdoc: string;
    dias:   string;
    nomalm: string;
    costo:  number;
    venta:  number;
    utili:  number;
    renta: number;
    venta_total: number;
    utili_total: number;
    venta_contado: number;
    venta_credito: number;
    utilidad_contado: number;
    utilidad_credito: number;
    rentabilidad: number;
    venta_metropolis: number;
    venta_distrimetro: number;
    venta_ferrecasas: number;
    venta_troncal: number;
    venta_minca: number;
    utilid_metropolis: number;
    utilid_distrimetro: number;
    utilid_ferrecasas: number;
    utilid_troncal: number;
    utilid_minca: number;
    renta_minca: number;
    [key: string]: unknown;
}

export interface Movcon {
    id: number;
    MOV_CONMOV: string;
    MOV_EVENTO: string;
    MOV_CODOPE: string;
    MOV_CODALM: string;
    MOV_DETALL: string;
    MOV_CODMOD: string;
    MOV_EQUIPO: string;
    MOV_PERIOD: string;
    MOV_FECOPE: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Stock {
    id: number;
    refere: string;
    nombre: string;
    undmed: string;
    cosigo: string;
    stock:  number;
    valund: number;
}