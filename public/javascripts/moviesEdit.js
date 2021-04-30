// Array donde almacenaremos los elementos seleccionados
var aSelected = new Array();
// Puntero al control seleccionado
var multiList_Select = document.getElementById("actores");

 
// Inicializo el array con los valores que
// estan seleccionados en el control
function select_Init()
{
    for (var iList=0; iList<multiList_Select.options.length; iList++)
    {
        aSelected[iList] = multiList_Select.options[iList].selected;
    }
}
 
// Esta funcion se ejecuta cada vez que hay un cambio
// y selecciona todos los elementos anteriormente seleccionados
// y el nuevo en el que se ha hecho click. En el caso que ya estubiera
// seleccionado, sencillamente lo pone a falso en el array
function select_OnChange()
{
    var theIndex = multiList_Select.selectedIndex;
    aSelected[theIndex] = !aSelected[theIndex];
 
    for (var iList=0; iList<multiList_Select.options.length; iList++)
    {
        multiList_Select.options[iList].selected = aSelected[iList];
    }
}
// Esto se lanza solo una vez, y inicializa el array
select_Init();