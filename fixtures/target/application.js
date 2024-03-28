var setupCounter = function(element) {
    var counter = 0;
    var setCounter = function(count) {
        counter = count;
        element.innerHTML = "count is ".concat(counter);
    };
    element.addEventListener("click", function() {
        return setCounter(counter + 1);
    });
    setCounter(0);
};
document.querySelector("#app").innerHTML = '\n  <div>\n    <button id="counter" type="button"></button>\n  </div>\n';
setupCounter(document.querySelector("#counter"));
