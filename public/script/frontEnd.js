const slug = document.getElementById("slug"),
    display = document.getElementById("display"),
    destination = document.getElementById("destination"),
    inpBtn = document.querySelector("input.btn");

let re = /^([A-Za-z0-9]_?-?){1,9}$/;

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
    display.value = `https://sheltered-thicket-25083.herokuapp.com//${slug.value}`;
});
slug.addEventListener("blur", function () {
    if (slug.value !== "" && slug.value.match(re)) {
        fetch(`https://sheltered-thicket-25083.herokuapp.com//api/check/${slug.value}`)
            .then(data => data.json())
            .then(data => checkResponse(data))
            .catch(err => console.error("API Error" + err));
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

