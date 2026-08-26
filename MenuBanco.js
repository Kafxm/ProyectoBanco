function pedirdatosNuevousuario(){
    while(true){
        const identificacion = prompt('Ingrese su identificacion:');
        const nombreCuenta = prompt('Ingrese el nombre de la cuenta:');
        const correo = prompt('Ingrese su correo:');
        const numeroCuenta = prompt('Ingrese el numero de la cuenta:');
        const numeroCuentaRep = prompt('Repita el numero de la cuenta:');
        const saldoInicial = prompt('Ingrese el saldo inicial:');
        if(identificacion === null || nombreCuenta === null || correo === null ||
            numeroCuenta === null || numeroCuentaRep === null || saldoInicial === null){
            alert('Registro cancelado.');
            return;
        } else if(!identificacion || !nombreCuenta || !correo || !numeroCuenta || !numeroCuentaRep || !saldoInicial){
            alert('Los campos no pueden estar vacíos. Por favor, intente nuevamente.');
            continue;
        } else if(numeroCuenta !== numeroCuentaRep){
            alert('Los numeros de cuenta no coinciden. Por favor, intente nuevamente.');
            continue;
        } else if(isNaN(saldoInicial) || Number(saldoInicial) < 0){
            alert('El saldo inicial debe ser un número válido y no puede ser negativo.');
            continue;
        }
        localStorage.setItem('identificacion',identificacion);
        localStorage.setItem('nombreCuenta',nombreCuenta);
        localStorage.setItem('correo',correo);
        localStorage.setItem('numeroCuenta',numeroCuenta);
        localStorage.setItem('saldoInicial',saldoInicial);
        alert(`Usuario registrado exitosamente con el nombre de cuenta: ${nombreCuenta},
         numero de cuenta: ${numeroCuenta},
         y saldo inicial: $${saldoInicial}`);
        localStorage.setItem('historialMovimientos', JSON.stringify([]));
        moduloBanco();
        return;
    }
}

function usuarioRegistrado(){
    const obtenerCuenta = localStorage.getItem('nombreCuenta');
    const obtenerNumeroCuenta = localStorage.getItem('numeroCuenta');
    if(obtenerCuenta && obtenerNumeroCuenta){
        let intentos = 0;
        const maxIntentos = 3;
        let ingresoCorrecto = false;
        while(intentos < maxIntentos && ingresoCorrecto === false){
            const usuarioIngresado = prompt('Ingrese el nombre de la cuenta: ');
            const numeroIngresado = prompt('Ingrese el numero de la cuenta: ');
            if(usuarioIngresado === null || numeroIngresado === null){
                alert('Inicio de sesión cancelado.');
                return;
            } else if(usuarioIngresado === obtenerCuenta && numeroIngresado === obtenerNumeroCuenta){
                alert('Ingreso exitoso. Bienvenido al banco.');
                ingresoCorrecto = true;
                moduloBanco();
            } else {
                intentos++;
                alert(`Usuario o numero de cuenta incorrectos. Intento ${intentos} de ${maxIntentos}`);
            }
        }
        if(ingresoCorrecto === false){
            alert('Cuenta de banco bloqueada por 24hrs por seguridad. Por favor, comunicate con el banco para desbloquearla.');
        }
    }
    else{
        alert("No hay usuario registrado, por favor registrese.");
        pedirdatosNuevousuario();
    }
}

function historialMovimientos(concepto, valor, saldoGenerado){
    const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
    const horaActual = new Date().toLocaleString();

    const movimiento = {
        fecha: horaActual,
        concepto: concepto,
        valor: valor,
        saldoGenerado: saldoGenerado
    };
    historial.push(movimiento);
    localStorage.setItem('historialMovimientos', JSON.stringify(historial));
}

