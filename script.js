$(document).ready(function () {
  let jsonData; // Variável para armazenar o JSON original

  $("#fileInput").on("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          jsonData = JSON.parse(e.target.result); // Defina a variável jsonData com o JSON original
          generateForm(jsonData, $("#jsonForm"));
        } catch (error) {
          console.error("Erro ao analisar o JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  });

  function generateForm(data, parentElement) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const field = data[key];
        const fieldElement = $("<div>").addClass("form-field");

        if (typeof field === "object") {
          const expanderButton = $("<span>")
            .addClass("expander-button")
            .on("click", function () {
              $(this).toggleClass("expanded");
              $(this).siblings(".expandable").slideToggle();
            });

          fieldElement.append(expanderButton);
          fieldElement.append($("<label>").text(key));
          const expandable = $("<div>").addClass("expandable");
          generateForm(field, expandable);
          fieldElement.append(expandable);
        } else {
          fieldElement.append($("<label>").text(key));
          fieldElement.append(
            $("<input>").attr("type", "text").attr("name", key).val(field)
          );
        }

        parentElement.append(fieldElement);
      }
    }
  }

  $("#saveButton").on("click", function () {
    const formElement = document.getElementById("jsonForm");
    const jsonResult = htmlToJson(formElement);
    downloadJsonFile(jsonResult, "updated_data.json");
  });

  function htmlToJson(element) {
    const result = {};

    for (let i = 0; i < element.children.length; i++) {
      const childElement = element.children[i];

      const labelElement = childElement.querySelector("label");
      if (labelElement) {
        const label = labelElement.textContent;

        const expandable = childElement.querySelector(".expandable");
        if (expandable) {
          result[label] = htmlToJson(expandable);
        } else {
          const input = childElement.querySelector("input");
          if (input) {
            result[label] = input.value;
          }
        }
      }
    }

    return result;
  }

  function downloadJsonFile(jsonData, filename) {
    console.log(jsonData);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(jsonData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);

    downloadAnchorNode.style.display = "none";
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
  }
});
