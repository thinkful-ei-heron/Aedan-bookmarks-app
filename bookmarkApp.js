import store from './store.js';
import api from './api.js';





const getErrorHtml = function(error) {
    return `
    <div id = 'error-box'>
        <span>${error.status}: ${error.message}</span>
    </div>`;
};

const getAddingFormHtml = function() { 
    return `
    <form id = 'js-creating-new'> 
        <legend>Add a New Bookmark</legend>
            <label for="url-input">URL: 
                <input type="url" placeholder="ex: https://www.example.com" id = 'url-input' name = 'url' required>
            </label>
            <label for="name-input">Name: 
                <input type="text" placeholder="Name for the bookmark" id = 'name-input' name = 'title' required>
            </label>
            <label for="js-new-rating">Rating:
                <select name="rating" id="js-new-rating">
                    <option value="1" selected= 'selected'>Default</option>
                    <option value="5">5 star</option>
                    <option value="4">4 star</option>
                    <option value="3">3 star</option>
                    <option value="2">2 star</option>
                    <option value="1">1 star</option>
                </select>
            </label>
            <textarea name="desc" id="js-description" placeholder ='Description of the bookmark'></textarea>
            
            <button type="reset">Cancel</button>
            <button type="submit">Submit</button>
    </form>`;
};

const getExpandedHtml = function(current) {
    return `
    <li id = '${current.id}'>
        <button class = 'js-list-button expanded'>
            <h2>${current.title}</h2> <input type="image" alt = 'trashcan' src = './images/trashcan.png' class = 'trashcan-img'>
        </button>
        <form class = 'expanded-form'>
            <a href="${current.url}">Visit Site</a>
            <label for="js-expanded-rating">Rating: 
                <select name="rating" class="js-expanded-rating">
                    <option value="${current.rating}" selected= 'selected'>${current.rating} star</option>
                    <option value="5">5 star</option>
                    <option value="4">4 star</option>
                    <option value="3">3 star</option>
                    <option value="2">2 star</option>
                    <option value="1">1 star</option>
                </select>
            </label> 
            <div>
                <textarea name="desc" class="js-expanded-textarea" >${current.desc}</textarea>
            </div>
        </form>
    </li>`;
};

const getMinimizedHtml = function(current) {
    return `
    <li id = '${current.id}'>
        <button class = 'js-list-button'><h3>${current.title}</h3><span>Rating: ${current.rating} stars</span></button>
    </li>`;
};

//Html Template Functions
//---------------------------------------------------------------------------------
//Utility Functions

const buttonFunctionality = function(clicked) {
    let liId = clicked.closest('li').attr('id');

    if(clicked.hasClass('trashcan-img')) {
        
        api.deleteBookmark(liId)
        .then(resp => {
            store.deleteBookmark(liId);
            render();
        })
        .catch(e => {
            store.setError(e);
            render();
        });
    } 
    else {
        store.toggleExpanded(liId);
        render();
    }
};

const expandedFunctionality = function(bookArray) {
    let listHtml = '<ul id = "js-bookmark-list">';

    for(let i = 0; i < bookArray.length; i++) {
        if(bookArray[i].expanded) {
            listHtml += getExpandedHtml(bookArray[i]);
        } else {
            listHtml += getMinimizedHtml(bookArray[i]);
        }
    }
    listHtml += '</ul>';
    return listHtml;
};

const filterList = function(stringNum) {
    let numType = parseInt(stringNum);
    store.setFilter(numType);
};

const getFormData = function(form) {
    let formData = new FormData(form);
    let formObj = {};
    formData.forEach((val, name) => formObj[name] = val);
    return formObj;
};

const createNew = function(formObj) {
    api.postBookmark(JSON.stringify(formObj))
    .then(resp => {
        store.addBookmark(resp);
        render();
    })
    .catch(e => {
        store.setError(e);
        render();
    });
};

const updateObject = function(id, obj) {
    api.patchBookmark(id, JSON.stringify(obj))
    .then(resp => {
        store.editBookmark(id, obj);
        render();
    })
    .catch(e => {
        store.setError(e);
        render();
    });
};

//Utility Functions
//---------------------------------------------------------------------------------
//Render Functions

const renderError = function(error) {
    if(error) {
        let errorHtml = getErrorHtml(error);
        return errorHtml;
    }
    else return '';
};

const renderAddingForm = function(bool) {
    if(bool) {
        let addFormHtml = getAddingFormHtml();
        return addFormHtml;
    } 
    else return '';
};

const renderBookmarks = function() {
    let bookArray = store.getBookmarks();

    let filteredArray = bookArray.filter(obj => obj.rating >= store.STORE.filter);

    let listHtml = expandedFunctionality(filteredArray);
    return listHtml;
};

const renderInitial = function() {
    api.getBookmarks()
    .then(resp => {
        store.refreshBookmarks(resp);
        render();
    })
    .catch(e => {
        store.setError(e);
        render();
    });
};

const render = function() {
    let error = renderError(store.STORE.error);
    let adding = renderAddingForm(store.STORE.adding);
    let bookmarks = renderBookmarks();
    $('main').html(`${error}${adding}${bookmarks}`);
    store.resetError();
};

//Render Functions
//---------------------------------------------------------------------------------
//Event Handlers



const handleHeader = function() {
    handleHeaderFormSubmit();
    handleHeaderFormFilter();
};

    const handleHeaderFormSubmit = function() {
        $('#js-header-form').on('submit', e => {
            e.preventDefault();
            store.toggleAddingBookmark();
            render();
        });
    };

    const handleHeaderFormFilter = function() {
        $('#js-header-form').on('change', e => {

            filterList($('#js-header-form-select').val());
            render();
        });
    };

const handleMain = function() {
    handleCreatingNew();
    handleBookmarkList();
};

    const handleCreatingNew = function() {
        handleNewSubmit();
        handleNewReset();
    };
        
        const handleNewSubmit = function() {
            $('main').on('submit', '#js-creating-new', e => {
                e.preventDefault();
                let formData = getFormData(e.target);
                store.toggleAddingBookmark();
                createNew(formData);
            });
        };

        const handleNewReset = function() {
            $('main').on('reset', '#js-creating-new', e => {
                store.toggleAddingBookmark();
                render();
            });
        };

    const handleBookmarkList = function() {
        handleListButtons();
        handleFormChange();
    };

        const handleListButtons = function() {
            $('main').on('click','.js-list-button', e => {

                buttonFunctionality($(e.target));
            });
        };

        const handleFormChange = function() {
            $('main').on('change', '.expanded-form', e => {
               
                let formData = getFormData(e.target.closest('.expanded-form'));
                let id = $(e.target).closest('li').attr('id');
                updateObject(id, formData);
            });
        };

const handleEventHandlers = function() {
    handleHeader();
    handleMain();
};

export default {
    renderInitial,
    handleEventHandlers
};