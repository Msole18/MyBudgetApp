var budgetController = (function(){
    var Expenses = function(id,description,valeu) {
        this.id = id,
        this.description = description,
        this.valeu = valeu
    };
    var Incomes = function(id,description,valeu) {
        this.id= id,
        this.description = description,
        this.valeu = valeu
    };
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
    };

    return {        
        addItem: function(type, des, val) { // Adding a New Item
            var newItem, ID;
            // Create a new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }           
            // Create a new Item based
            if(type === 'exp'){
                newItem = new Expenses(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Incomes(ID, des, val);
            }
            data.allItems[type].push(newItem); // Push it into a data structure
            //data[allItems][type].push(newItem); // Push it into a data structure
            return newItem; //return a new element
        },
        testing: function(){
            console.log(data);
        }
    };
})();

var UIController = (function(){
    // Here was created an Object where we store all DOM strings.
    var DOMstrings = { 
        inputType: '.add-type', 
        inputDescription: '.add-description',
        inputValue: '.add-value',
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
    };
})();

// Global
var globalController = (function(budgetCtrl, UICtrl) {
    // Here we read the data in the User Interface
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings(); // Here we call DOMstrings Object to get the DOM string that we need
        document.querySelector(DOM.inputButton).addEventListener('click', addItemsCtrl); //Button click
        document.addEventListener('keypress', function(event){ //Enter key
           // if(event.keyCode === 13  || event.which === 13) addItemsCtrl();
            if(event.key === 13 || event.keyCode === 13  || event.which === 13) addItemsCtrl();
        });
    }
    //Controller
    var addItemsCtrl = function(){
        var input, newItem;
        // 1. Tomar los datos de Input Items
        input = UICtrl.getImput();
        // 2. Agregar los datos al budgetController
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Agregar los datos al UIController
        // 4. Calcular el budget
        // 5. Mostrar los datos al User
    }
    return {        
        init: function(){ 
            setupEventListeners(); 
            console.log('App has started')
        }
    };
})(budgetController,UIController);

globalController.init();