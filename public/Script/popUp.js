// Wait for the DOM to load
console.log("HELLO WOLRD") ;
document.addEventListener('DOMContentLoaded', function () {
    // Run after 3 seconds (3000ms)
    setTimeout(function () {
        // Hide the popup
        let pop = document.getElementsByClassName('successPop')[0] ;
        if(pop) pop.style.display = "none";
        // console.log("hi",pop) ;
    }, 3000); // or 4000 for 4 seconds
});