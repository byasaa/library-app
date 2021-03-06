const connection = require('../helper/mysql')

module.exports = {
    bookDetailModel : (id) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT books.id as id, books.title as title, books.description as description, books.image as image, genres.name as genre, genres.id as genre_id,authors.name as author, authors.id as author_id, books.book_status as status, books.created_at as created_at, books.updated_at as updated_at FROM books INNER JOIN genres ON books.genre_id = genres.id INNER JOIN authors ON books.author_id = authors.id WHERE books.id = ?", id, (error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result)
            })
        })
    },
    getBookModel : (search, order, sort, limit, page) => {
        let offset = (limit * page) - limit
        return new Promise((resolve, reject) => {
            const find = `%${search}%`
            connection.query(`SELECT books.id as id, books.title as title, books.description as description, books.image as image, genres.name as genre,authors.name as author, books.book_status, books.created_at, books.updated_at FROM books INNER JOIN genres ON books.genre_id = genres.id INNER JOIN authors ON books.author_id = authors.id WHERE title LIKE ? OR description LIKE ? OR genres.name LIKE ? OR authors.name LIKE ? OR book_status LIKE ? ORDER BY ${order} ${sort} LIMIT ? OFFSET ?`, [find ,find, find, find, find, limit, offset], (error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result)
            })
        })
    },
    loanBookModel: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO loans SET ?", setData, (error, result) => {
                if (error) {
                    reject(error)
                }
                const newData = {
                    id :result.insertId,
                    ...setData
                }
                resolve(newData)
                connection.query('UPDATE books SET book_status="Borrowed" WHERE id=?', setData.book_id)
            })
        })
    },
    returnBookModel: (setData,id) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE loans SET ? WHERE id=?', [setData,setData.id], (error, result) => {
                if (error) {
                    reject(error)
                }
                const newData = {
                    id,
                    book_status :'Available',
                    ...setData
                }
                resolve(newData)
                connection.query('UPDATE books SET book_status="Available" WHERE id=?', id)
            })
        })
    },
    addBookModel : (setData) => {
        return new Promise((resolve,reject) => {
            connection.query("INSERT INTO books SET ?", setData, (error, result) => {
                if (error) {
                    reject(error)
                }
                const newData = {
                    id :result.insertId,
                    ...setData
                }
                resolve(newData)
            })
        })
    },
    updateBookModel : (setData, id) => {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE books SET ? WHERE id=?", [setData, id], (error, result) => {
                if (error) {
                    reject(error)
                }
                const newData = {
                    id,
                    ...setData
                }
                resolve(newData)
            })
        })
    },
    deleteBookModel : (id) => {
        return new Promise((resolve,reject) => {
            connection.query("DELETE FROM books WHERE id=?", id, (error, result) =>{
                if (error) {
                    reject(error)
                }
                const newData = {
                    id
                }
                resolve(newData)
            })
        })
    }
}