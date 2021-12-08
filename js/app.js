var budgetController = (function(){
    var Expenses = function(id,description,value) {
        this.id = id,
        this.description = description,
        this.value = value
    };
    var Incomes = function(id,description,value) {
        this.id= id,
        this.description = description,
        this.value = value
    };
    var calculateTotals = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget: 0,
        porcentage: -1
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
            // Create a new item
            if(type === 'exp'){
                newItem = new Expenses(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Incomes(ID, des, val);
            }
            data.allItems[type].push(newItem); // Push it into a data structure
            return newItem; //return a new element
        },
        calculateBudget:function(){
            // calculate total incomes or expense
            calculateTotals('inc');
            calculateTotals('exp');
            // calcule de budget: incomes - expenses
            data.budget =  data.totals.inc - data.totals.exp;
            // calculate percentage
            if (data.totals.inc > 0 ){
                data.porcentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.porcentage = -1;
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                porcentage: data.porcentage
            }
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
        inputButton: '.btn-add',
        incomesContainer: '.incomes-list',
        expensesContainer: '.expenses-list'
        
    }
    // In this method retunrs an Object where we store all the values of input DOM
    return {        
        getImput: function(){ // Here we read the data in the User Interface
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            } 
        },
        addListItem: function(obj, type) {
            var HTML, newHTML, element;
            //Create a HTML string
            if(type === 'inc'){
                element = DOMstrings.incomesContainer;
                HTML = '<div class="incomes-list"><div class="item clearfix" id="incomes-%id%"><div '+
                       'class="item-description">%description%</div><div class="left clearfix" id="incomes-0">'+
                       '<div class="item-value">%value%</div><div class="item-delete">'+
                       '<button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div></div>';
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                HTML = '<div class="item clearfix" id="expense-%id%"><div class="item-description">%description%</div>'+
                       '<div class="right clearfix"><div class="item-value">%value%</div><div class="item-porcentage">'+
                       '21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline">'+
                       '</i></button></div></div></div>';
            }
            //Remplace the placeholder text with some actual data
            newHTML = HTML.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%',obj.description);
            newHTML = newHTML.replace('%value%',obj.value);
            //Insert the HTML into a DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
        },
        clearFields: function(obj, type) {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); // here convert fields(It's a list) into an array
            //fieldsArr.forEach(function(current, index, array) {
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });   
            fieldsArr[0].focus();
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
            if(event.key === 13 || event.keyCode === 13  || event.which === 13) addItemsCtrl();
        });
    };
    var updateBudget = function(){
        // 5. Calcular el budget
        budgetCtrl.calculateBudget();
        // 6. Return the budget
        var budget = budgetCtrl.getBudget();
        // 7. Mostrar los datos al User

    };
    var addItemsCtrl = function(){
        var input, newItems, newListItem;
        // 1. Tomar los datos de Input Items
        input = UICtrl.getImput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Agregar los datos al budgetController
            newItems = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Agregar los datos al UIController
            newListItem = UICtrl.addListItem(newItems, input.type);
            // 4. Clear UI fields
            UICtrl.clearFields();
            // 5. Calculate and updates the budget
            updateBudget();
        }  
    };
    return {        
        init: function(){ 
            setupEventListeners(); 
            console.log('App has started')
        }
    };
})(budgetController,UIController);

globalController.init();