import Swal from 'sweetalert2'
import storage from './storage'

export const alerta = (msj, icon) => {
    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true
    })
}

export const enviar = async(method, params, url, redir='', token=true) => {
    if(token){
        const authToken = storage.get('authToken');
        axios.defaults.headers.common['Authorization'] = 'Bearer '+authToken;
    }
    let res;
    await axios({method:method, url:url, data:params}).then(
        response => {
            res = response.data,
            (method != 'GET') ? alerta(response.data.message, 'success') : '',
            setTimeout( () => (redir !== '') ? window.location.href = redir : '', 2000)
        }).catch((errors) => {
            let desc = '';
            res = errors.response.data,
            errors.response.data.errors.map((e) => {desc = desc + ' ' + e})
            alerta(desc, 'error')
        })
    return res;
}

export const confirmar = async(name, url, redir) => {
    const alert = Swal.mixmin({buttonsStyling:true});
    alert.fire({
        title: `¿${name}?`,
        text: "¿Estás seguro de que deseas eliminar este elemento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
    }).then((result) => {
        if(result.isConfirmed){
            enviar('DELETE', '', url, redir);
        }
    })
}

export default alerta;