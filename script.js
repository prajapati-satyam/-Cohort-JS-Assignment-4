const container = document.getElementById('container');



async function getBooks() {
    let a = await fetch('https://api.freeapi.app/api/v1/public/books?limit=20');
    let responce_json = await a.json();
    // console.log(responce_json.data.data);

    responce_json.data.data.forEach(element => {
        const title = element.volumeInfo.title;
        const author = element.volumeInfo.authors.toString();
        const publisher = element.volumeInfo.publisher;
        const published_date = element.volumeInfo.publishedDate;
        const card =  document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>Title : ${title}</h2>
            <p>Author : ${author}</p>
            <p>Publisher ${publisher}</p>
            <p>Published Date : ${published_date}</p>
            <p>Book Cover</p>
            <img src=${element.volumeInfo.imageLinks.thumbnail}>
        `
         container.appendChild(card);
    });
}


getBooks()