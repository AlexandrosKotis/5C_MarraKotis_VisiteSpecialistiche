export function createForm(parentElement) {
    let data = [];
    let callback = null;
    let cancel = null;
    return {
        setLabels: (labels) => { data = labels; },
        onsubmit: (callbackInput) => { callback = callbackInput },
        oncancel: (callbackInput) => { cancel = callbackInput },
        render: () => {
            let types = ["date", "number", "text"];
            let html = "<div class='modal-body'>";
            const op = generateOptions();
            html += data.map((name, index) => {
                return types[index] === "number" ?
                    `<select class="form-select" id='` + name + `' aria-label="Default select example">
                    <option selected>Orario</option>`
                    + op + "</select>" :
                    "<div class='label'>" + name + "<input type='" + types[index] + "' class='form-control' id='" + name + "'/></div>";
            }).join('\n') + "</div>";
            html +=
                `<div id="result"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger cl" id="cancel" data-bs-dismiss="modal">Cancel</button>
                    <button id='submit' class='btn btn-success'>Submit</button>
                </div>`
                ;
            parentElement.innerHTML = html;
            document.querySelector("#submit").onclick = () => {
                const result = data.map((name) => {
                    return document.querySelector("#" + name).value;
                });
                data.forEach((val) => {
                    const node = document.getElementById(val);
                    if (node.tagName === "SELECT") {
                        const def = document.querySelector("#" + val + " option[selected]");
                        node.value = def.value;
                    }
                    else node.value = "";
                });
                callback(result).then((res) => {
                    console.log(res);
                    if (res === true) document.getElementById("cancel").click();

                }).catch(console.error);
            }
            document.querySelectorAll(".cl").forEach((btn) => {
                btn.onclick = () => {
                    data.forEach((val) => {
                        const node = document.getElementById(val);
                        if (node.tagName === "SELECT") {
                            const def = document.querySelector("#" + val + " option[selected]");
                            node.value = def.value;
                        }
                        else node.value = "";
                    });
                    cancel();
                }
            })
        },
    };
};

function generateOptions() {
    const hours = [8, 9, 10, 11, 12];
    let firstItem = hours[0];
    let lastItem = hours[hours.length - 1];
    let result = "";
    const template = "<option value='%val'>%val</option>"
    for (let i = firstItem; i <= lastItem; i++) {
        result += template.replaceAll("%val", i);
    }
    return result;
}