const budgetController = (function () {
    // private code
    class Income {
        constructor(id, desc, amount) {
            this.id = id,
                this.desc = desc,
                this.amount = amount
        }
    };

    class Expense {
        constructor(id, desc, amount) {
            this.id = id,
                this.desc = desc,
                this.amount = amount,
                this.percentage = -1
        }

        expPercentage(totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.amount / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
            return this.percentage;
        }
    };

    const data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    function calculateTotal(type) {
        let sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.amount;
        });
        data.totals[type] = sum;
    }

    // public code
    return {
        addItem: function (type, desc, amount) {
            let newItem, id;
            // Index of the last element
            let length = data.allItems[type].length;
            if (length > 0) {
                id = data.allItems[type][length - 1].id + 1;
            } else {
                id = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(id, desc, amount);
            } else {
                newItem = new Income(id, desc, amount);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            let ids;
            ids = data.allItems[type].map(element => {
                return element.id;
            });
            const index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget() {
            // Calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');
            // Calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate percentage of the income that spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1
            }
        },

        calculatePercentages() {
            let allPerc = data.allItems.exp.map(element => {
                return element.expPercentage(data.totals.inc);
            });
            return allPerc;
        },

        // getPercentages : function () {
        //     let allPerc = data.allItems.exp.map 
        // },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            }
        },

        getData: function () {
            return data;
        }
    };
})();



const uiController = (function () {
    // private code
    const dom = {
        addType: document.querySelector('.add__type'),
        addDesc: document.querySelector('.add__description'),
        addValue: document.querySelector('.add__value'),
        addBtn: document.querySelector('.add__btn'),
        incomeList: document.querySelector('.income__list'),
        expenseList: document.querySelector('.expenses__list'),
        budgetValue: document.querySelector('.budget__value'),
        totalIncome: document.querySelector('.budget__income--value'),
        totalExpense: document.querySelector('.budget__expenses--value'),
        expPercentage: document.querySelector('.budget__expenses--percentage'),
        deleteButton: document.querySelector('.item__delete--btn'),
        container: document.querySelector('.container'),
        budgetMonth: document.querySelector('.budget__title--month'),
        itemPercentage: '.item__percentage'
    };

    function formatItem(num) {
        num = Math.abs(num);
        num = num.toFixed(2);
        let numSplit = num.split('.');
        let int = numSplit[0];

        if (int.length > 3) {
            int = int.substring(0, int.length - 3) + "," + int.substring(int.length - 3, int.length)
        }
        let dec = numSplit[1];
        // (type === "exp" ? "-" : "+") + ' '
        return int + "." + dec;
    }

    return { // public code
        getInput: function () {
            return {
                type: dom.addType.value,
                desc: dom.addDesc.value,
                amount: parseFloat(dom.addValue.value)
            };
        },

        getDOM: function () {
            return dom;
        },

        addListItem: function (newItem, type) {
            let formattedAmt = formatItem(newItem.amount);

            if (type === 'inc') {
                dom.incomeList.insertAdjacentHTML('afterbegin', `
                <div class="item clearfix" id="inc-${newItem.id}">
                <div class="item__description">${newItem.desc}</div>
                <div class="right clearfix">
                    <div class="item__value">+ ${formattedAmt}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>
                `);
            } else {
                dom.expenseList.insertAdjacentHTML('afterbegin', `
                <div class="item clearfix" id="exp-${newItem.id}">
                <div class="item__description">${newItem.desc}</div>
                <div class="right clearfix">
                    <div class="item__value">- ${formattedAmt}</div>
                    <div class="item__percentage">0%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>
                `);
            }
        },

        clearFields: function () {
            const fields = [dom.addDesc, dom.addValue];
            fields.forEach(element => {
                element.value = "";
            });
            fields[0].focus();
        },

        displayBudget: function (obj) {
            dom.budgetValue.textContent = formatItem(obj.budget);
            dom.totalIncome.textContent = `+ ${formatItem(obj.totalIncome)}`;
            dom.totalExpense.textContent = `- ${formatItem(obj.totalExpense)}`;
            if (obj.percentage === -1) {
                dom.expPercentage.textContent = "---";
            } else {
                dom.expPercentage.textContent = `${obj.percentage}%`;
            }
        },

        deleteListItem: function (id) {
            const element = document.getElementById(id);
            element.remove(element);
        },

        displayPercentage: function (percentages) {
            let index = percentages.length - 1;

            document.querySelectorAll(dom.itemPercentage).forEach(element => {
                element.textContent = `${percentages[index]}%`;
                index--;
            })
            // let fields = document.querySelectorAll(dom.itemPercentage);

            // let nodeListForEach = function (list, callback) {
            //     for (let i = 0; i < list.length; i++) {
            //         callback(list[i], i);
            //     }
            // };

            // nodeListForEach(fields, function (current, index) {
            //     if (percentages[index] === -1) {
            //         current.textContent = "---";
            //     } else {
            //         current.textContent = `${percentages[index]}%`;
            //     }

            // });
        },

        displayMonth: function () {
            const now = new Date();
            let currentMonth = now.getMonth();

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            currentMonth = months[currentMonth];
            dom.budgetMonth.textContent = currentMonth + ", " + now.getFullYear();
        },

        changedType: function () {
            const fields = [dom.addType, dom.addDesc, dom.addValue];
            fields.forEach(element => {
                element.classList.toggle('red-focus');
            });

            dom.addBtn.classList.toggle('red');
        }
    };

})();



// Driver function
const controler = (function (budgetCtrl, uiCtrl) {
    function ctrlAddItem() {
        // Get the input value
        const input = uiCtrl.getInput();

        if (input.amount > 0 && input.desc != "") { // input validation
            // Add amount to the budget controller
            const newItem = budgetCtrl.addItem(input.type, input.desc, input.amount);

            // Add amount to the list
            uiCtrl.addListItem(newItem, input.type);
            // Clear input field
            uiCtrl.clearFields();
            // Update the budget
            updateBudget();
            // Update the percentages
            updatePercentages();
        }
    }


    function ctrlDeleteItem(e) {
        const targetId = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (targetId) {
            let splitId, id, type;
            splitId = targetId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            // Delete item from budget
            budgetCtrl.deleteItem(type, id);
            // Delete item from ui
            uiCtrl.deleteListItem(targetId);
            // update the budget
            updateBudget();
            // update the percentages
            updatePercentages();
        }
    }


    function updateBudget() {
        // Calculate the budget
        budgetCtrl.calculateBudget()
        // Return the budget
        const budget = budgetCtrl.getBudget();
        // Display the budget on the UI
        uiCtrl.displayBudget(budget);
    }


    function updatePercentages() {
        // calculate percentage
        const percentages = budgetCtrl.calculatePercentages()
        //update the ui
        uiCtrl.displayPercentage(percentages);

        console.log(percentages);
    }

    function handlers() {
        // Get dom elements
        const dom = uiCtrl.getDOM();

        // Add item to the list
        dom.addBtn.addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (e) {
            // when enter key is pressed
            if (e.keyCode === 13) {
                ctrlAddItem();
            }
        });

        // Delete list item
        dom.container.addEventListener('click', ctrlDeleteItem);

        dom.addType.addEventListener('change', uiCtrl.changedType);
    }


    return {
        init: function () {
            // Show month
            uiCtrl.displayMonth()

            uiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0
            });
            handlers();
        }
    }
})(budgetController, uiController);


// Intitializing controller
controler.init()
