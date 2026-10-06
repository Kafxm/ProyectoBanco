class MenuBanco {
    constructor(repositorio = new RepositorioBanco()) {
        this.repositorio = repositorio;
        this.banco = repositorio.cargar() || new Banco();
    }

    registrarNuevoUsuario() {
        while (true) {
            const identificacion = prompt('Ingrese su número de identificación:');
            const nombreCuenta = prompt('Ingrese el nombre de la cuenta:');
            const correo = prompt('Ingrese su correo:');
            const numeroCuenta = prompt('Ingrese el número de la cuenta:');
            const numeroCuentaRep = prompt('Repita el número de la cuenta:');
            const saldoInicial = prompt('Ingrese el saldo inicial:');

            if (identificacion === null || nombreCuenta === null || correo === null ||
                numeroCuenta === null || numeroCuentaRep === null || saldoInicial === null) {
                alert('Registro cancelado.');
                return;
            }

            if (!identificacion || !nombreCuenta || !correo || !numeroCuenta ||
                !numeroCuentaRep || !saldoInicial) {
                alert('Los campos no pueden estar vacíos. Por favor, intente nuevamente.');
                continue;
            }

            if (!/^\d+$/.test(identificacion.trim())) {
                alert('La cédula debe contener únicamente números. Por favor, intente nuevamente.');
                continue;
            }

            if (numeroCuenta !== numeroCuentaRep) {
                alert('Los numeros de cuenta no coinciden. Por favor, intente nuevamente.');
                continue;
            }

            if (isNaN(saldoInicial) || Number(saldoInicial) < 0) {
                alert('El saldo inicial debe ser un número válido y no puede ser negativo.');
                continue;
            }

            const usuario = new Usuario(identificacion, nombreCuenta, correo);
            const cuenta = new CuentaBancaria(numeroCuenta, saldoInicial);
            this.banco.registrarUsuario(usuario, cuenta);
            this.repositorio.guardar(this.banco);

            alert(`Usuario registrado exitosamente con el nombre de cuenta: ${nombreCuenta},
         numero de cuenta: ${numeroCuenta},
         y saldo inicial: $${saldoInicial}`);
            this.moduloBanco();
            return;
        }
    }

    iniciarSesion() {
        if (!this.banco.tieneUsuarioRegistrado()) {
            alert('No hay usuario registrado, por favor registrese.');
            this.registrarNuevoUsuario();
            return;
        }

        while (!this.banco.bloqueado && this.banco.intentosFallidos < 3) {
            const usuarioIngresado = prompt('Ingrese el nombre de la cuenta: ');
            const numeroIngresado = prompt('Ingrese el numero de la cuenta: ');

            if (usuarioIngresado === null || numeroIngresado === null) {
                alert('Inicio de sesión cancelado.');
                return;
            }

            if (this.banco.validarIngreso(usuarioIngresado, numeroIngresado)) {
                alert('Ingreso exitoso. Bienvenido al banco.');
                this.moduloBanco();
                return;
            }

            const intento = this.banco.intentosFallidos;
            alert(`Usuario o numero de cuenta incorrectos. Intento ${intento} de 3`);
        }

        alert('Cuenta de banco bloqueada por 24hrs por seguridad. Por favor, comunicate con el banco para desbloquearla.');
    }

    mostrarMovimientos() {
        const historial = this.banco.cuenta.consultarMovimientos();

        if (historial.length === 0) {
            alert('No hay movimientos registrados.');
            return;
        }

        alert('Fecha y Hora            | Concepto     | Valor      | Saldo');
        alert('------------------------------------------------------------');
        historial.forEach(movimiento => {
            alert(`${movimiento.fecha} | ${movimiento.concepto.padEnd(12)} | $${movimiento.valor.toString().padEnd(9)} | $${movimiento.saldoGenerado}`);
        });
    }

    moduloBanco() {
        let continuar = true;

        while (continuar) {
            const opcion = prompt('Bienvenido al módulo del banco\n\n' +
                '1. Retirar dinero\n' +
                '2. Consultar saldo\n' +
                '3. Consignar dinero\n' +
                '4. Consultar movimientos\n' +
                '5. Salir\n\n' +
                'Ingrese el número de la opción que desea:');

            if (opcion === null) {
                alert('Módulo bancario cancelado.');
                return;
            }

            switch (opcion) {
                case '1': {
                    const retiroIngresado = prompt(`Ingrese la cantidad a retirar: su saldo actual es: $${this.banco.cuenta.saldo}`);
                    if (retiroIngresado === null) {
                        alert('Retiro cancelado.');
                    } else if (this.banco.cuenta.retirar(retiroIngresado)) {
                        this.repositorio.guardar(this.banco);
                        alert(`Retiro exitoso. Su nuevo saldo es: $${this.banco.cuenta.saldo}`);
                    } else {
                        alert(`Saldo insuficiente o cantidad inválida. Su saldo es de: $${this.banco.cuenta.saldo}`);
                    }
                    break;
                }
                case '2':
                    alert(`Su saldo actual es: $${this.banco.cuenta.saldo}`);
                    break;
                case '3': {
                    const consignacionIngresada = prompt('Ingrese la cantidad a consignar:');
                    if (consignacionIngresada === null) {
                        alert('Consignación cancelada.');
                    } else if (this.banco.cuenta.consignar(consignacionIngresada)) {
                        this.repositorio.guardar(this.banco);
                        alert(`Consignación exitosa. Su nuevo saldo es: $${this.banco.cuenta.saldo}`);
                    } else {
                        alert('Cantidad inválida. Por favor, ingrese un valor positivo.');
                    }
                    break;
                }
                case '4':
                    alert('Movimientos recientes:');
                    this.mostrarMovimientos();
                    break;
                case '5':
                    alert('Gracias por usar el sistema bancario. ¡Hasta luego!');
                    continuar = false;
                    break;
                default:
                    alert('Opción inválida. Por favor, seleccione una opción válida.');
            }
        }
    }

    iniciar() {
        while (true) {
            const opcion = prompt('BIENVENIDO AL SISTEMA BANCARIO\n\n' +
                '1. Registrar nuevo usuario\n' +
                '2. Iniciar sesión con usuario existente\n' +
                '3. Salir del sistema\n\n' +
                'Ingrese el número de la opción que desea:');

            if (opcion === null) {
                alert('Inicio cancelado.');
                return;
            }

            switch (opcion) {
                case '1':
                    this.registrarNuevoUsuario();
                    return;
                case '2':
                    this.iniciarSesion();
                    return;
                case '3':
                    alert('Gracias por usar el sistema bancario. ¡Hasta luego!');
                    return;
                default:
                    alert('Opción inválida. Por favor, seleccione una opción válida.');
            }
        }
    }
}

new MenuBanco().iniciar();