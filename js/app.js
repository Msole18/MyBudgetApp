var budgetController = (function(){
    var x = 23;
    return {
        prueba: function(b){
            return b;
        }
    }

})();

var UIController = (function(){

})();
var controller = (function(budgetCtrl,UIctrl){
    document.querySelector('.button').addEventListener('click',function(){
        // 1. Tomar los datos de Input Items

        // 2. Agregar los datos al budgetController

        // 3. Agregar los datos al UIController

        // 4. Calcular el budget

        // 5. Mostrar los datos al User

    });
})(budgetController,UIController);