class CuentaBancaria {
    constructor(numeroCuenta, saldoInicial = 0, movimientos = []) {
        this.numeroCuenta = numeroCuenta;
        this.saldo = Number(saldoInicial);
        this.movimientos = movimientos.map(movimiento => new Movimiento(
            movimiento.concepto,
            movimiento.valor,
            movimiento.saldoGenerado,
            movimiento.fecha
        ));
    }

    retirar(valor) {
        const cantidad = Number(valor);

        if (cantidad <= 0 || cantidad > this.saldo) {
            return false;
        }

        this.saldo -= cantidad;
        this.registrarMovimiento('Retiro', cantidad);
        return true;
    }

    consignar(valor) {
        const cantidad = Number(valor);

        if (cantidad <= 0) {
            return false;
        }

        this.saldo += cantidad;
        this.registrarMovimiento('Consignación', cantidad);
        return true;
    }

    registrarMovimiento(concepto, valor) {
        this.movimientos.push(new Movimiento(concepto, valor, this.saldo));
    }

    consultarMovimientos() {
        return this.movimientos;
    }
}
