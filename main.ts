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
    odo_M1 = nezhaV2.readRelAngle(nezhaV2.MotorPostion.M1)
    odo_M4 = nezhaV2.readRelAngle(nezhaV2.MotorPostion.M4)
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
// Función genérica para controlar el tiempo y la velocidad.
// Nota: Deberás colocar dentro de esta función los bloques reales de tu controlador de motores (Ej: Wukong, Superbit, etc.)
function moverRobot(velIzquierda: number, velDerecha: number, tiempoMs: number) {
    // ⚠️ REEMPLAZA ESTE COMENTARIO CON TUS BLOQUES DE MOTOR ⚠️
    // Ejemplo si usas Wukong:
    // wuKong.setAllMotor(velIzquierda, velDerecha)

    // Pausa equivalente al tiempo que mantuviste presionado el control
    basic.pause(tiempoMs)
}

input.onButtonPressed(Button.A, function () {
    // Fase 1: 0.0s a 9.5s 
    // En tu telemetría los motores estuvieron estáticos o en preparación
    moverRobot(0, 0, 9500)

    // Fase 2: 9.5s a 14.2s (Aceleración y curva inicial)
    // El encoder 0 subió más rápido que el 1. Relación de ~1.5 a 1.
    moverRobot(75, 50, 4700)

    // Fase 3: 14.2s a 19.2s (Avance casi recto y sostenido)
    // Ambos encoders avanzaron a la misma tasa (~230 puntos por segundo).
    moverRobot(80, 80, 5000)

    // Fase 4: 19.2s a 24.1s (Mantenimiento de rumbo)
    // Ligera corrección, el motor derecho redujo mínimamente su giro.
    moverRobot(75, 70, 4900)

    // Fase 5: 24.1s a 28.3s (Desaceleración y giro de aproximación)
    // Caída drástica de velocidad. El motor derecho giró más que el izquierdo.
    moverRobot(30, 45, 4200)

    // Fase 6: 28.3s a 31.5s (Ajuste fino en la posición)
    // El motor izquierdo retrocedió ligeramente mientras el derecho seguía avanzando.
    moverRobot(-20, 40, 3200)

    // Freno total (Fin de la rutina cartografiada)
    moverRobot(0, 0, 0)
})