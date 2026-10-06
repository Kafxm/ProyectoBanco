class Banco {
    constructor(usuario = null, cuenta = null) {
        this.usuario = usuario;
        this.cuenta = cuenta;
        this.intentosFallidos = 0;
        this.bloqueado = false;
    }

    registrarUsuario(usuario, cuenta) {
        this.usuario = usuario;
        this.cuenta = cuenta;
        this.intentosFallidos = 0;
        this.bloqueado = false;
    }

    tieneUsuarioRegistrado() {
        return this.usuario !== null && this.cuenta !== null;
    }

    validarIngreso(nombreCuenta, numeroCuenta) {
        if (this.bloqueado) {
            return false;
        }

        const ingresoCorrecto = this.tieneUsuarioRegistrado() &&
            this.usuario.nombreCuenta === nombreCuenta &&
            this.cuenta.numeroCuenta === numeroCuenta;

        if (ingresoCorrecto) {
            this.intentosFallidos = 0;
            return true;
        }

        this.intentosFallidos++;
        if (this.intentosFallidos >= 3) {
            this.bloqueado = true;
        }

        return false;
    }

    quedanIntentos() {
        return 3 - this.intentosFallidos;
    }
}
