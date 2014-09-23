// Additional jQuery functions


// Hiding and Showing elements that are detached from the DOM sometimes results in wonky displays being used
// This is meant to fix that. Used mainly in the Sheet objects.
$.fn.unhide = function () {
    return this.css('display', '');
};