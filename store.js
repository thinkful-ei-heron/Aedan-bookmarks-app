const STORE = {
    bookmarks : [
        {
            id: 'x56w',
            title: 'Title 1',
            rating: 3,
            url: 'http://www.title1.com',
            desc: 'lorem ipsum dolor sit',
            expanded: false
        },
        {
            id: '6ffw',
            title: 'Title 2',
            rating: 5,
            url: 'http://www.title2.com',
            desc: 'dolorum tempore deserunt',
            expanded: true
        }
    ],
    adding: false,
    filter: 0,
    error: null
};

const getBookmarks = function() {
    return this.STORE.bookmarks;
};

const refreshBookmarks = function(arrayBookmarks) {
    for(let i = 0; i< arrayBookmarks.length; i++) {
        if (arrayBookmarks[i].rating === null) {
            arrayBookmarks[i].rating = 0;
        }
        if(arrayBookmarks[i].desc === null) {
            arrayBookmarks[i].desc = '';
        }
        let arrayId = arrayBookmarks[i].id;
        let storeObj = findById(arrayId);
        if(storeObj) {
            Object.assign(storeObj, arrayBookmarks[i]);
        } 
        else {
            arrayBookmarks[i].expanded = false;
            this.STORE.bookmarks.push(arrayBookmarks[i]);
        }
    }
};

const deleteBookmark = function(id) {
    let index = findIndex(id);
    this.STORE.bookmarks.splice(index, 1);
};

const findById = function(id) {
    return STORE.bookmarks.find(obj => obj.id === id);
};

const findIndex = function(id) {
    let item = findById(id);
    let index = STORE.bookmarks.findIndex(arrayItem => arrayItem === item);
    return index;
};

//editBookmark?

const toggleExpanded =  function(id) {
    let item = findById(id);
    item.expanded = !item.expanded;
};

const toggleAddingBookmark = function() {
    this.STORE.adding = !this.STORE.adding;
};

const setFilter = function(num) {
    this.STORE.filter = num;
};

const setError = function(e) {
    this.STORE.error = e; 
};

const resetError = function() {
    this.STORE.error = null;
};

export default {
    STORE,
    getBookmarks,
    refreshBookmarks,
    deleteBookmark,
    resetError,
    toggleAddingBookmark,
    setError,
    setFilter,
    toggleExpanded,
};