function registrarRetiro(cantidadRetiro, saldoInicial){
    saldoInicial -= cantidadRetiro;
    localStorage.setItem('saldoInicial', saldoInicial);
    alert(`Retiro exitoso. Su nuevo saldo es: $${saldoInicial}`);
    historialMovimientos('Retiro', cantidadRetiro, saldoInicial);
    return saldoInicial;
}

function registrarConsignacion(cantidadConsignar, saldoInicial){
    saldoInicial += cantidadConsignar;
    localStorage.setItem('saldoInicial', saldoInicial);
    alert(`Consignación exitosa. Su nuevo saldo es: $${saldoInicial}`);
    historialMovimientos('Consignación', cantidadConsignar, saldoInicial);
    return saldoInicial;
}

function mostrarMovimientos(historial){
    alert("Fecha y Hora            | Concepto     | Valor      | Saldo");
    alert("------------------------------------------------------------");
    historial.forEach(mov => {
        alert(`${mov.fecha} | ${mov.concepto.padEnd(12)} | $${mov.valor.toString().padEnd(9)} | $${mov.saldoGenerado}`);
    });
}

function moduloBanco(){
    let continuar = true;
    let saldoInicial = Number(localStorage.getItem('saldoInicial')) || 0;
    while(continuar){
        const opcion = prompt('Bienvenido al módulo del banco\n\n' + 
            '1. Retirar dinero\n' + 
            '2. Consultar saldo\n' + 
            '3. Consignar dinero\n' + 
            '4. Consultar movimientos\n' + 
            '5. Salir\n\n' + 
            'Ingrese el número de la opción que desea:');
        if(opcion === null){
            alert('Módulo bancario cancelado.');
            return;
        }
        switch(opcion){
            case '1':
                const retiroIngresado = prompt(`Ingrese la cantidad a retirar: su saldo actual es: $${localStorage.getItem("saldoInicial")}`);
                    if(retiroIngresado === null){
                        alert('Retiro cancelado.');
                    } else {
                        const cantidadRetiro = Number(retiroIngresado);
                        if(cantidadRetiro <= saldoInicial && cantidadRetiro > 0){
                            saldoInicial = registrarRetiro(cantidadRetiro, saldoInicial);
                        } else {
                            alert(`Saldo insuficiente o cantidad inválida. Su saldo es de: $${saldoInicial}`);
                        }
                    }
                break;
            case '2':
                alert(`Su saldo actual es: $${localStorage.getItem('saldoInicial')}`);
                break;
            case '3':
                const consignacionIngresada = prompt('Ingrese la cantidad a consignar:');
                if(consignacionIngresada === null){
                    alert('Consignación cancelada.');
                } else {
                    const cantidadConsignar = Number(consignacionIngresada);
                    if(cantidadConsignar > 0){
                        saldoInicial = registrarConsignacion(cantidadConsignar, saldoInicial);
                    } else {
                        alert(`Cantidad inválida. Por favor, ingrese un valor positivo.`);
                    }
                }
                break;
            case '4':
                alert('Movimientos recientes:');
                const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
                if(historial.length === 0){
                    alert('No hay movimientos registrados.');
                }
                else{
                    mostrarMovimientos(historial);
                }
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
function iniciarBanco(){
    while(true){
        const opcion = prompt('BIENVENIDO AL SISTEMA BANCARIO\n\n' +
        '1. Registrar nuevo usuario\n' +
        '2. Iniciar sesión con usuario existente\n' +
        '3. Salir del sistema\n\n' +
        'Ingrese el número de la opción que desea:');
        if(opcion === null){
            alert('Inicio cancelado.');
            return;
        }
        switch(opcion){
            case '1':
                pedirdatosNuevousuario();
                return;
            case '2':
                usuarioRegistrado();
                return;
            case '3':
                alert('Gracias por usar el sistema bancario. ¡Hasta luego!');
                return;
            default:
                alert('Opción inválida. Por favor, seleccione una opción válida.');
        }
    }
}
iniciarBanco();