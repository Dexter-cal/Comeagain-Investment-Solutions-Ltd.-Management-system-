document.addEventListener('DOMContentLoaded', function () {
    const customerTableBody = document.getElementById('customer-table-body');

    function fetchCustomers(searchQuery = '') {
        const url = searchQuery ? `/api/customers/?search=${searchQuery}` : '/api/customers/';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                customerTableBody.innerHTML = ''; // Clear existing rows
                data.forEach(customer => {
                    const row = `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.category}</td>
                            <td>
                                <button class="btn btn-sm btn-info" data-customer-id="${customer.id}">Edit</button>
                                <button class="btn btn-sm btn-danger" data-customer-id="${customer.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    customerTableBody.innerHTML += row;
                });
            })
            .catch(error => console.error('Error fetching customers:', error));
    }

    // Initial fetch of customers
    fetchCustomers();

    customerTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-danger')) {
            const customerId = event.target.dataset.customerId;
            if (confirm('Are you sure you want to delete this customer?')) {
                fetch(`/api/customers/${customerId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                })
                .then(response => {
                    if (response.ok) {
                        fetchCustomers(); // Refresh the customer list
                    } else {
                        alert('Failed to delete customer.');
                    }
                })
                .catch(error => console.error('Error deleting customer:', error));
            }
        } else if (event.target.classList.contains('btn-info')) {
            const customerId = event.target.dataset.customerId;
            fetch(`/api/customers/${customerId}/`)
                .then(response => response.json())
                .then(customer => {
                    document.getElementById('edit-customer-id').value = customer.id;
                    document.getElementById('edit-name').value = customer.name;
                    document.getElementById('edit-email').value = customer.email;
                    document.getElementById('edit-phone').value = customer.phone;
                    document.getElementById('edit-address').value = customer.address;
                    document.getElementById('edit-category').value = customer.category;
                    const editModal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
                    editModal.show();
                });
        }
    });

    const editCustomerForm = document.getElementById('edit-customer-form');
    editCustomerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const customerId = document.getElementById('edit-customer-id').value;
        const formData = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            address: document.getElementById('edit-address').value,
            category: document.getElementById('edit-category').value,
        };

        fetch(`/api/customers/${customerId}/`, {
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
        .then(data => {
            fetchCustomers(); // Refresh the customer list
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCustomerModal'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error updating customer:', error);
            alert(`Error updating customer: ${JSON.stringify(error)}`);
        });
    });

    const customerSearch = document.getElementById('customer-search');
    customerSearch.addEventListener('input', function () {
        fetchCustomers(this.value);
    });

    const addCustomerForm = document.getElementById('add-customer-form');
    addCustomerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value,
        };

        fetch('/api/customers/', {
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
            fetchCustomers(); // Refresh the customer list
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
            modal.hide();
            addCustomerForm.reset();
        })
        .catch(error => {
            console.error('Error adding customer:', error);
            alert(`Error adding customer: ${JSON.stringify(error)}`);
        });
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
