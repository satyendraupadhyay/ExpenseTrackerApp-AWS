const token = localStorage.getItem('token');
const pagination = document.getElementById('pagination');
const expense = document.getElementById('expense');
const expenseForm = document.getElementById('expense');
const itemsParent = document.getElementById('items');

expenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    try {
        const response = await axios.post(`/expense/add-expense`, {
            amount,
            description,
            category
        }, {
            headers: { "Authorization": token }
        });
        const newExpense = response.data.newExpenseDetail;
        const table = document.getElementById('table');
        if (!table) {
            console.error("Table element not found.");
            return;
        }
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <th scope="row">${newExpense.id}</th>
            <td>${newExpense.amount}</td>
            <td>${newExpense.description}</td>
            <td>${newExpense.category}</td>
            <td><button class="btn btn-sm btn-primary border deleteBtn">Delete</button></td>
        `;
        const deleteBtn = newRow.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', async () => {
            try {
                await axios.delete(`/expense/delete-expense/${newExpense.id}`, {headers: { "Authorization": token }});
                newRow.parentNode.removeChild(newRow);
            } catch (err) {
                console.error("Error deleting expense:", err);
            }
        });
        const tbody = table.querySelector('tbody');
        tbody.appendChild(newRow);
    } catch (err) {
        console.error("Error adding expense:", err);
    }
});

function showUserTable(productDetails) {
    const parent = document.getElementById('table');
    if (!parent) {
        console.error("Parent element 'table' not found.");
        return;
    }
    parent.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'table table-sm';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columns = ['#', 'Amount', 'Description', 'Category' , 'Delete'];
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    productDetails.forEach((product, index) => {
        const itemID = product.id;
        const amount = product.amount;
        const description = product.description;
        const category = product.category;
        const row = document.createElement('tr');
        const idCell = document.createElement('th');
        idCell.setAttribute('scope', 'row');
        idCell.textContent = itemID;
        const amountCell = document.createElement('td');
        amountCell.textContent = amount;
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = description;
        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        const deleteCell = document.createElement('td');
        const deleteCellBtn = document.createElement('button');
        deleteCellBtn.className = 'btn btn-sm btn-primary border';
        deleteCellBtn.textContent = "Delete";
        deleteCellBtn.addEventListener('click', async function () {
            try {
                await axios.delete(`/expense/delete-expense/${itemID}`, { headers: { "Authorization": token } });
                row.remove();
            } catch (err) {
                console.error("Error deleting expense:", err);
            }
        });
        deleteCell.appendChild(deleteCellBtn);
        row.appendChild(idCell);
        row.appendChild(amountCell);
        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(deleteCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    parent.appendChild(table);
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = 'hidden';
    const premiumBtn = document.getElementById('message');
    premiumBtn.className = 'btn btn-sm btn-danger'
    premiumBtn.textContent = "You're premium user ⭐";
}

document.getElementById('rzp-button1').onclick = async (e) => {
    const response = await axios.get(`/purchase/premiummembership`, { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post(`/purchase/updatetransactionstatus`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })

            alert('You are a premium user now');
            showPremiumuserMessage();
            localStorage.setItem('token', res.data.token);
            showLeaderboard();
            savedFiles();
            download();
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('Something went wrong');
    })
}

function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, limit=5 }) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.textContent = "Previous";
        btn2.className = 'btn btn-sm btn-secondary';
        btn2.addEventListener('click', () => getExpenses(previousPage, limit));
        pagination.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.className = 'btn btn-sm btn-secondary';
    btn1.innerHTML = `${currentPage}`;
    btn1.addEventListener('click', () => getExpenses(currentPage, limit));
    pagination.appendChild(btn1);
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.className = 'btn btn-sm btn-secondary';
        btn3.textContent = "Next";
        btn3.addEventListener('click', () => getExpenses(nextPage, limit));
        pagination.appendChild(btn3);
    }
}

const getExpenses = async (page, limit=5) => {
    if(localStorage.getItem('limit')){
        limit = localStorage.getItem('limit');
    }
    try {
        const res = await axios.get(`/expense/get-expense?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        showUserTable(res.data.expenses)
        showPagination(res.data);
    } catch (err) {
        console.log(err);
    }
}

function setPaginationLimit(){
    const paginationLimit = document.getElementById('paginationLimit');
    paginationLimit.addEventListener('change', () => {
        localStorage.setItem('limit', paginationLimit.value);
        window.location.reload();
    });
}

function savedFiles() {
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Downloaded History';
    inputElement.className = 'btn btn-sm btn-light';
    inputElement.onclick = async () => {
        var savedFilesHeading = document.getElementById('download-history-heading');
        savedFilesHeading.innerHTML += '<h3> Complete Download History: </h3>';
        const res = await axios.get(`/premium/files`, { headers: { "Authorization": token } });
        const parent = document.getElementById('files');
        const table = document.createElement('table');
        table.className = 'table table-sm';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const columns = ['Date/Time', 'Download'];
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        res.data.forEach(data => {
            const row = document.createElement('tr');
            const dateTimeCell = document.createElement('td');
            dateTimeCell.textContent = new Date(data.createdAt).toLocaleString();
            const downloadCell = document.createElement('td');
            const button = document.createElement('button');
            button.className = 'btn btn-sm btn-primary border';
            button.textContent = 'Download Again';
            button.onclick = () => window.open(data.fileURL, '_blank');
            downloadCell.appendChild(button);
            row.appendChild(dateTimeCell);
            row.appendChild(downloadCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        parent.appendChild(table);
        parent.style.maxHeight = '200px';
        parent.style.overflowY = 'auto';
    };
    document.getElementById("savedFilesBtn").appendChild(inputElement);
}

function download() {
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Download Expenses'
    inputElement.className = 'btn btn-sm btn-light'
    inputElement.onclick = async() => {
        axios.get(`/premium/download`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    document.getElementById("downloadFileBtn").appendChild(inputElement);  
}  

function showLeaderboard() {
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.className = 'btn btn-sm btn-light';
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get(`/premium/showleaderboard`, { headers: {"Authorization" : token} });
        var leaderboardHeading = document.getElementById('leaderboard-heading');
        leaderboardHeading.innerHTML = '<h3> LeaderBoard: </h3>'; // Clear the heading and set it again
        var leaderboardElem = document.getElementById('leaderboard');
        leaderboardElem.innerHTML = ''; // Clear the leaderboard before rendering again
        const table = document.createElement('table');
        table.className = 'table table-sm';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const columns = ['#', 'Name', 'Total Expenses'];
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        userLeaderBoardArray.data.forEach((userDetails, index) => {
            const itemID = userDetails.id;
            const name = userDetails.name;
            const totalExpenses = userDetails.totalExpenses || 0;
            const row = document.createElement('tr');
            const idCell = document.createElement('th');
            idCell.setAttribute('scope', 'row');
            idCell.textContent = index + 1;
            const nameCell = document.createElement('td');
            nameCell.textContent = name;
            const totalExpensesCell = document.createElement('td');
            totalExpensesCell.textContent = totalExpenses;
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(totalExpensesCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        leaderboardElem.appendChild(table);
        leaderboardElem.style.maxHeight = '200px';
        leaderboardElem.style.overflowY = 'auto';
    };
    document.getElementById("leaderboardBtn").appendChild(inputElement);
}

function showPremiumTag() {
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage();
        showLeaderboard();
        savedFiles();
        download();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    getExpenses();
    setPaginationLimit();
    showPremiumTag();
})
