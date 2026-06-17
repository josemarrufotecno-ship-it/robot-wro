radio.onReceivedValue(function (name, value) {
    if (name == "x") {
        valorX = value
    }
    if (name == "y") {
        valorY = value
    }
})
let trama = ""
let accel = 0
let brujula = 0
let odo_M4 = 0
let odo_M1 = 0
let valorX = 0
let valorY = 0
valorY = 512
valorX = 512
// El GOBERNADOR DE VELOCIDAD: Limitamos a 35%
let vel_max = 35
radio.setGroup(1)
basic.forever(function () {
    // --- PARTE A: MOVIMIENTO SUAVIZADO ---
    if (valorX < 350) {
        nezhaV2.start(nezhaV2.MotorPostion.M1, Math.map(valorX, 500, 0, 0, vel_max))
        nezhaV2.start(nezhaV2.MotorPostion.M4, 15)
    } else if (valorX > 700) {
        nezhaV2.start(nezhaV2.MotorPostion.M1, -15)
        nezhaV2.start(nezhaV2.MotorPostion.M4, Math.map(valorX, 1023, 540, 0 - vel_max, 0))
    } else if (valorY > 700) {
        nezhaV2.start(nezhaV2.MotorPostion.M1, Math.map(valorY, 540, 1023, 0, vel_max))
        nezhaV2.start(nezhaV2.MotorPostion.M4, Math.map(valorY, 540, 1023, 0, 0 - vel_max))
    } else if (valorY < 500) {
        nezhaV2.start(nezhaV2.MotorPostion.M1, Math.map(valorY, 0, 500, 0 - vel_max, 0))
        nezhaV2.start(nezhaV2.MotorPostion.M4, Math.map(valorY, 0, 500, vel_max, 0))
    } else {
        nezhaV2.start(nezhaV2.MotorPostion.M1, 0)
        nezhaV2.start(nezhaV2.MotorPostion.M4, 0)
    }
    // --- PARTE B: TELEMETRÍA (CON LOS CÓDIGOS ENCONTRADOS) ---
    // Usamos AbsAngle (Ángulo Absoluto) para saber la distancia total desde la salida
    odo_M1 = nezhaV2.readAbsAngle(nezhaV2.MotorPostion.M1)
    odo_M4 = nezhaV2.readAbsAngle(nezhaV2.MotorPostion.M4)
    // Leemos los sensores internos de la placa
    brujula = input.compassHeading()
    accel = input.acceleration(Dimension.Y)
    // Empaquetamos todo separado por comas para Excel
    trama = "" + odo_M1 + "," + odo_M4 + "," + brujula + "," + accel
    // Enviamos la cadena de datos a la micro:bit receptora
    radio.sendString(trama)
    // Pausa de 50ms para mantener el robot fluido y no saturar la señal
    basic.pause(50)
})
