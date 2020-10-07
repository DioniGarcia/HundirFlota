const tablero = document.getElementById("tablero")
const parrafos = Array.from(document.getElementsByTagName('p'))
const puntuacion = document.querySelector(".puntuacion")
const disparos = document.querySelector(".disparos")
const numbers = document.querySelector(".numbers")
const letters = document.querySelector(".letters")
const nuevoJuego = document.querySelector(".nuevo")
const burguer = document.querySelector(".burger");
const navLinks = document.querySelectorAll("li")
const nav = document.querySelector(".nav")
const sideSize = 10
const boatSizes = [2,3,4]

nuevoJuego.addEventListener('click', () =>{
    crearTabla()
    document.querySelector(".nav").classList.toggle("nav-active")
    burguer.classList.toggle('toggle')

    navLinks.forEach((link,index) =>{
        link.style.animation = ''
    })
    

})
const navSlide = () =>{
  
    burguer.addEventListener('click', ()=>{

        nav.classList.toggle("nav-active")

        navLinks.forEach((link,index) =>{
            if(link.style.animation){
                link.style.animation = ''
            }else{
                link.style.animation = "navLinkFade .5s ease forwards "+(index/7+.5)+"s"
            }
        })

        //burguer animation
        burguer.classList.toggle('toggle')
    })
}

navSlide()


var boats = []
var nDisparos = 40
var nPuntuacion = 0
var nHundidos = 0


function fillNumbers (){
    for(var i =1; i< 11; i++){
        el = document.createElement("div")
        el.classList.add("tag")
        
        el.innerHTML = i
        numbers.appendChild(el)
    }
}

function fillLetters(){
    lett = "ABCDEFGHIJ"
    for(var i =0; i< lett.length; i++){
        el = document.createElement("div")
        el.classList.add("tag")
        
        el.innerHTML = lett[i]
        letters.appendChild(el)
    }
}

function randCellStart(){
    return Math.floor(Math.random()*(sideSize*sideSize - 0) + 0)
}

function randMinMax(min,max){
    return Math.floor(Math.random()*(max - min + max))+min
}

function buildBoatPositions(orient, direcc, boatSize){
    
    var done = false
    var boatPositions = []
    while (!done){
        boatPositions = []
        var inicio = randCellStart()
        var positions = boatSize
        for (var i = inicio; positions > 0; positions-- ){
            if( document.getElementById(""+i).classList.contains("barco")){
                break;
            }
            boatPositions.push(i)

            var oldI = i

            if(orient === 0 && direcc === 0){         //H L
                if(i % 10 === 0){
                    break
                } 
                i--
            }else if (orient === 0 && direcc === 1){  //H R
                i++
                if(i % 10 === 0){
                    break
                } 
            } else if (orient === 1 && direcc === 0){ //V U
                i-=sideSize;
            } else {                                  //V D
                i+=sideSize;
            }

            if (i < 0 || i > sideSize*sideSize -1 ){
               break;
            }
        } 
        
        if(boatPositions.length === boatSize){ 
            done = true;
        }
    }

    return boatPositions
}

function insertBoatGrid(boatPositions){
    for(var i =0; i< boatPositions.length; i++){
        document.getElementById(""+boatPositions[i]).classList.remove("primera")
        document.getElementById(""+boatPositions[i]).classList.add("barco")
    }
}



function randomizeBoats(){
    boats = []
    for(var i =0; i< boatSizes.length;i++){
        var orientation = randMinMax(0,1) // 0 horizontal | 1 vertical
        var direction = randMinMax(0,1) // 0 Up/Left | 1 Down/Right
        var boatPositions = buildBoatPositions(orientation,direction,boatSizes[i])
       
        boats.push(boatPositions)
        insertBoatGrid(boatPositions)
    }
    
}

function checkTocado(casilla){
    console.log("casilla: "+casilla+", "+document.getElementById(""+casilla).classList.contains("tocado"))
    return document.getElementById(""+casilla).classList.contains("tocado")
}

function markHundido(posicionesBarco){
    
    updatePuntuacion(100)
    console.log("marcar hundido: "+posicionesBarco)
    console.log("Es un array: "+Array.isArray(posicionesBarco) )
    for(var i = 0; i< posicionesBarco.length; i++){
        console.log("posicion: "+posicionesBarco[i])
        var el = document.getElementById(""+posicionesBarco[i])
        console.log("EL_ELEMENTO: "+el)
        el.classList.remove("tocado")
        el.classList.add("hundido")
    }

    if(++nHundidos === boats.length){
        message("Enhorabuena!","Mision completada con "+nDisparos+" disparos!")
        deactivateCells()
    }

}

function verifyHundido(id){

    idNumeric = parseInt(id)

    for(var i = 0; i< boats.length; i++){
        if(boats[i].indexOf(idNumeric) !== -1){
            var hundido = boats[i].every(checkTocado)
            if (hundido){
                console.log("POSICIONES A MARCAR: "+boats[i])
                markHundido(boats[i])
            }
            break;
        }
    }
}


function changeState(){
    
    var casillaId = this.getAttribute("id")
    console.log(casillaId)


   
    var casilla = document.getElementById(""+casillaId)

    if(casilla.classList.contains("nueva") && casilla.classList.contains("barco")){
        casilla.classList.remove("nueva")
        casilla.classList.add("tocado")
        updatePuntuacion(50)
        verifyHundido(casillaId)
    }
    
    updateDisparos(--nDisparos)
    

}

function updatePuntuacion(points){
    puntuacion.innerHTML = nPuntuacion+=points
}

function updateDisparos(nDisparos){
    disparos.innerHTML = nDisparos
    if(nDisparos === 0){
        message("Game Over", "Intentalo de nuevo!")
    }
}

function message(title, txtmsg){
    document.querySelector(".panel").style.visibility = "visible"
    document.querySelector(".panel > h1").innerHTML=title
    document.querySelector(".panel > p").innerHTML=txtmsg
}

function resetMessage(){
    document.querySelector(".panel").style.visibility = "hidden"
    document.querySelector(".panel > h1").innerHTML=""
    document.querySelector(".panel > p").innerHTML=""
}

function deactivateCells(){
    const cells = document.querySelectorAll("#tablero > div")
    cells.forEach(cell => {
        cell.removeEventListener("click",changeState)
    })
}


function crearTabla(){
    resetMessage()
    nPuntuacion = 0
    nDisparos = 40
    nHundidos = 0
    
    puntuacion.innerHTML = nPuntuacion
    disparos.innerHTML = nDisparos
    
    tablero.innerHTML = ""
    for(var i = 0; i< sideSize*sideSize; i++){
        elem = document.createElement('div')
        elem.addEventListener('click',changeState)
        elem.setAttribute("id",""+i)
        
        elem.classList.add("casilla", "nueva")
        tablero.appendChild(elem)
    }
    randomizeBoats()
}

fillNumbers()
fillLetters()
crearTabla()