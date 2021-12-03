var budgetController = (function(){
    var Expenses = function(id,description,valeu) {
        this.id = id,
        this.description = description,
        this.valeu = valeu
    }
    var Incomes = function(id,description,valeu) {
        this.id= id,
        this.description = description,
        this.valeu = valeu
    }
    var Data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:[],
            inc:[]
        }
    }

})();

var UIController = (function(){
    // Here was created an Object where we store all DOM strings.
    var DOMstrings = { 
        inputType: '.add--type', 
        inputDescription: '.add--description',
        inputValue: '.add--value',
        inputButton: '.btn-add'
    }
    // In this method retunrs an Object where we store all the values of input DOM
    return {        
        getImput: function(){ // Here we read the data in the User Interface
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            } 
        },
        getDOMstrings: function(){ // Here we make "public" or make accessible the DOMstrings object for the other App Modules
            return DOMstrings;
        }
    }
})();

// Global
var globalController = (function(budgetCtrl, UICtrl) {
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings(); // Here we call DOMstrings Object to get the DOM string that we need
        document.querySelector(DOM.inputButton).addEventListener('click', addItemsCtrl); //Button click
        document.addEventListener('keypress', function(event){ //Enter key
            if(event.keyCode === 13 || event.which === 13) addItemsCtrl();
        });
    }
    //Controller
    var addItemsCtrl = function(){
        // 1. Tomar los datos de Input Items
        var input = UICtrl.getImput();

        // 2. Agregar los datos al budgetController
        // 3. Agregar los datos al UIController
        // 4. Calcular el budget
        // 5. Mostrar los datos al User
      
    }
    return {        
        init: function(){ // Here we read the data in the User Interface
            setupEventListeners();
        }
    }
})(budgetController,UIController);

globalController.init();