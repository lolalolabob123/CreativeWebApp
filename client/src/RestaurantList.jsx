function RestaurantList() {

    const restaurantList = document.getElementById('restaurant-list')

    fetch('/getRestaurants')
        .then(response => response.json())
        .then(proccessData)
        .catch(err => console.error('Failed to load restaurants', err))

    function deleteRestaurant(id) {
        fetch(`deleteRestaurant/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete')
                return response.json()
            })
            .then(deleted => {
                console.log('Deleted:', deleted)
                return fetch('/getRestaurants')
                    .then(res => res.json())
                    .then(proccessData)
            })
            .catch(err => console.error(err))
    }

    function proccessData(data) {
        console.log(data)
        restaurantList.innerHTML = ""
        data.restaurants.forEach(restaurant => {
            const li = document.createElement('li')
            li.innerText = restaurant.name

            const deleteBtn = document.createElement('button')
            deleteBtn.innerText = "Delete"
            deleteBtn.onclick = () => deleteRestaurant(restaurant.id)

            li.appendChild(deleteBtn)
            restaurantList.appendChild(li)
        })
    }
    return (
        <>
            <nav>
                <button onclick="window.location.href = '/'">Home</button>
                <button onclick="window.location.href = '/addRestaurant'">Add restaurant</button>
                <button onclick="window.location.href = '/restaurants'">View Restaurants</button>
            </nav>
            <h1>Restaurant Website</h1>

            <h2>Restaurants</h2>
            <ul id="restaurant-list"></ul>
        </>
    )
}