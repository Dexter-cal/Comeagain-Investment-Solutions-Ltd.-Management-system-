document.addEventListener('DOMContentLoaded', function () {
    const stockTableBody = document.getElementById('stock-table-body');
    const supplierSelect = document.getElementById('supplier');
    const editSupplierSelect = document.getElementById('edit-supplier');

    function fetchSuppliers() {
        fetch('/api/suppliers/')
            .then(response => response.json())
            .then(data => {
                supplierSelect.innerHTML = '';
                editSupplierSelect.innerHTML = '';
                data.forEach(supplier => {
                    const option = `<option value="${supplier.id}">${supplier.name}</option>`;
                    supplierSelect.innerHTML += option;
                    editSupplierSelect.innerHTML += option;
                });
            });
    }

    function fetchStock(searchQuery = '') {
        const url = searchQuery ? `/api/stock/?search=${searchQuery}` : '/api/stock/';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                stockTableBody.innerHTML = ''; // Clear existing rows
                data.forEach(stock => {
                    fetch(`/api/suppliers/${stock.supplier}/`)
                        .then(response => response.json())
                        .then(supplier => {
                            const row = `
                                <tr>
                                    <td>${stock.name}</td>
                                    <td>${stock.description}</td>
                                    <td>${stock.quantity}</td>
                                    <td>${stock.price}</td>
                                    <td>${supplier.name}</td>
                                    <td>
                                        <button class="btn btn-sm btn-info" data-stock-id="${stock.id}">Edit</button>
                                        <button class="btn btn-sm btn-danger" data-stock-id="${stock.id}">Delete</button>
                                    </td>
                                </tr>
                            `;
                            stockTableBody.innerHTML += row;
                        });
                });
            });
    }

    // Initial fetch
    fetchSuppliers();
    fetchStock();

    // Search
    const stockSearch = document.getElementById('stock-search');
    stockSearch.addEventListener('input', function () {
        fetchStock(this.value);
    });

    // Add Stock
    const addStockForm = document.getElementById('add-stock-form');
    addStockForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            quantity: document.getElementById('quantity').value,
            price: document.getElementById('price').value,
            supplier: document.getElementById('supplier').value,
        };

        fetch('/api/stock/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            fetchStock();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addStockModal'));
            modal.hide();
            addStockForm.reset();
        })
        .catch(error => alert(`Error: ${JSON.stringify(error)}`));
    });

    // Edit and Delete
    stockTableBody.addEventListener('click', function (event) {
        const stockId = event.target.dataset.stockId;
        if (event.target.classList.contains('btn-danger')) {
            if (confirm('Are you sure you want to delete this stock item?')) {
                fetch(`/api/stock/${stockId}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') },
                })
                .then(() => fetchStock());
            }
        } else if (event.target.classList.contains('btn-info')) {
            fetch(`/api/stock/${stockId}/`)
                .then(response => response.json())
                .then(stock => {
                    document.getElementById('edit-stock-id').value = stock.id;
                    document.getElementById('edit-name').value = stock.name;
                    document.getElementById('edit-description').value = stock.description;
                    document.getElementById('edit-quantity').value = stock.quantity;
                    document.getElementById('edit-price').value = stock.price;
                    document.getElementById('edit-supplier').value = stock.supplier;
                    const editModal = new bootstrap.Modal(document.getElementById('editStockModal'));
                    editModal.show();
                });
        }
    });

    // Edit Stock Form
    const editStockForm = document.getElementById('edit-stock-form');
    editStockForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const stockId = document.getElementById('edit-stock-id').value;
        const formData = {
            name: document.getElementById('edit-name').value,
            description: document.getElementById('edit-description').value,
            quantity: document.getElementById('edit-quantity').value,
            price: document.getElementById('edit-price').value,
            supplier: document.getElementById('edit-supplier').value,
        };

        fetch(`/api/stock/${stockId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(() => {
            fetchStock();
            const modal = bootstrap.Modal.getInstance(document.getElementById('editStockModal'));
            modal.hide();
        })
        .catch(error => alert(`Error: ${JSON.stringify(error)}`));
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
