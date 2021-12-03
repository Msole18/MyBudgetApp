var budgetController = (function(){
    

})();

var UIController = (function(){

})();

// Global
var globalController = (function(budgetCtrl, UICtrl) {
    //Controlle
    var addItemsCtrl = function(){
        // 1. Tomar los datos de Input Items

        // 2. Agregar los datos al budgetController

        // 3. Agregar los datos al UIController

        // 4. Calcular el budget

        // 5. Mostrar los datos al User
        console.log('bien');
    }

    //Button click
    document.querySelector('.btn-add').addEventListener('click', addItemsCtrl);

    //Enter key
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13) addItemsCtrl();
    });

})(budgetController,UIController);
