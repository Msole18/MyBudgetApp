var budgetController = (function(){
    var Expenses = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expenses.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome ) * 100);
        }else {
            this.percentage = -1;
        }
    };
    
    Expenses.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Incomes = function(id,description,value) {
        this.id= id;
        this.description = description;
        this.value = value;
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
            inc:[],
            exp:[]
        },
        totals:{
            inc:0,
            exp:0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type,id) {
            var IDs, index;
            // We use a map to get all ids and stored in a new array
            IDs = data.allItems[type].map(function (current){
                return current.id;
            });
            // Them we find de index of the ID in the array. In case the item is not find in the array, retunr -1
            index = IDs.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget:function(){
            // calculate total incomes or expense
            calculateTotals('inc');
            calculateTotals('exp');
            // calcule de budget: incomes - expenses
            data.budget =  data.totals.inc - data.totals.exp;
            // calculate percentage
            if (data.totals.inc > 0 ){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercent = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPercent;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
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
        expensesContainer: '.expenses-list',
        budgetLabel: '.budget-value',
        incomesLabel: '.budget-incomes-value',
        expensesLabel: '.budget-expenses-value',
        percentageLabel: '.budget-expenses-percentage',
        itemContainer: '.item-container',
        expPercentageLabel: '.item-percentage'
    }
    // In this method retunrs an Object where we store all the values of input DOM
    return {        
        getInput: function(){ // Here we read the data in the User Interface
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            } 
        },

        addListItem: function(obj, type) { // Here we shows the data in the Incomes or Expense list
            var HTML, newHTML, element;
            //Create a HTML string
            if(type === 'inc'){
                element = DOMstrings.incomesContainer;
                HTML = '<div class="incomes-list"><div class="item clearfix" id="inc-%id%"><div '+
                       'class="item-description">%description%</div><div class="left clearfix" id="incomes-0">'+
                       '<div class="item-value">%value%</div><div class="item-delete"><button class="item-'+
                       'delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div></div>';
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                HTML = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%'+
                       '</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-'+
                       'percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class'+
                       '="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Remplace the placeholder text with some actual data
            newHTML = HTML.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%',obj.description);
            newHTML = newHTML.replace('%value%',obj.value);
            //Insert the HTML into a DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
        },

        deleteListItem: function(selectorID) {
            var removeItem = document.getElementById(selectorID);
            removeItem.parentNode.removeChild(removeItem);
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

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomesLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage>0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentage: function(percentage){
            var fields = document.querySelectorAll(DOMstrings.expPercentageLabel);

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {
                if(percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';  
                } else {
                    current.textContent = '---';
                }
            });
        },

        getDOMstrings: function(){ // Here we make "public" or make accessible the DOMstrings object for the other App Modules
            return DOMstrings;
        }
    };
})();

// Global
var controller = (function(budgetCtrl, UICtrl) {
    // Here we read the data in the User Interface
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings(); // Here we call DOMstrings Object to get the DOM string that we need

        //Add item button event
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem); //Button click
        document.addEventListener('keypress', function(event){ //Enter key
            if(event.key === 13 || event.keyCode === 13  || event.which === 13) ctrlAddItem();
        });

        //Delete item button event
        // Add an event to the container wich its the firt element that the income or expense items have in common
        // because we wan to use Event Delagation 
        document.querySelector(DOM.itemContainer).addEventListener('click', ctrlDeleteItem); 
    };

    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget 
        UICtrl.displayBudget(budget);
    };

    var updatePercenteges = function(){
        // 1. Calculate the percenteges
        budgetCtrl.calculatePercentages();
        // 2. Read the percenteges
        var percentages = budgetCtrl.getPercentages();
        // 3. Display the new percenteges 
        console.log(percentages)
        UICtrl.displayPercentage(percentages);
    };

    var ctrlAddItem = function(){
        var input, newItems, newListItem;
        // 1. Get the input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Agregar los datos al budgetController
            newItems = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Agregar los datos al UIController
            newListItem = UICtrl.addListItem(newItems, input.type);

            // 4. Clear UI fields
            UICtrl.clearFields();

            // 5. Calculate and updates the budget
            updateBudget();

            // 6. Calculate and updates the percenteges
            updatePercenteges();
        }  
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, ID, type;
        // to get the itemID we use the target(point the elemt that was clicked) and parentNode (get parent elemnt)
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item fron the data structure
            budgetCtrl.deleteItem(type,ID);

            // 2. Delete the item fron the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the budget
            updateBudget();

            // 4. Calculate and updates the percenteges
            updatePercenteges();
        }  
    };

    return {        
        init: function(){ 
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });

            setupEventListeners(); 
            console.log('App has started')
        }
    };

})(budgetController,UIController);

controller.init();