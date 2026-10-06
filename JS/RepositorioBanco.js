class RepositorioBanco {
    cargar() {
        const identificacion = localStorage.getItem('identificacion');
        const nombreCuenta = localStorage.getItem('nombreCuenta');
        const correo = localStorage.getItem('correo');
        const numeroCuenta = localStorage.getItem('numeroCuenta');
        const saldo = localStorage.getItem('saldoInicial');
        const historialGuardado = localStorage.getItem('historialMovimientos');

        if (!nombreCuenta || !numeroCuenta) {
            return null;
        }

        const movimientos = historialGuardado ? JSON.parse(historialGuardado) : [];
        const usuario = new Usuario(identificacion, nombreCuenta, correo);
        const cuenta = new CuentaBancaria(numeroCuenta, Number(saldo) || 0, movimientos);
        return new Banco(usuario, cuenta);
    }

    guardar(banco) {
        localStorage.setItem('identificacion', banco.usuario.identificacion);
        localStorage.setItem('nombreCuenta', banco.usuario.nombreCuenta);
        localStorage.setItem('correo', banco.usuario.correo);
        localStorage.setItem('numeroCuenta', banco.cuenta.numeroCuenta);
        localStorage.setItem('saldoInicial', banco.cuenta.saldo);
        localStorage.setItem(
            'historialMovimientos',
            JSON.stringify(banco.cuenta.consultarMovimientos())
        );
    }
}
