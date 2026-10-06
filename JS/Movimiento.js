class Movimiento {
    constructor(concepto, valor, saldoGenerado, fecha = new Date().toLocaleString()) {
        this.fecha = fecha;
        this.concepto = concepto;
        this.valor = Number(valor);
        this.saldoGenerado = Number(saldoGenerado);
    }
}
