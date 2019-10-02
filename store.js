const STORE = {
    bookmarks : [],
    adding: false,
    filter: 0,
    error: null
};

const getBookmarks = function() {
    return this.STORE.bookmarks;
};

const addBookmark = function(obj) {
    if(obj.desc === null) {
        obj.desc = '';
    }
    obj.expanded = false;
    this.STORE.bookmarks.push(obj);
};

const deleteBookmark = function(id) {
    this.STORE.bookmarks = this.STORE.bookmarks.filter(itemInArray => itemInArray.id !== id);
};

const refreshBookmarks = function(arrayBookmarks) {
    for(let i = 0; i< arrayBookmarks.length; i++) {
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

const findById = function(id) {
    return STORE.bookmarks.find(obj => obj.id === id);
};

const editBookmark = function(id, obj) {
    let item = findById(id);
    Object.assign(item, obj);
};

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
    addBookmark,
    editBookmark
};