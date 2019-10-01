const BASE_URL = 'https://thinkful-list-api.herokuapp.com/AedanWar/bookmarks';



const getBookmarks = function() {
    return fetchWrapper(BASE_URL);
};

const postBookmark = function(json) {
    return fetchWrapper(BASE_URL, {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json
    });
};

const deleteBookmark = function(id) {
    return fetchWrapper(`${BASE_URL}/${id}`, {
        'method': 'DELETE',
        'headers': {
            'Content-Type': 'application/json'
        }
    });
};


const fetchWrapper = function(...args) {
    let error ={};
    return fetch(...args)
    .then(resp => {
        if(!resp.ok) {
            error.status = 'Error';
        }
        return resp.json();
    })
    .then(respJson => {
        if(error.status) {
            error.message = respJson.message;
            return Promise.reject(error);
        }
        return respJson;
    });
};


export default {
    getBookmarks,
    postBookmark,
    deleteBookmark,
};