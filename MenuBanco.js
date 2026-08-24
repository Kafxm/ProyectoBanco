function pedirdatosNuevousuario(){
    const identificacion = prompt('Ingrese su identificacion:');
    const nombreCuenta = prompt('Ingrese el nombre de la cuenta:');
    const correo = prompt('Ingrese su correo:');
    const numeroCuenta = prompt('Ingrese el numero de la cuenta:');
    const numeroCuentaRep = prompt('Repita el numero de la cuenta:');
    const saldoIncial = prompt('Ingrese el saldo inicial:');
     if(!identificacion || !nombreCuenta || !correo || !numeroCuenta || !numeroCuentaRep || !saldoIncial){
        alert('Los campos no pueden estar vacíos. Por favor, intente nuevamente.');
        pedirdatosNuevousuario();
        return;
    }if(numeroCuenta !== numeroCuentaRep){
        alert('Los numeros de cuenta no coinciden. Por favor, intente nuevamente.');
        pedirdatosNuevousuario();
        return;
    }if(saldoIncial < 0){
        alert('El saldo inicial no puede ser negativo. Por favor, intente nuevamente.');
        pedirdatosNuevousuario();
        return;
    }
    localStorage.setItem('identificacion',identificacion);
    localStorage.setItem('nombreCuenta',nombreCuenta);
    localStorage.setItem('correo',correo);
    localStorage.setItem('numeroCuenta',numeroCuenta);
    localStorage.setItem('saldoInicial',saldoIncial);
    alert(`Usuario registrado exitosamente con el nombre de cuenta: ${nombreCuenta},
     numero de cuenta: ${numeroCuenta},
     y saldo inicial: $${saldoIncial}`);
    localStorage.setItem('historialMovimientos', JSON.stringify([]));
    moduloBanco();
}

function usuarioRegistrado(){
    const ObtenerCuenta = localStorage.getItem('nombreCuenta');
    const ObtenerNumeroCuenta = localStorage.getItem('numeroCuenta');
    if(ObtenerCuenta && ObtenerNumeroCuenta){
        let intentos = 0;
        const maxIntentos = 3;
        let ingresoCorrecto = false;
        while(intentos < maxIntentos && ingresoCorrecto === false){
            const usuarioIngresado = prompt('Ingrese el nombre de la cuenta: ');
            const numeroIngresado = prompt('Ingrese el numero de la cuenta: ');
            if(usuarioIngresado === ObtenerCuenta && numeroIngresado === ObtenerNumeroCuenta){
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
    const HoraActual = new Date().toLocaleString();

    const movimiento = {
        fecha: HoraActual,
        concepto: concepto,
        valor: valor,
        saldoGenerado: saldoGenerado
    };
    historial.push(movimiento);
    localStorage.setItem('historialMovimientos', JSON.stringify(historial));
}

function MenuBanco(){
    const opcion = prompt('Bienvenido al banco\n\n' + 
        '1. Registrar nuevo usuario\n' + 
        '2. Iniciar sesión con usuario existente\n' + 
        '3. Salir del sistema\n\n' + 
        'Ingrese el número de la opción que desea:');
    switch(opcion){
        case '1':
            pedirdatosNuevousuario();
            break;
        case '2':
            usuarioRegistrado();
            break;
        default:
            alert('Opción inválida. Por favor, seleccione una opción válida.');
    }
}
function moduloBanco(){
    let continuar = true;
    let saldoInicial = parseFloat(localStorage.getItem('saldoInicial')) || 0;
    while(continuar){
        const opcion = prompt('Bienvenido al módulo del banco\n\n' + 
            '1. Retirar dinero\n' + 
            '2. Consultar saldo\n' + 
            '3. Consignar dinero\n' + 
            '4. Consultar movimientos\n' + 
            '5. Salir\n\n' + 
            'Ingrese el número de la opción que desea:');
            switch(opcion){
            case '1':
                const cantidadRetiro = parseFloat(prompt(`Ingrese la cantidad a retirar: su saldo actual es: $${localStorage.getItem("saldoInicial")}`));
                    if(cantidadRetiro <= saldoInicial && cantidadRetiro > 0){
                        saldoInicial -= cantidadRetiro;
                        localStorage.setItem('saldoInicial', saldoInicial);
                        alert(`Retiro exitoso. Su nuevo saldo es: $${saldoInicial}`);
                        historialMovimientos('Retiro', cantidadRetiro, saldoInicial);
                    }
                    else{
                        alert(`Saldo insuficiente o cantidad inválida. Su saldo es de: $${saldoInicial}`);
                    }
                break;
            case '2':
                alert(`Su saldo actual es: $${localStorage.getItem('saldoInicial')}`);
                break;
            case '3':
                const cantidadConsignar = parseFloat(prompt('Ingrese la cantidad a consignar:'));
                if(cantidadConsignar > 0){
                    saldoInicial += cantidadConsignar;
                    localStorage.setItem('saldoInicial', saldoInicial);
                    alert(`Consignación exitosa. Su nuevo saldo es: $${saldoInicial}`);
                    historialMovimientos('Consignación', cantidadConsignar, saldoInicial);
                }
                else{
                    alert(`Cantidad inválida. Por favor, ingrese un valor positivo.`);
                }
                break;
            case '4':
                alert('Movimientos recientes:');
                const historial = JSON.parse(localStorage.getItem('historialMovimientos')) || [];
                if(historial.length === 0){
                    alert('No hay movimientos registrados.');
                }
                else{
            alert("Fecha y Hora            | Concepto     | Valor      | Saldo");
            alert("------------------------------------------------------------");
            historial.forEach(mov => {
                alert(`${mov.fecha} | ${mov.concepto.padEnd(12)} | $${mov.valor.toString().padEnd(9)} | $${mov.saldo}`);
            });
                break;
            }
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
    const opcion = prompt('BIENVENIDO AL SISTEMA BANCARIO\n\n' +
    '1. Registrar nuevo usuario\n' +
    '2. Iniciar sesión con usuario existente\n' +
    '3. Salir del sistema\n\n' +
    'Ingrese el número de la opción que desea:');
    switch(opcion){
        case '1':
            pedirdatosNuevousuario();
            break;
        case '2':
            usuarioRegistrado();
            break;
        case '3':
            alert('Gracias por usar el sistema bancario. ¡Hasta luego!');
            break;
        default:
            alert('Opción inválida. Por favor, seleccione una opción válida.');
    }
}
iniciarBanco();