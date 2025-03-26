const container = document.getElementById('container');

let books = [];
let pageCounter = 1;

document.getElementById('previousHeader').disabled = true;
document.getElementById('previousFooter').disabled = true;


// function for fetch books and store it in array
async function getBooks() {
    document.getElementById('filter').value = null || '';
    try {
        let response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${pageCounter}&limit=15`);
        let response_json = await response.json();

        if (!response_json.data || !response_json.data.data || response_json.data.data.length === 0) {
            console.log("No more books to load");
            alert("No more books to load")
            document.getElementById('nextHeader').disabled = true;
            document.getElementById('nextFooter').disabled = true;
            return;
        }

        books.length = 0;

        response_json.data.data.forEach(element => {
            const title = element.volumeInfo?.title || "Unknown Title";
            const author = element.volumeInfo?.authors ? element.volumeInfo.authors.join(', ') : "Unknown Author";
            const publisher = element.volumeInfo?.publisher || "Unknown Publisher";
            const published_date = element.volumeInfo?.publishedDate || "0000-00-00";
            const thumbnail = element.volumeInfo?.imageLinks?.thumbnail || '';
            const infoLink = element.volumeInfo.infoLink || '';
            books.push({ title, author, publisher, published_date, thumbnail , infoLink});
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        alert("Error fetching books")
    }
}


// function for render books on body container element
function render_books() {
    container.innerHTML = '';
    books.forEach(element => {
        const card =  document.createElement('div');
        card.className = 'card';
        card.id = 'card';
        card.innerHTML = `
        <a href="${element.infoLink}" target="blank">
        <h2>Title : ${element.title}</h2>
        <p>Author : ${element.author}</p>
        <p>Publisher : ${element.publisher}</p>
        <p>Published Date : ${element.published_date}</p>
        <p>Book Cover</p>
        <img src=${element.thumbnail}>
        </a>
        `
        container.appendChild(card);
    })
}


// re render books which are filter by user
function render_filtered_books(filtered_books) {
    container.innerHTML = '';
    filtered_books.forEach(element => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>Title : ${element.title}</h2>
            <p>Author : ${element.author}</p>
            <p>Publisher : ${element.publisher}</p>
            <p>Published Date : ${element.published_date}</p>
            <p>Book Cover</p>
            <img src=${element.thumbnail}>
        `;
        container.appendChild(card);
    });
}

//  sort books by date and title
function sort_books() {
    const sortBy = document.getElementById('sortBy').value;
    books.sort((a, b) => {
        if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        } else {
            return new Date(a.published_date) - new Date(b.published_date);
        }
    });
}

// calling three fuction , fetchinhg books then sort it and then render it on user screen
async function display_books() {
    await getBooks();
    sort_books();
    render_books();
}

display_books(); // calling function



// function for toogle between grid and list (flex)
function toggleView() {
    container.classList.toggle('grid');
    container.classList.toggle('flex');
    if (document.getElementById('toggleview').textContent === 'View : Grid') {
         document.getElementById('toggleview').textContent = 'View : List';
    } else {
        document.getElementById('toggleview').textContent = 'View : Grid'
    }
}

// calling next set of books and display it
function next_books() {
    document.getElementById('previousHeader').disabled = false;
document.getElementById('previousFooter').disabled = false;
    pageCounter++;
    display_books();
}

//calling previous set of books and display it
function previous_book() {
    pageCounter--;
    display_books()
}

//filter books using user input
function filter_books() {
    let filter_word = document.getElementById('filter').value.toLowerCase();

    if (!filter_word) {
        render_books();
        return;
    }

    const filtered_books = books.filter(book =>
        book.title.toLowerCase().includes(filter_word) || book.author.toLowerCase().includes(filter_word)
    );

    render_filtered_books(filtered_books);
}



//listening all events and calling approciet function
document.getElementById('toggleview').addEventListener('click', toggleView);
document.getElementById('sortBy').addEventListener('change', function() {
    sort_books();
    render_books();
})

document.getElementById('nextFooter').addEventListener('click', next_books);
document.getElementById('nextHeader').addEventListener('click', next_books);
document.getElementById('previousFooter').addEventListener('click', previous_book);
document.getElementById('previousHeader').addEventListener('click', previous_book);
document.getElementById('filter').addEventListener('input', filter_books)
