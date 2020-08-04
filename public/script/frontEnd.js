const slug = document.getElementById("slug"),
    display = document.getElementById("display"),
    destination = document.getElementById("destination"),
    inpBtn = document.querySelector("input.btn");

let re = /^([A-Za-z0-9]_?-?){1,9}$/;

console.log("before event listener");
slug.addEventListener("keyup", function (e) {
    if (!slug.value.match(re)) {
        //the input is wrong show the message and disable all further inputs and buttons
        showMessage("Please Enter a valid Slug", true);
        slug.style.borderColor = "red";

        inpBtn.disabled = true;
    } else {
        inpBtn.disabled = false;
        slug.style.borderColor = "green";
    }
    display.value = `http://localhost:3000/${slug.value}`;
});
slug.addEventListener("blur", function () {
    console.log("blur event");
    if (slug.value !== "" && slug.value.match(re)) {
        console.log("fetch");
        fetch(`http://localhost:3000/api/check/${slug.value}`)
            .then(data => data.json())
            .then(console.log("inside fetch"))
            .then(data => checkResponse(data))
            .catch(err => console.log("API Error" + err));
    }
});


//this is the show message function
function showMessage(msg, err = false) {
    if (document.getElementById("span")) {
        document.getElementById("span").remove();
    }


    if (err) {
        const span = document.createElement("span");
        span.id = "span";
        span.setAttribute("role", "alert");
        span.className = "alert alert-danger mr-5";
        document.querySelector(".append").innerHTML = `
            <div class="col-md-4"></div>
    `;
        span.appendChild(document.createTextNode(msg));
        document.querySelector(".append").appendChild(span);
        setTimeout(() => {
            span.remove();
        }, 3000);

    } else {
        const span = document.createElement("span");
        span.id = "span";
        span.setAttribute("role", "alert");
        span.className = "alert alert-success mr-5";
        span.appendChild(document.createTextNode(msg));
        document.querySelector(".append").innerHTML = `
            <div class="col-md-4"></div>
    `;
        document.querySelector(".append").appendChild(span);
        // const parent = document.getElementById("url-form");
        // const sibling = document.getElementById("sibling");
        // parent.insertBefore(span, sibling);
        setTimeout(() => {
            span.remove();
        }, 3000);

    }
}

function checkResponse(data) {
    if (data.err === "none") {
        showMessage("Slug available, you are ready to go");
        inpBtn.disabled = false;
    } else {
        showMessage(data.err, true);
        slug.style.borderColor = "red";
        inpBtn.disabled = true;
    }
}

