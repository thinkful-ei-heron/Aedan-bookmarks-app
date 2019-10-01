import store from './store.js';
import api from './api.js';







const getAddingFormHtml = function() {
    return `
    Add a New Bookmark
        <label for="url-input">URL: 
            <input type="url" placeholder="URL eg: https://www.example.com" id = 'url-input' name = 'url' required>
        </label>
        <label for="name-input">Name: 
            <input type="text" placeholder="Name for the bookmark" id = 'name-input' name = 'title' required>
        </label>
        <label for="js-new-rating">Rating:
            <select name="rating" id="js-new-rating">
                <option value="0" selected= 'selected'>0 stars</option>
                <option value="5">5 star</option>
                <option value="4">4 star</option>
                <option value="3">3 star</option>
                <option value="2">2 star</option>
                <option value="1">1 star</option>
            </select>
        </label>
        <textarea name="desc" id="js-description" cols="30" rows="10"></textarea>
        
        <button type="reset">Cancel</button>
        <button type="submit">Submit</button>`;
};

const getExpandedHtml = function(current) {
    return `
    <li id = '${current.id}'>
        <button class = 'js-list-button'>
            <h2>${current.title}</h2> <input type="image" alt = 'trashcan' src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkuWqWxh-GmQxI4AoupFHXh6A3bZbhG4hpj_ScJ5EPIYzumUWZ' class = 'trashcan-img'>
        </button>
        <div>
            <a href="${current.url}">Visit Site</a> <span>Rating: ${current.rating} stars</span>
            <p>${current.desc}</p>
        </div>
    </li>`;
};

const getMinimizedHtml = function(current) {
    return `
    <li id = '${current.id}'>
        <button class = 'js-list-button'>${current.title}<span>Rating: ${current.rating} stars</span></button>
    </li>`;
};

//Html Template Functions
//---------------------------------------------------------------------------------
//Utility Functions

const buttonFunctionality = function(clicked) {
    let liId = clicked.closest('li').attr('id');

    if(clicked.hasClass('trashcan-img')) {
        store.deleteBookmark(liId);
        api.deleteBookmark(liId)
        .then(resp => render());
    } 
    else {
        store.toggleExpanded(liId);
        render();
    }
};

const expandedFunctionality = function(bookArray) {
    let listHtml = '';

    for(let i = 0; i < bookArray.length; i++) {
        if(bookArray[i].expanded) {
            listHtml += getExpandedHtml(bookArray[i]);
        } else {
            listHtml += getMinimizedHtml(bookArray[i]);
        }
    }
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
    if(formObj.rating === '0') {
        delete formObj.rating;
    }
    api.postBookmark(JSON.stringify(formObj))
    .then(resp => render());
};

//Utility Functions
//---------------------------------------------------------------------------------
//Render Functions

const renderAddingForm = function(bool) {
    if(bool) {
        let addFormHtml = getAddingFormHtml();
        $('#js-creating-new').html(addFormHtml);
    } 
    else $('#js-creating-new').empty();
};

const renderBookmarks = function() {

    //api.getbookmarks
    //change store.bookmarks
    api.getBookmarks()
    .then(resp => {
        store.refreshBookmarks(resp);
        let bookArray = store.getBookmarks();

        let filteredArray = bookArray.filter(obj => obj.rating >= store.STORE.filter);

        let listHtml = expandedFunctionality(filteredArray);
        $('#js-bookmark-list').html(listHtml);
    })
    .catch(e => store.setError(e));
};

const render = function() {
    //console.log('render ran');
    
    renderAddingForm(store.STORE.adding);
    renderBookmarks();
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
            $('#js-creating-new').on('submit', e => {
                e.preventDefault();
                let formData = getFormData(e.currentTarget);
                store.toggleAddingBookmark();
                createNew(formData);
            });
        };

        const handleNewReset = function() {
            $('#js-creating-new').on('reset', e => {
                store.toggleAddingBookmark();
                render();
            });
        };

    const handleBookmarkList = function() {
        $('#js-bookmark-list').on('click','.js-list-button', e => {

            buttonFunctionality($(e.target));
        });
    };

const handleEventHandlers = function() {
    handleHeader();
    handleMain();
};

export default {
    render,
    handleEventHandlers
};