// Inicialización de variables
let uncoverCards = 0;
let card1 = null;
let card2 = null;
let firtResult = null;
let secondResult = null;
let movements = 0;
let successes = 0;
let timer = false;
let time = 40;
let initialTime = 40;
let regressiveTimeId = null;

// Apuntando a html
let showMovements = document.getElementById('movements');
let showSuccesses = document.getElementById('successes');
let showTime = document.getElementById('time-left');

// Objeto Math con metodo random para generar numeros aleatorios
// ha este método le restaremos -0.5 para poder generar numeros negativos,
// ya que Math.random solo genera desde el 0 hasta el 1

// Generación de números aleatorios
let numbers = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
numbers = numbers.sort(()=>{return Math.random()-0.5});
console.log(numbers);

// Funciones
function countTime(){
    clearInterval(regressiveTimeId); // Asegurar que no haya temporizadores previos
    regressiveTimeId = setInterval(()=>{
        time--;
        showTime.innerHTML = `Tiempo: ${time} segundos`;
        if(time == 0){
            clearInterval(regressiveTimeId);
            blockCards();
            showMessageLose();
        }
    },1000);
}

function blockCards(){
    for (let i = 0; i<=15; i++){
        let blockCard = document.getElementById(i);
        blockCard.innerHTML = numbers[i];
        blockCard.disabled = true;
    }
}

function showMessageLose() {
    var messageLose = document.getElementById('messageLose');
    messageLose.style.display = 'block';
}

function showMessageWin() {
    var messageWin = document.getElementById('messageWin');
    messageWin.style.display = 'block';
}

// Función principal
function uncover(id){

    if(timer == false){
        countTime();
        timer = true;
    }

    uncoverCards++;
    console.log(uncoverCards);

    if(uncoverCards == 1){
        // Mostrar primer número
        card1 = document.getElementById(id);
        firtResult = numbers[id]
        card1.innerHTML = firtResult;

        // Desabilitar primer botón
        card1.disabled = true;
    }else if(uncoverCards == 2){
        // Mostrar segundo número
        card2 = document.getElementById(id);
        secondResult = numbers[id];
        card2.innerHTML = secondResult;

        // Desabilitar segundo botón
        card2.disabled = true;

        // Incrementar movimientos
        movements++;
        showMovements.innerHTML = `Movimientos: ${movements}`;

        if(firtResult == secondResult){
            // Mantener tarjetas destapadas
            uncoverCards = 0;

            // Aumentar aciertos
            successes++;
            showSuccesses.innerHTML = `Aciertos: ${successes}`;

            if(successes == 8){
                clearInterval(regressiveTimeId);
                showSuccesses.innerHTML = `Aciertos: ${successes} 😱`;
                showTime.innerHTML = `Enhorabuena!! Solo tardaste ${initialTime - time} segundos`;
                showMovements.innerHTML = `Movimientos: ${movements} 😎`;
                showMessageWin();
            }
        }else{
            // Destapar y tapar tarjetas en un tiempo
            setTimeout(()=>{
                card1.innerHTML = ' ';
                card2.innerHTML = ' ';
                card1.disabled = false;
                card2.disabled = false;
                uncoverCards = 0;
            },800);
        }
    }

}

// Función para reiniciar el juego
function restartGame() {
    // Restablecer variables
    uncoverCards = 0;
    card1 = null;
    card2 = null;
    firtResult = null;
    secondResult = null;
    movements = 0;
    successes = 0;
    timer = false;
    time = 40;
    initialTime = 40;
    regressiveTimeId = null;

    // Detener cualquier temporizador en ejecución
    clearInterval(regressiveTimeId);
    regressiveTimeId = null;

    // Actualizar la interfaz de usuario
    showMovements.innerHTML = `Movimientos: 0`;
    showSuccesses.innerHTML = `Aciertos: 0`;
    showTime.innerHTML = `Tiempo: ${time} segundos`;

    // Rehabilitar los botones de las tarjetas
    for (let i = 0; i <= 15; i++) {
        let card = document.getElementById(i);
        card.innerHTML = '';  // Limpiar el contenido
        card.disabled = false;  // Habilitar el botón
    }

    // Reorganizar las tarjetas para el nuevo juego
    numbers = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
    numbers = numbers.sort(() => Math.random() - 0.5);
    console.log(numbers);

    // Ocultar el mensaje de "Tiempo agotado"
    var messageLose = document.getElementById('messageLose');
    messageLose.style.display = 'none';

    // Ocultar el mensaje de "Volver a jugar"
    var messageWin = document.getElementById('messageWin');
    messageWin.style.display = 'none';
    
    // Volver a iniciar el temporizador
    // countTime();
}
